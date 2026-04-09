/**
 * fuelUpdateService.js — TABLE-BASED
 *
 * Sync flow:
 *  Firebase → Supabase Tables (VehicleFuelCache, VehicleGPSCache, VehicleMonthSummaryCache)
 *  DailyWorkDetail → Supabase Storage (sync cache only, not user-facing)
 *
 * Tables:
 *  VehicleFuelCache          → fuel entries (city, year, month, vehicle, ...)
 *  VehicleGPSCache           → GPS route data (city, year, month, vehicle, date, ward, ...)
 *  VehicleMonthSummaryCache  → summary (city, year, month, total_qty, total_amount, total_km)
 */

import { getData } from "../../services/dbServices";
import { supabase } from "../../createClient";
import { logUsage, saveSummaryCache, saveFuelEntries, saveGPSEntries } from "./fuelCacheService";

// ── Active city — sync/enrich start pe set hota hai ──────────────────────────
let _activeCity = "";

// ── Firebase path → service name ──────────────────────────────────────────────
const resolveFirebaseService = (path) => {
  if (path.startsWith("DieselEntriesData"))   return "DieselEntries";
  if (path.startsWith("DailyWorkDetail"))     return "DailyWorkDetail";
  if (path.startsWith("LocationHistory"))     return "LocationHistory";
  if (path.startsWith("WasteCollectionInfo")) return "WasteCollectionInfo";
  if (path.startsWith("DustbinData"))         return "DustbinData";
  if (path.startsWith("Employees"))           return "EmployeeData";
  return "FirebaseDB";
};

// ── Logged getData — Firebase call + ApiUsageLogs mein save ──────────────────
const loggedGetData = async (path) => {
  const data  = await getData(path);
  const bytes = data ? new Blob([JSON.stringify(data)]).size : 0;
  if (_activeCity) logUsage(_activeCity, null, null, resolveFirebaseService(path), "FirebaseRealtimeDB", bytes);
  return data;
};


const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Bucket check — DailyWorkDetail Storage cache ke liye ─────────────────────
const ensuredBuckets = new Set();
const ensureBucket = async (bucketName) => {
  if (ensuredBuckets.has(bucketName)) return;
  const { data: existing } = await supabase.storage.getBucket(bucketName);
  if (!existing) {
    const { error } = await supabase.storage.createBucket(bucketName, { public: true });
    if (error) throw new Error(`Bucket create failed: ${error.message}`);
  }
  ensuredBuckets.add(bucketName);
};

// ── Haversine formula ─────────────────────────────────────────────────────────
const distanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6377830;
  const toRad = (v) => (v * Math.PI) / 180;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Time range check ──────────────────────────────────────────────────────────
const isTimeInRange = (time, dutyIn, dutyOut) => {
  if (!dutyIn || !dutyOut || !time) return false;
  const [hr, min]       = time.split(":").map(Number);
  const [inHr, inMin]   = dutyIn.split(":").map(Number);
  const [outHr, outMin] = dutyOut.split(":").map(Number);
  return (
    (hr > inHr  || (hr === inHr  && min >= inMin)) &&
    (hr < outHr || (hr === outHr && min <= outMin))
  );
};

// ── Concurrency limiter ───────────────────────────────────────────────────────
const runWithConcurrency = async (items, fn, limit = 4) => {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = await Promise.all(items.slice(i, i + limit).map(fn));
    results.push(...chunk);
  }
  return results;
};

// ── Employee cache — Supabase Storage mein persist ───────────────────────────
const empCache = {};
const TRANSPORT_EXEC_DESIGNATION_ID = "5";
const EMP_CACHE_FILE = "EmployeeCache.json";

const loadEmployeeCache = async (cityName) => {
  const bucketName = String(cityName).toLowerCase().trim();
  const { data, error } = await supabase.storage.from(bucketName).download(EMP_CACHE_FILE);
  if (error || !data) return;
  try {
    const cached = JSON.parse(await data.text());
    Object.assign(empCache, cached);
    console.log(`[EmpCache] Loaded ${Object.keys(cached).length} employees from Storage`);
  } catch { /* ignore */ }
};

const saveEmployeeCache = (cityName) => {
  const bucketName = String(cityName).toLowerCase().trim();
  const blob = new Blob([JSON.stringify(empCache)], { type: "application/json" });
  supabase.storage.from(bucketName)
    .upload(EMP_CACHE_FILE, blob, { upsert: true, contentType: "application/json" })
    .then(({ error }) => { if (error) console.warn("EmpCache save failed:", error.message); });
};

