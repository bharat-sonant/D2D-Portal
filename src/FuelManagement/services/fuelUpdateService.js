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
import { logUsage, saveSummaryCache, getSummaryCache, saveFuelEntries, saveGPSEntries, getGPSCachedRows, getTotalRunningKm, getMonthSyncStatus, setMonthSyncStatus, updateSummaryTotalKm } from "./fuelCacheService";

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

// ── Time range check (overnight safe) ────────────────────────────────────────
const isTimeInRange = (time, dutyIn, dutyOut) => {
  if (!dutyIn || !dutyOut || !time) return false;
  const [hr, min]       = time.split(":").map(Number);
  const [inHr, inMin]   = dutyIn.split(":").map(Number);
  const [outHr, outMin] = dutyOut.split(":").map(Number);
  const afterStart = (hr > inHr  || (hr === inHr  && min >= inMin));
  const beforeEnd  = (hr < outHr || (hr === outHr && min <= outMin));
  // Overnight shift: endTime < startTime (e.g. 22:00 → 02:00)
  const isOvernight = inHr > outHr || (inHr === outHr && inMin > outMin);
  return isOvernight ? (afterStart || beforeEnd) : (afterStart && beforeEnd);
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
  runWithConcurrency([...new Set(empIds)], getEmployeeData, 10);

// ── In-memory cache — sync ke dauran duplicate Firebase reads hata ────────────
const locationCache    = {};
const wasteInfoCache   = {};

const getLocationRaw = async (zone, vehicle, year, monthName, date) => {
  // BinLifting path mein vehicle hota hai — isliye key mein bhi vehicle
  // Normal zones ka path vehicle-independent hai — key mein vehicle nahi
  const key = zone.includes("BinLifting")
    ? `${zone}|${vehicle}|${year}|${monthName}|${date}`
    : `${zone}|${year}|${monthName}|${date}`;
  if (locationCache[key] !== undefined) return locationCache[key];
  const path = zone.includes("BinLifting")
    ? `LocationHistory/BinLifting/${vehicle}/${year}/${monthName}/${date}`
    : `LocationHistory/${zone}/${year}/${monthName}/${date}`;
  const data = await loggedGetData(path);
  // Null cache nahi karo — agar Firebase fail kiya toh retry allow karo
  if (data !== null) locationCache[key] = data;
  return data;
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
  const vehicleCount = new Set(fuelList.map((e) => e.vehicle).filter(Boolean)).size;
  console.log(`[Sync] VehicleFuelCache — ${fuelList.length} entries, ${vehicleCount} vehicles saved`);
  return { totalAmount, totalQty, vehicleCount };
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
const buildWorkDetailList = async (cityName, year, monthName, month, syncFromDate, onProgress) => {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === Number(year) && today.getMonth() + 1 === Number(month);
  const lastDay = isCurrentMonth ? today.getDate() : new Date(Number(year), Number(month), 0).getDate();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  // Sirf syncFromDate se aage ke dates Firebase se fetch karo
  const dates = Array.from({ length: lastDay }, (_, i) =>
    `${year}-${month}-${String(i + 1).padStart(2, "0")}`
  ).filter((d) => d >= syncFromDate);

  onProgress && onProgress(0, dates.length, "Sab din parallel fetch ho rahe hain...");

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
    onProgress && onProgress(idx + 1, dates.length, date);
  });

  console.log(`[Sync] workDetailList — ${workDetailList.length} items`);
  return workDetailList;
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: Vehicles — Smart cache sync
// Today + Yesterday → hamesha Firebase se fresh
// Baaki dates → Supabase mein hain toh wahi se, nahi hain toh Firebase se
// ─────────────────────────────────────────────────────────────────────────────
const processOneVehicle = async (vehicle, items, cityName, year, monthName, syncFromDate) => {
  const sorted = [...items].sort((a, b) => a.orderBy - b.orderBy);

  // syncFromDate se pehle ki dates Supabase se as-is lo — Firebase call nahi
  const existingRows = await getGPSCachedRows(cityName, year, monthName, vehicle);
  const cachedRows   = existingRows.filter((r) => r.date < syncFromDate);

  if (!sorted.length && !cachedRows.length) return;

  // LocationHistory se distance calculate karo (Firebase live)
  const freshRows = await Promise.all(sorted.map(async (item) => {
    const distance = await getLocationDistance(
      item.zone, vehicle, year, monthName, item.date, item.startTime, item.endTime
    );
    return {
      date:                 item.date,
      ward:                 item.zone,
      driver:               item.empId,
      name:                 item.name,
      dutyInTime:           "",
      dutyOutTime:          "",
      workPercentage:       "",
      portalKm:             "",
      gps_km:               "",
      meterReadingDistance: 0,
      distance:             String(distance),
    };
  }));

  const vehicleKM = freshRows.reduce((s, r) => s + (parseFloat(r.distance) || 0), 0);
  console.log(`[Sync] ${vehicle} — ${vehicleKM.toFixed(3)} KM | rows: ${freshRows.length}`);

  const allRows = [...freshRows, ...cachedRows];
  await saveGPSEntries(cityName, year, monthName, vehicle, allRows);
  return vehicleKM;
};

const processVehicles = async (cityName, year, monthName, workDetailList, syncFromDate, onVehicleProgress) => {
  const vehicles = [...new Set(workDetailList.map((w) => w.vehicle))];
  let done = 0;
  let totalKM = 0;
  for (const vehicle of vehicles) {
    const items = workDetailList.filter((w) => w.vehicle === vehicle);
    const km = await processOneVehicle(vehicle, items, cityName, year, monthName, syncFromDate);
    totalKM += (km || 0);
    done++;
    onVehicleProgress && onVehicleProgress(done, vehicles.length, vehicle);
  }
  return { totalKM };
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

  // WasteCollectionInfo + portalKm (LocationHistory) — parallel
  // Agar sync mein distance = 0 raha (in-out missing tha) toh WasteCollectionInfo
  // duty times se recalculate karo — locationCache already populate hoga getPortalKm se
  const enriched = await Promise.all(gpsRows.map(async (row) => {
    const details  = await getTrackAdditionalDetails(row.ward, row.driver, year, monthName, row.date);
    const portalKm = await getPortalKm(row.ward, details.dutyInTime, details.dutyOutTime, vehicle, year, monthName, row.date);

    const existingDist = parseFloat(row.distance) || 0;
    let finalDistance = row.distance;
    if (existingDist === 0 && details.dutyInTime) {
      const recalc = await getLocationDistance(row.ward, vehicle, year, monthName, row.date, details.dutyInTime, details.dutyOutTime);
      if (recalc > 0) finalDistance = recalc.toFixed(3) + " KM";
    }

    return {
      ...row,
      distance:        finalDistance,
      dutyInTime:      details.dutyInTime,
      dutyOutTime:     details.dutyOutTime,
      workPercentage:  details.workPercentage,
      portalKm:        String(portalKm),
      _dutyOnReadings:  row.ward.includes("BinLifting") ? [] : (details.dutyOnReadings  || []),
      _dutyOutReadings: row.ward.includes("BinLifting") ? [] : (details.dutyOutReadings || []),
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

  enriched.forEach((r) => {
    delete r._dutyOnReadings;
    delete r._dutyOutReadings;
    // distance format: getGPSByVehicle se "X.XXX KM" aaya, keep as is
  });

  return enriched;
};

// ─────────────────────────────────────────────────────────────────────────────
// Debug: ek vehicle ka date-wise running KM console mein dikhao
// ─────────────────────────────────────────────────────────────────────────────
export const debugVehicleRunningKm = async (cityName, year, monthName, vehicle) => {
  console.log(`\n========== [DEBUG] ${vehicle} | ${cityName} | ${monthName} ${year} ==========`);

  const monthIndex = MONTH_NAMES.indexOf(monthName);
  if (monthIndex === -1) { console.warn(`[DEBUG] Invalid monthName: ${monthName}`); return; }
  const month = String(monthIndex + 1).padStart(2, "0");

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === Number(year) && today.getMonth() + 1 === monthIndex + 1;
  const lastDay = isCurrentMonth ? today.getDate() : new Date(Number(year), monthIndex + 1, 0).getDate();
  const dates = Array.from({ length: lastDay }, (_, i) =>
    `${year}-${month}-${String(i + 1).padStart(2, "0")}`
  );

  Object.keys(locationCache).forEach((k) => delete locationCache[k]);
  Object.keys(wasteInfoCache).forEach((k) => delete wasteInfoCache[k]);

  let totalKm = 0;
  const dateResults = [];

  for (const date of dates) {
    const workData = await getData(`DailyWorkDetail/${year}/${monthName}/${date}`);
    if (!workData) continue;

    // ward → { driver, startTime, endTime } from DailyWorkDetail task in-out
    const wardInfoMap = {};
    Object.keys(workData).forEach((empId) => {
      for (let k = 1; k <= 5; k++) {
        const task = workData[empId]?.[`task${k}`];
        if (task && task.vehicle === vehicle && task.task && !wardInfoMap[task.task]) {
          let startTime = "", endTime = "";
          if (task["in-out"]) {
            const keys = Object.keys(task["in-out"]);
            for (const t of keys) { if (task["in-out"][t] === "In") startTime = t.slice(0, 5); }
            for (let i = keys.length - 1; i >= 0; i--) {
              if (task["in-out"][keys[i]] === "Out") { endTime = keys[i].slice(0, 5); break; }
            }
          }
          wardInfoMap[task.task] = { driver: empId, startTime, endTime };
        }
      }
    });
    if (!Object.keys(wardInfoMap).length) continue;

    let dateKm = 0;
    for (const [ward, info] of Object.entries(wardInfoMap)) {
      // WasteCollectionInfo se duty times lo (primary source)
      const details = await getTrackAdditionalDetails(ward, info.driver, year, monthName, date);
      // Fallback: WasteCollectionInfo empty ho (aaj ki date) toh DailyWorkDetail ke times use karo
      const dutyIn  = details.dutyInTime  || info.startTime;
      const dutyOut = details.dutyOutTime || info.endTime || "23:59";
      const km = await getPortalKm(ward, dutyIn, dutyOut, vehicle, year, monthName, date);
      dateKm += Number(km) || 0;
    }

    totalKm += dateKm;
    dateResults.push({ date, wards: Object.keys(wardInfoMap).join(", "), km: dateKm.toFixed(3) });
  }

  if (!dateResults.length) {
    console.warn(`[DEBUG] ${vehicle} kisi bhi date pe DailyWorkDetail mein nahi mila`);
  } else {
    console.table(dateResults);
  }

  console.log(`[DEBUG] ✅ TOTAL Running KM for ${vehicle}: ${totalKm.toFixed(3)} KM`);
  console.log(`===================================================================================\n`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Debug: saare vehicles ka running KM console mein dikhao
// ─────────────────────────────────────────────────────────────────────────────
export const debugAllVehiclesRunningKm = async (cityName, year, monthName) => {
  console.log(`\n========== [DEBUG] All Vehicles Running KM | ${cityName} | ${monthName} ${year} ==========`);

  const monthIndex = MONTH_NAMES.indexOf(monthName);
  if (monthIndex === -1) { console.warn(`[DEBUG] Invalid monthName: ${monthName}`); return; }
  const month = String(monthIndex + 1).padStart(2, "0");

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === Number(year) && today.getMonth() === monthIndex;

  // Previous month — Supabase mein already hai toh Firebase call nahi
  if (!isCurrentMonth) {
    const existing = await getSummaryCache(cityName, year, monthName);
    if (existing?.total_km && Number(existing.total_km) > 0) {
      console.log(`[DEBUG] ✅ Supabase se mila (Firebase call nahi): ${existing.total_km} KM`);
      console.log(`===================================================================================\n`);
      return Number(existing.total_km);
    }
  }

  const lastDay = isCurrentMonth ? today.getDate() : new Date(Number(year), monthIndex + 1, 0).getDate();
  const dates = Array.from({ length: lastDay }, (_, i) =>
    `${year}-${month}-${String(i + 1).padStart(2, "0")}`
  );

  Object.keys(locationCache).forEach((k) => delete locationCache[k]);
  Object.keys(wasteInfoCache).forEach((k) => delete wasteInfoCache[k]);

  console.log(`[DEBUG] ${dates.length} dates parallel fetch ho rahe hain...`);

  // Step 1: Saari dates ka DailyWorkDetail parallel fetch
  const dayDataArr = await Promise.all(
    dates.map((date) => getData(`DailyWorkDetail/${year}/${monthName}/${date}`))
  );

  // Step 2: vehicle → [{date, ward, driver, startTime, endTime}] map build karo
  const vehicleEntries = {};
  dates.forEach((date, i) => {
    const workData = dayDataArr[i];
    if (!workData) return;
    Object.keys(workData).forEach((empId) => {
      for (let k = 1; k <= 5; k++) {
        const task = workData[empId]?.[`task${k}`];
        if (!task || !task.vehicle || task.vehicle === "NotApplicable" || !task.task) continue;
        const v = task.vehicle;
        if (!vehicleEntries[v]) vehicleEntries[v] = [];
        // Ward already added for this date? skip
        const already = vehicleEntries[v].some((e) => e.date === date && e.ward === task.task);
        if (already) continue;
        let startTime = "", endTime = "";
        if (task["in-out"]) {
          const keys = Object.keys(task["in-out"]);
          for (const t of keys) { if (task["in-out"][t] === "In") startTime = t.slice(0, 5); }
          for (let j = keys.length - 1; j >= 0; j--) {
            if (task["in-out"][keys[j]] === "Out") { endTime = keys[j].slice(0, 5); break; }
          }
        }
        vehicleEntries[v].push({ date, ward: task.task, driver: empId, startTime, endTime });
      }
    });
  });

  const vehicles = Object.keys(vehicleEntries);
  console.log(`[DEBUG] ${vehicles.length} vehicles mili — Portal KM style calculate ho raha hai...\n`);

  // Step 3: Har vehicle ke entries parallel process karo
  const vehicleKm = {};
  await Promise.all(
    vehicles.map(async (vehicle) => {
      const entries = vehicleEntries[vehicle];
      const kms = await Promise.all(
        entries.map(async ({ date, ward, driver, startTime, endTime }) => {
          const details  = await getTrackAdditionalDetails(ward, driver, year, monthName, date);
          const dutyIn   = details.dutyInTime  || startTime;
          const dutyOut  = details.dutyOutTime || endTime || "23:59";
          const km = await getPortalKm(ward, dutyIn, dutyOut, vehicle, year, monthName, date);
          return Number(km) || 0;
        })
      );
      vehicleKm[vehicle] = kms.reduce((s, k) => s + k, 0);
    })
  );

  // Step 4: Results
  const results = Object.entries(vehicleKm)
    .map(([vehicle, km]) => ({ vehicle, km: km.toFixed(3) }))
    .sort((a, b) => Number(b.km) - Number(a.km));

  let done = 0;
  results.forEach(({ vehicle, km }) => {
    done++;
    console.log(`[DEBUG] (${done}/${vehicles.length}) ${vehicle} — ${km} KM`);
  });

  const grandTotal = Object.values(vehicleKm).reduce((s, k) => s + k, 0);
  console.log("\n---------- Vehicle-wise Summary ----------");
  console.table(results);
  console.log(`\n[DEBUG] ✅ GRAND TOTAL | ${monthName} ${year}: ${grandTotal.toFixed(3)} KM`);
  console.log(`===================================================================================\n`);

  // Supabase mein save karo — next time Firebase call nahi hogi
  await updateSummaryTotalKm(cityName, year, monthName, Number(grandTotal.toFixed(3)));
  console.log(`[DEBUG] ✅ Supabase mein save ho gaya: total_km = ${grandTotal.toFixed(3)}`);

  return Number(grandTotal.toFixed(3));
};

// ─────────────────────────────────────────────────────────────────────────────
// Background Running KM — sync ke baad silently calculate karo
// getData direct use (no loggedGetData) → DB service page mein count nahi
// ─────────────────────────────────────────────────────────────────────────────
export const calcTotalRunningKmBackground = async (cityName, year, monthName, vehicles) => {
  if (!vehicles?.length) return;

  const calcOneVehicle = async (vehicle) => {
    const rows = await getGPSCachedRows(cityName, year, monthName, vehicle);
    if (!rows.length) return { vehicle, meters: 0 };

    const distances = await Promise.all(rows.map(async (row) => {
      const path = row.ward.includes("BinLifting")
        ? `LocationHistory/BinLifting/${vehicle}/${year}/${monthName}/${row.date}/TotalCoveredDistance`
        : `LocationHistory/${row.ward}/${year}/${monthName}/${row.date}/TotalCoveredDistance`;
      const dist = await getData(path);
      return Number(dist) || 0;
    }));

    const meters = distances.reduce((s, d) => s + d, 0);
    return { vehicle, meters };
  };

  const results = await runWithConcurrency(vehicles, calcOneVehicle, 20);

  const grandTotal = results.reduce((s, r) => s + r.meters, 0);

  const totalKm = grandTotal / 1000;

  console.log(`\n===== Firebase Running KM | ${cityName} | ${monthName} ${year} =====`);
  console.table(
    results
      .sort((a, b) => b.meters - a.meters)
      .map((r) => ({ vehicle: r.vehicle, km: (r.meters / 1000).toFixed(3) }))
  );
  console.log(`TOTAL: ${totalKm.toFixed(3)} KM`);
  console.log(`=======================================================\n`);

  return totalKm;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────
export const updateFuelJSON = async (cityName, year, monthName, onProgress = () => {}) => {
  _activeCity = cityName;
  Object.keys(empCache).forEach((k) => delete empCache[k]);
  Object.keys(locationCache).forEach((k) => delete locationCache[k]);
  Object.keys(wasteInfoCache).forEach((k) => delete wasteInfoCache[k]);

  const monthIndex = MONTH_NAMES.indexOf(monthName);
  if (monthIndex === -1) throw new Error(`Invalid month: ${monthName}`);
  const month = String(monthIndex + 1).padStart(2, "0");

  const today    = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  // Last sync date fetch karo — agar pehle sync hua hai toh wahi se shuru karo
  const lastSyncedDate = await getMonthSyncStatus(cityName, year, monthName);
  // syncFromDate: agar pehle sync hua → us date se, warna month ke pehle din se
  const syncFromDate   = lastSyncedDate || `${year}-${month}-01`;

  // Month ka last day
  const lastDayOfMonth = String(new Date(Number(year), monthIndex + 1, 0).getDate()).padStart(2, "0");
  const lastDayStr     = `${year}-${month}-${lastDayOfMonth}`;

  // Agar syncFromDate month ke last day se aage hai → poora month already synced
  // Koi bhi Firebase call nahi — seedha Supabase se return karo
  if (lastSyncedDate && syncFromDate > lastDayStr) {
    const [totalKM, cached] = await Promise.all([
      getTotalRunningKm(cityName, year, monthName),
      getSummaryCache(cityName, year, monthName),
    ]);
    onProgress({
      stage: "done",
      message: `${monthName} ${year} already synced on ${lastSyncedDate}. Supabase se data aa raha hai.`,
      percent: 100,
    });
    return {
      totalKM: totalKM.toFixed(3),
      qty:     cached ? String(cached.total_qty)    : "0.00",
      amount:  cached ? String(cached.total_amount) : "0.00",
    };
  }

  onProgress({
    stage: "start",
    message: lastSyncedDate
      ? `Last sync: ${lastSyncedDate}. Sirf ${lastSyncedDate} ke baad ke dates Firebase se aayenge.`
      : "Pehla sync — sab dates Firebase se aayenge.",
    percent: 2,
  });

  logUsage(cityName, null, null, "SyncRun", "Manual", 0);

  const bucketName = String(cityName).toLowerCase().trim();
  ensuredBuckets.clear();
  await ensureBucket(bucketName);
  await loadEmployeeCache(cityName);

  // Step 1 — Fuel entries (poora month ek saath — 1 Firebase call)
  onProgress({ stage: "fuel", message: "Saving fuel entries...", percent: 5 });
  const { totalAmount, totalQty, vehicleCount } = await saveDieselEntriesJSON(cityName, year, monthName);

  // Step 2 — Work detail list (sirf syncFromDate ke baad ke dates)
  onProgress({ stage: "workdetail", message: `Fetching work records from ${syncFromDate}...`, percent: 15 });
  const workDetailList = await buildWorkDetailList(cityName, year, monthName, month, syncFromDate, (day, total) => {
    const pct = 15 + Math.round((day / total) * 30);
    onProgress({ stage: "workdetail", message: `Processing day ${day} of ${total}...`, percent: pct });
  });

  if (!workDetailList.length) {
    await saveSummaryCache(cityName, year, monthName, {
      total_qty: Number(totalQty.toFixed(2)), total_amount: Number(totalAmount.toFixed(2)), total_km: 0,
    });
    await setMonthSyncStatus(cityName, year, monthName, todayStr);
    onProgress({ stage: "done", message: "No new driver records. Fuel data updated.", percent: 100 });
    return { totalKM: "0.000", qty: totalQty.toFixed(2), amount: totalAmount.toFixed(2) };
  }

  // Step 3 — Vehicles → VehicleGPSCache (GPS Route Data table ke liye)
  onProgress({ stage: "vehicles", message: "Calculating vehicle distances...", percent: 45 });
  const { totalKM } = await processVehicles(
    cityName, year, monthName, workDetailList, syncFromDate,
    (done, total, vehicle) => {
      const pct = 45 + Math.round((done / total) * 45);
      onProgress({ stage: "vehicles", message: `Vehicle ${done} of ${vehicleCount} — ${vehicle}`, percent: pct });
    }
  );

  // Step 4 — Summary save karo
  await saveSummaryCache(cityName, year, monthName, {
    total_qty:    Number(totalQty.toFixed(2)),
    total_amount: Number(totalAmount.toFixed(2)),
    total_km:     Number(totalKM.toFixed(3)),
  });

  saveEmployeeCache(cityName);

  // Sync complete — last_synced_date = aaj update karo
  await setMonthSyncStatus(cityName, year, monthName, todayStr);

  onProgress({ stage: "done", message: "Sync complete. All data saved.", percent: 100 });
  return { totalKM: "0.000", qty: totalQty.toFixed(2), amount: totalAmount.toFixed(2) };
};