const getEmployeeData = async (empId) => {
  if (empCache[empId] !== undefined) return empCache[empId];
  const data = await loggedGetData(`Employees/${empId}/GeneralDetails`);
  const result = data ? {
    name:          data.name || "",
    designationId: String(data.designationId || ""),
  } : null;
  empCache[empId] = result;
  return result;
};
const prefetchEmployees = (empIds) =>
  Promise.all([...new Set(empIds)].map(getEmployeeData));

// ── In-memory cache — sync ke dauran duplicate Firebase reads hata ────────────
const locationCache    = {};
const wasteInfoCache   = {};

const getLocationRaw = async (zone, vehicle, year, monthName, date) => {
  const key = `${zone}|${vehicle}|${year}|${monthName}|${date}`;
  if (locationCache[key] !== undefined) return locationCache[key];
  const path = zone.includes("BinLifting")
    ? `LocationHistory/BinLifting/${vehicle}/${year}/${monthName}/${date}`
    : `LocationHistory/${zone}/${year}/${monthName}/${date}`;
  locationCache[key] = await loggedGetData(path);
  return locationCache[key];
};

// ── LocationHistory se distance ───────────────────────────────────────────────
const getLocationDistance = async (zone, vehicle, year, monthName, date, startTime, endTime) => {
  if (!startTime) return 0;
  const end  = endTime || "23:59";
  const data = await getLocationRaw(zone, vehicle, year, monthName, date);
  if (!data) return 0;
  let distance = 0;
  Object.entries(data).forEach(([time, details]) => {
    if (isTimeInRange(time, startTime, end))
      distance += Number(details?.["distance-in-meter"] || 0);
  });
  return distance ? Number((distance / 1000).toFixed(3)) : 0;
};

// ── Portal KM — same LocationHistory, cache se (Firebase call nahi) ───────────
const getPortalKm = async (ward, dutyInTime, dutyOutTime, vehicle, year, monthName, date) => {
  const data = await getLocationRaw(ward, vehicle, year, monthName, date); // cache hit
  if (!data || !dutyInTime || !dutyOutTime) return "0";
  let distance = 0;
  Object.entries(data).forEach(([time, details]) => {
    if (isTimeInRange(time, dutyInTime, dutyOutTime))
      distance += Number(details?.["distance-in-meter"] || 0);
  });
  return (distance / 1000).toFixed(3);
};

// ── GPS KM — Wevois VTS + Haversine ──────────────────────────────────────────
// Sync mein use nahi hota (slow) — vehicle click pe on-demand fetch hota hai
export const fetchWevoisGPSKm = async (dutyInTime, dutyOutTime, vehicle, date) => {
  try {
    const url  = `https://wevois-vts-default-rtdb.firebaseio.com/VehicleRoute/${vehicle}/${date}.json`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const data = await fetch(url, { signal: controller.signal }).then((r) => r.json()).finally(() => clearTimeout(timer));
    if (!data || !dutyInTime || !dutyOutTime) return "0";
    const keys = Object.keys(data);
    let distance = 0;
    for (let j = 0; j < keys.length - 2; j++) {
      const t = keys[j], nt = keys[j + 1];
      if (isTimeInRange(t, dutyInTime, dutyOutTime) && isTimeInRange(nt, dutyInTime, dutyOutTime)) {
        const [la, lo]   = String(data[t]).split(",").map(Number);
        const [nla, nlo] = String(data[nt]).split(",").map(Number);
        if (!isNaN(la) && !isNaN(lo) && !isNaN(nla) && !isNaN(nlo))
          distance += distanceInMeters(la, lo, nla, nlo);
      }
    }
    const km = (distance / 1000).toFixed(3);
    if (_activeCity) logUsage(_activeCity, null, null, "WevoisGPS", "ExternalAPI", new Blob([JSON.stringify(data)]).size);
    return km;
  } catch { return "0"; }
};

// ── Duty times + meter readings — WasteCollectionInfo cached ─────────────────
const getTrackAdditionalDetails = async (ward, driver, year, monthName, date) => {
  if (ward.includes("BinLifting")) {
    const data = await loggedGetData(`DailyWorkDetail/${year}/${monthName}/${date}/${driver}`);
    let dutyInTime = "", dutyOutTime = "";
    if (data) {
      for (let i = 1; i <= 5; i++) {
        const task = data[`task${i}`];
        if (task && task.task === ward && task["in-out"]) {
          Object.entries(task["in-out"]).forEach(([t, type]) => {
            if (type === "In") dutyInTime = t; else dutyOutTime = t;
          });
          break;
        }
      }
    }
    return { dutyInTime, dutyOutTime, workPercentage: "", dutyOnReadings: [], dutyOutReadings: [] };
  }

  const cacheKey = `${ward}|${year}|${monthName}|${date}`;
  if (wasteInfoCache[cacheKey] === undefined) {
    wasteInfoCache[cacheKey] = await loggedGetData(`WasteCollectionInfo/${ward}/${year}/${monthName}/${date}/Summary`);
  }
  const data = wasteInfoCache[cacheKey];
  if (!data) return { dutyInTime: "", dutyOutTime: "", workPercentage: "", dutyOnReadings: [], dutyOutReadings: [] };
  return {
    dutyInTime:      data.dutyInTime  ? String(data.dutyInTime).split(",")[0]      : "",
    dutyOutTime:     data.dutyOutTime ? String(data.dutyOutTime).split(",").at(-1) : "",
    workPercentage:  data.workPercentage || "",
    dutyOnReadings:  data.dutyOnMeterReading  ? String(data.dutyOnMeterReading).split(",").map(Number)  : [],
    dutyOutReadings: data.dutyOutMeterReading ? String(data.dutyOutMeterReading).split(",").map(Number) : [],
  };
};

// ── BinLifting dustbin meter map ──────────────────────────────────────────────
const getDustbinMeterReadingMap = async (year, monthName, date) => {
  const data = await loggedGetData(`DustbinData/DustbinAssignment/${year}/${monthName}/${date}`);
  const map  = {};
  if (!data) return map;
  Object.values(data).forEach((plan) => {
    if (!plan.vehicle || !plan.dutyOnMeterReading || !plan.dutyOutMeterReading) return;
    const on  = String(plan.dutyOnMeterReading).split(",").map(Number);
    const out = String(plan.dutyOutMeterReading).split(",").map(Number);
    const f = on[0] || 0, l = out[out.length - 1] || 0;
    map[plan.vehicle] = f && l ? l - f : 0;
  });
  return map;
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: DieselEntriesData → VehicleFuelCache table
// ─────────────────────────────────────────────────────────────────────────────
const saveDieselEntriesJSON = async (cityName, year, monthName) => {
  const data = await loggedGetData(`DieselEntriesData/${year}/${monthName}`);
  if (!data) return { totalAmount: 0, totalQty: 0 };
  const fuelList = [];
  let totalAmount = 0, totalQty = 0;
  Object.entries(data).forEach(([date, obj]) => {
    const keys = Object.keys(obj);
    keys.slice(0, keys.length - 1).forEach((idx) => {
      const e = obj[idx];
      if (!e?.vehicle) return;
      const amount = Number(e.amount || 0), qty = Number(e.quantity || 0);
      totalAmount += amount; totalQty += qty;
      fuelList.push({
        vehicle: e.vehicle, date,
        fuelType: e.fuelType || "", orderBy: new Date(date).getTime(),
        amount: amount.toFixed(2), quantity: qty.toFixed(2),
        meterReading: e.meterReading || "00",
        fuelVehicle: e.fuelVehicle || "", petrolPump: e.petrolPump || "",
        payMethod: e.payMethod || "", remark: e.remark || "",
      });
    });
  });
  fuelList.sort((a, b) => a.orderBy - b.orderBy);
  await saveFuelEntries(cityName, year, monthName, fuelList);
  console.log(`[Sync] VehicleFuelCache — ${fuelList.length} entries saved`);
  return { totalAmount, totalQty };
};

// ── DailyWorkDetail single date fetch — Firebase → Supabase Storage cache ────
// Har sync pe Firebase se fresh data, Storage mein overwrite (upsert)
// Aaj ka date sirf Firebase (live) — cache skip
const fetchDailyWorkDetail = async (cityName, year, monthName, date, todayStr) => {
  const firebaseData = await loggedGetData(`DailyWorkDetail/${year}/${monthName}/${date}`);

  // Aaj ka date cache mat karo — live data chahiye
  if (date === todayStr) return firebaseData;

  // Firebase data mila → Storage mein save (fire-and-forget, upsert = overwrite)
  if (firebaseData) {
    const bucketName = String(cityName).toLowerCase().trim();
    const blob = new Blob([JSON.stringify(firebaseData)], { type: "application/json" });
    supabase.storage
      .from(bucketName)
      .upload(`DailyWorkDetail/${year}/${monthName}/${date}.json`, blob,
        { upsert: true, contentType: "application/json" })
      .catch(() => {});
  }
  return firebaseData;
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: DailyWorkDetail — PARALLEL fetch + PARALLEL employee lookup
// ─────────────────────────────────────────────────────────────────────────────
const buildWorkDetailList = async (cityName, year, monthName, month, onProgress) => {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === Number(year) && today.getMonth() + 1 === Number(month);
  const lastDay = isCurrentMonth ? today.getDate() : new Date(Number(year), Number(month), 0).getDate();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const dates = Array.from({ length: lastDay }, (_, i) =>
    `${year}-${month}-${String(i + 1).padStart(2, "0")}`
  );

  onProgress && onProgress(0, lastDay, "Sab din parallel fetch ho rahe hain...");

  // ── Supabase cache → Firebase fallback — sab dates parallel ──────────────
  const dayDataResults = await Promise.all(
    dates.map((date) => fetchDailyWorkDetail(cityName, year, monthName, date, todayStr))
  );
  const dayDataMap = {};
  dates.forEach((date, i) => { if (dayDataResults[i]) dayDataMap[date] = dayDataResults[i]; });

  // ── Sab employees ek saath fetch karo ────────────────────────────────────
  const allEmpIds = new Set();
  Object.values(dayDataMap).forEach((wd) => Object.keys(wd).forEach((id) => allEmpIds.add(id)));
  await prefetchEmployees([...allEmpIds]);

  // ── Work detail list build karo ───────────────────────────────────────────
  const workDetailList = [];
  dates.forEach((date, idx) => {
    const workData = dayDataMap[date];
    if (!workData) return;
    Object.keys(workData).forEach((empId) => {
      const emp = empCache[empId];
      if (!emp || emp.designationId !== TRANSPORT_EXEC_DESIGNATION_ID) return;
      for (let k = 1; k <= 5; k++) {
        const task    = workData[empId]?.[`task${k}`];
        if (!task) continue;
        const zone    = task.task, vehicle = task.vehicle;
        if (!vehicle || vehicle === "NotApplicable") continue;
        let startTime = "", endTime = "";
        if (task["in-out"]) {
          const keys = Object.keys(task["in-out"]);
          for (const t of keys) { if (task["in-out"][t] === "In") startTime = t.slice(0, 5); }
          for (let i = keys.length - 1; i >= 0; i--) {
            if (task["in-out"][keys[i]] === "Out") { endTime = keys[i].slice(0, 5); break; }
          }
        }
        workDetailList.push({ date, vehicle, zone, name: emp.name, empId, startTime, endTime, orderBy: new Date(date).getTime(), distance: 0 });
      }
    });
    onProgress && onProgress(idx + 1, lastDay, date);
  });

  console.log(`[Sync] workDetailList — ${workDetailList.length} items`);
  return workDetailList;
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: Vehicles — SYNC mein poora data Firebase se lao + Supabase mein save
// Vehicle click pe sirf Supabase se read hoga — Firebase = 0 calls
// ─────────────────────────────────────────────────────────────────────────────
const processOneVehicle = async (vehicle, items, cityName, year, monthName) => {
  const sorted   = [...items].sort((a, b) => a.orderBy - b.orderBy);
  const today    = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  // Aaj ka date GPS mein include nahi — din abhi complete nahi hua
  const filtered = sorted.filter((i) => i.date !== todayStr);

  // Basic rows — sirf structure save karo, enrichment vehicle click pe hoga
  const gpsRows = filtered.map((item) => ({
    date:                 item.date,
    ward:                 item.zone,
    driver:               item.empId,
    name:                 item.name,
    dutyInTime:           "",   // vehicle click pe WasteCollectionInfo se
    dutyOutTime:          "",   // vehicle click pe WasteCollectionInfo se
    workPercentage:       "",   // vehicle click pe WasteCollectionInfo se
    portalKm:             "",   // vehicle click pe LocationHistory se
    gps_km:               "",   // vehicle click pe Wevois se
    meterReadingDistance: 0,    // vehicle click pe calculate hoga
    distance:             "0",  // vehicle click pe LocationHistory se
  }));

  await saveGPSEntries(cityName, year, monthName, vehicle, gpsRows);
  console.log(`[Sync] ${vehicle} — ${gpsRows.length} GPS rows saved (basic)`);
  return 0;
};

const processVehicles = async (cityName, year, monthName, workDetailList, onVehicleProgress) => {
  const vehicles = [...new Set(workDetailList.map((w) => w.vehicle))];
  let done = 0;

  // Vehicles 4-4 parallel mein process karo
  const kms = await runWithConcurrency(vehicles, async (vehicle) => {
    const items = workDetailList.filter((w) => w.vehicle === vehicle);
    const km    = await processOneVehicle(vehicle, items, cityName, year, monthName);
    done++;
    onVehicleProgress && onVehicleProgress(done, vehicles.length, vehicle);
    return km;
  }, 4);

  return { totalKM: kms.reduce((s, k) => s + k, 0) };
};

// ── DailyWorkDetail from Supabase Storage (for enrichment) ───────────────────
const getDailyWorkDetailFromStorage = async (cityName, year, monthName, date) => {
  const bucketName = String(cityName).toLowerCase().trim();
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(`DailyWorkDetail/${year}/${monthName}/${date}.json`);
  if (error || !data) return null;
  try { return JSON.parse(await data.text()); } catch { return null; }
};

// Extract vehicle's startTime/endTime for a specific ward from DailyWorkDetail
const extractTaskTimes = (workDetail, vehicle, ward) => {
  if (!workDetail) return { startTime: "", endTime: "" };
  for (const empId of Object.keys(workDetail)) {
    const empData = workDetail[empId];
    for (let k = 1; k <= 5; k++) {
      const task = empData?.[`task${k}`];
      if (task && task.vehicle === vehicle && task.task === ward && task["in-out"]) {
        const keys = Object.keys(task["in-out"]);
        let startTime = "", endTime = "";
        for (const t of keys) { if (task["in-out"][t] === "In") startTime = t.slice(0, 5); }
        for (let i = keys.length - 1; i >= 0; i--) {
          if (task["in-out"][keys[i]] === "Out") { endTime = keys[i].slice(0, 5); break; }
        }
        return { startTime, endTime };
      }
    }
  }
  return { startTime: "", endTime: "" };
};

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle click pe on-demand enrichment
// LocationHistory + WasteCollectionInfo + DustbinData — sirf is vehicle ke liye
// ─────────────────────────────────────────────────────────────────────────────
export const enrichVehicleGPSData = async (cityName, year, monthName, vehicle, gpsRows) => {
  _activeCity = cityName;
  Object.keys(locationCache).forEach((k) => delete locationCache[k]);
  Object.keys(wasteInfoCache).forEach((k) => delete wasteInfoCache[k]);

  const uniqueDates = [...new Set(gpsRows.map((r) => r.date))];

  // DailyWorkDetail Storage se (fast) — startTime/endTime ke liye
  const workDetailMap = {};
  await Promise.all(uniqueDates.map(async (date) => {
    workDetailMap[date] = await getDailyWorkDetailFromStorage(cityName, year, monthName, date);
  }));

  // BinLifting dates ke liye DustbinData
  const hasBinLifting = gpsRows.some((r) => r.ward.includes("BinLifting"));
  const dustbinMaps   = {};
  if (hasBinLifting) {
    const blDates = [...new Set(gpsRows.filter((r) => r.ward.includes("BinLifting")).map((r) => r.date))];
    await Promise.all(blDates.map(async (date) => {
      dustbinMaps[date] = await getDustbinMeterReadingMap(year, monthName, date);
    }));
  }

  // Har row enrich karo — parallel
  const enriched = await Promise.all(gpsRows.map(async (row) => {
    const { startTime, endTime } = extractTaskTimes(workDetailMap[row.date], vehicle, row.ward);
    const [details, distance] = await Promise.all([
      getTrackAdditionalDetails(row.ward, row.driver, year, monthName, row.date),
      getLocationDistance(row.ward, vehicle, year, monthName, row.date, startTime, endTime),
    ]);
    const portalKm = await getPortalKm(row.ward, details.dutyInTime, details.dutyOutTime, vehicle, year, monthName, row.date);
    return {
      ...row,
      dutyInTime:           details.dutyInTime,
      dutyOutTime:          details.dutyOutTime,
      workPercentage:       details.workPercentage,
      portalKm:             String(portalKm),
      distance:             distance.toFixed(3),
      meterReadingDistance: row.ward.includes("BinLifting") ? (dustbinMaps[row.date]?.[vehicle] || 0) : 0,
      _dutyOnReadings:      row.ward.includes("BinLifting") ? [] : (details.dutyOnReadings  || []),
      _dutyOutReadings:     row.ward.includes("BinLifting") ? [] : (details.dutyOutReadings || []),
    };
  }));

  // MeterReadingDistance — per date aggregate (non-BinLifting)
  uniqueDates.forEach((date) => {
    const dayRows = enriched.filter((r) => r.date === date && !r.ward.includes("BinLifting"));
    const allOn   = dayRows.flatMap((r) => r._dutyOnReadings);
    const allOut  = dayRows.flatMap((r) => r._dutyOutReadings);
    const first = allOn[0] || 0, last = allOut[allOut.length - 1] || 0;
    const totalDist = first && last ? last - first : 0;
    const swipes    = dayRows.length || 1;
    dayRows.forEach((r) => { r.meterReadingDistance = Number((totalDist / swipes).toFixed(3)); });
  });

  // Temp fields hata ke display format return karo
  enriched.forEach((r) => {
    delete r._dutyOnReadings;
    delete r._dutyOutReadings;
    r.distance = `${parseFloat(r.distance).toFixed(3)} KM`;
  });

  return enriched;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────
export const updateFuelJSON = async (cityName, year, monthName, onProgress = () => {}) => {
  // Reset in-memory caches
  _activeCity = cityName;
  Object.keys(empCache).forEach((k) => delete empCache[k]);
  Object.keys(locationCache).forEach((k) => delete locationCache[k]);
  Object.keys(wasteInfoCache).forEach((k) => delete wasteInfoCache[k]);

  const monthIndex = MONTH_NAMES.indexOf(monthName);
  if (monthIndex === -1) throw new Error(`Invalid month: ${monthName}`);
  const month = String(monthIndex + 1).padStart(2, "0");

  // Sync run count — ek sync = ek count
  logUsage(cityName, null, null, "SyncRun", "Manual", 0);

  // Ensure bucket exists for DailyWorkDetail + EmployeeCache Storage
  const bucketName = String(cityName).toLowerCase().trim();
  ensuredBuckets.clear();
  await ensureBucket(bucketName);

  // Employee cache — Storage se load (Firebase calls bachao)
  await loadEmployeeCache(cityName);

  // Step 1 — Fuel entries → VehicleFuelCache table
  onProgress({ stage: "fuel", message: "Saving fuel entries...", percent: 5 });
  const { totalAmount, totalQty } = await saveDieselEntriesJSON(cityName, year, monthName);

  // Step 2 — Work detail list (Supabase DailyWorkDetail cache → Firebase fallback)
  onProgress({ stage: "workdetail", message: "Fetching daily work records...", percent: 15 });
  const workDetailList = await buildWorkDetailList(cityName, year, monthName, month, (day, total) => {
    const pct = 15 + Math.round((day / total) * 30);
    onProgress({ stage: "workdetail", message: `Processing day ${day} of ${total}...`, percent: pct });
  });

  if (!workDetailList.length) {
    await saveSummaryCache(cityName, year, monthName, {
      total_qty: Number(totalQty.toFixed(2)), total_amount: Number(totalAmount.toFixed(2)), total_km: 0,
    });
    onProgress({ stage: "done", message: "No driver records found. Fuel data saved.", percent: 100 });
    return { totalKM: "0.000", qty: totalQty.toFixed(2), amount: totalAmount.toFixed(2) };
  }

  // Step 3 — Vehicles (4 parallel) → VehicleGPSCache table
  onProgress({ stage: "vehicles", message: "Calculating vehicle distances...", percent: 45 });
  const { totalKM } = await processVehicles(
    cityName, year, monthName, workDetailList,
    (done, total, vehicle) => {
      const pct = 45 + Math.round((done / total) * 50);
      onProgress({ stage: "vehicles", message: `Vehicle ${done} of ${total} — ${vehicle}`, percent: pct });
    }
  );

  // Step 4 — MonthSummary → VehicleMonthSummaryCache table
  await saveSummaryCache(cityName, year, monthName, {
    total_qty:    Number(totalQty.toFixed(2)),
    total_amount: Number(totalAmount.toFixed(2)),
    total_km:     Number(totalKM.toFixed(3)),
  });

  // Employee cache — Storage mein save (fire-and-forget)
  saveEmployeeCache(cityName);

  onProgress({ stage: "done", message: "Sync complete. All data saved to tables.", percent: 100 });
  return { totalKM: totalKM.toFixed(3), qty: totalQty.toFixed(2), amount: totalAmount.toFixed(2) };
};
