import { supabase } from "../../createClient";

const SUMMARY_TABLE     = "VehicleMonthSummaryCache";
const FUEL_TABLE        = "VehicleFuelCache";
const GPS_TABLE         = "VehicleGPSCache";
const LOG_TABLE         = "ApiUsageLogs";
const SYNC_STATUS_TABLE = "MonthSyncStatus";

// ── Usage Logger → Supabase atomic increment via RPC (fire-and-forget) ────────
export const logUsage = (city, _year, _month, service, source, bytes) => {
  const now   = new Date();
  const date  = now.toISOString().slice(0, 10);
  const year  = String(now.getFullYear());
  const month = now.toLocaleString("en-US", { month: "long" });
  supabase.rpc("increment_api_usage", {
    p_city: city, p_year: year, p_month: month, p_date: date,
    p_service: service, p_source: source, p_bytes: bytes,
  }).then(({ error }) => { if (error) console.warn("Usage log failed:", error.message); });
};

// ── Read usage logs ───────────────────────────────────────────────────────────
export const getUsageLogs = async (city, year, month, filterDate = null) => {
  let query = supabase
    .from(LOG_TABLE)
    .select("date, service, source, calls, total_bytes")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .order("date", { ascending: false });
  if (filterDate) query = query.eq("date", filterDate);
  const { data, error } = await query;
  if (error || !data?.length) return [];
  return data.map((r) => ({
    date:       r.date,
    service:    r.service,
    source:     r.source,
    calls:      r.calls,
    totalBytes: r.total_bytes,
  }));
};

// ── Month Sync Status ─────────────────────────────────────────────────────────
// Tracks last_synced_date per city/year/month
// Next sync sirf last_synced_date se aage ke dates Firebase se laata hai

export const getMonthSyncStatus = async (city, year, month) => {
  const { data } = await supabase
    .from(SYNC_STATUS_TABLE)
    .select("last_synced_date")
    .eq("city", city).eq("year", year).eq("month", month)
    .maybeSingle();
  return data?.last_synced_date || null;   // "2026-04-10" ya null
};

export const setMonthSyncStatus = async (city, year, month, lastSyncedDate) => {
  const { error } = await supabase
    .from(SYNC_STATUS_TABLE)
    .upsert({ city, year, month, last_synced_date: lastSyncedDate }, { onConflict: "city,year,month" });
  if (error) console.warn("SyncStatus save failed:", error.message);
};

// ── Month Summary ─────────────────────────────────────────────────────────────

export const getSummaryCache = async (city, year, month) => {
  const { data, error } = await supabase
    .from(SUMMARY_TABLE)
    .select("total_qty, total_amount, total_km")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();
  if (error || !data) return null;
  logUsage(city, year, month, "MonthSummary", "SupabaseTable", new Blob([JSON.stringify(data)]).size);
  return data;
};

export const saveSummaryCache = async (city, year, month, { total_qty, total_amount, total_km }) => {
  const { error } = await supabase
    .from(SUMMARY_TABLE)
    .upsert({ city, year, month, total_qty, total_amount, total_km }, { onConflict: "city,year,month" });
  if (error) console.warn("Summary cache save failed:", error.message);
};

export const updateSummaryTotalKm = async (city, year, month, total_km) => {
  const { error } = await supabase
    .from(SUMMARY_TABLE)
    .update({ total_km })
    .eq("city", city).eq("year", year).eq("month", month);
  if (error) console.warn("Summary total_km update failed:", error.message);
};

// ── Fuel Entries ──────────────────────────────────────────────────────────────

// Distinct vehicle list — sirf vehicle column, lightweight query
export const getVehicleList = async (city, year, month) => {
  const { data, error } = await supabase
    .from(FUEL_TABLE)
    .select("vehicle")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month);
  if (error || !data?.length) return [];
  logUsage(city, year, month, "FuelEntries", "SupabaseTable", new Blob([JSON.stringify(data)]).size);
  return [...new Set(data.map((r) => r.vehicle).filter(Boolean))].sort();
};

// Fuel entries for one vehicle only — filtered query
export const getFuelByVehicle = async (city, year, month, vehicle) => {
  const { data, error } = await supabase
    .from(FUEL_TABLE)
    .select("vehicle, date, meter_reading, fuel_type, fuel_vehicle, petrol_pump, pay_method, remark, quantity, amount")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .eq("vehicle", vehicle)
    .order("date", { ascending: true });
  if (error || !data?.length) return [];
  logUsage(city, year, month, "FuelEntries", "SupabaseTable", new Blob([JSON.stringify(data)]).size);
  return data.map((r) => ({
    vehicle:      r.vehicle       || "",
    date:         r.date          || "",
    meterReading: r.meter_reading || "",
    fuelType:     r.fuel_type     || "",
    fuelVehicle:  r.fuel_vehicle  || "",
    petrolPump:   r.petrol_pump   || "",
    payMethod:    r.pay_method    || "",
    remark:       r.remark        || "",
    quantity:     Number(r.quantity) || 0,
    amount:       Number(r.amount)   || 0,
    orderBy:      new Date(r.date).getTime(),
  }));
};

// Delete city/year/month, then bulk insert new entries
export const saveFuelEntries = async (city, year, month, entries) => {
  const { error: delErr } = await supabase
    .from(FUEL_TABLE)
    .delete()
    .eq("city", city)
    .eq("year", year)
    .eq("month", month);
  if (delErr) console.warn("Fuel delete failed:", delErr.message);
  if (!entries.length) return;
  const rows = entries.map((e) => ({
    city, year, month,
    vehicle:       e.vehicle      || "",
    date:          e.date         || "",
    meter_reading: e.meterReading || "",
    fuel_type:     e.fuelType     || "",
    fuel_vehicle:  e.fuelVehicle  || "",
    petrol_pump:   e.petrolPump   || "",
    pay_method:    e.payMethod    || "",
    remark:        e.remark       || "",
    quantity:      Number(e.quantity) || 0,
    amount:        Number(e.amount)   || 0,
  }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase.from(FUEL_TABLE).insert(rows.slice(i, i + 500));
    if (error) console.warn("Fuel insert failed:", error.message);
  }
};

// ── GPS Route Data ────────────────────────────────────────────────────────────

// Total running KM — VehicleGPSCache se sab distances ka sum
export const getTotalRunningKm = async (city, year, month) => {
  const { data, error } = await supabase
    .from(GPS_TABLE)
    .select("vehicle, distance")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month);
  if (error || !data?.length) return 0;

  const byVehicle = {};
  data.forEach((r) => {
    byVehicle[r.vehicle] = (byVehicle[r.vehicle] || 0) + (parseFloat(r.distance) || 0);
  });

  const total = Object.values(byVehicle).reduce((s, v) => s + v, 0);

  console.log(`\n===== Running KM | ${city} | ${month} ${year} =====`);
  console.table(
    Object.entries(byVehicle)
      .sort(([, a], [, b]) => b - a)
      .map(([vehicle, km]) => ({ vehicle, km: km.toFixed(3) }))
  );
  console.log(`TOTAL: ${total.toFixed(3)} KM`);
  console.log(`=====================================\n`);

  return total;
};

// Sync ke liye — vehicle ki existing GPS rows raw format mein (all fields)
export const getGPSCachedRows = async (city, year, month, vehicle) => {
  const { data, error } = await supabase
    .from(GPS_TABLE)
    .select("date, ward, name, driver, duty_in_time, duty_out_time, work_percentage, portal_km, gps_km, meter_reading_distance, distance")
    .eq("city", city).eq("year", year).eq("month", month).eq("vehicle", vehicle);
  if (error || !data?.length) return [];
  return data.map((r) => ({
    date:                 r.date                   || "",
    ward:                 r.ward                   || "",
    name:                 r.name                   || "",
    driver:               r.driver                 || "",
    dutyInTime:           r.duty_in_time           || "",
    dutyOutTime:          r.duty_out_time          || "",
    workPercentage:       r.work_percentage        ?? "",
    portalKm:             r.portal_km              ?? "",
    gps_km:               r.gps_km                || "",
    meterReadingDistance: r.meter_reading_distance ?? 0,
    distance:             r.distance              || "0",
  }));
};

// GPS entries for one vehicle only — filtered query
export const getGPSByVehicle = async (city, year, month, vehicle) => {
  const { data, error } = await supabase
    .from(GPS_TABLE)
    .select("date, ward, name, driver, duty_in_time, duty_out_time, work_percentage, portal_km, gps_km, meter_reading_distance, distance")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .eq("vehicle", vehicle)
    .order("date", { ascending: true });
  if (error || !data?.length) return [];
  logUsage(city, year, month, "GPSRouteData", "SupabaseTable", new Blob([JSON.stringify(data)]).size);
  return data.map((r) => ({
    date:                 r.date                   || "",
    ward:                 r.ward                   || "",
    name:                 r.name                   || "",
    driver:               r.driver                 || "",
    dutyInTime:           r.duty_in_time           || "",
    dutyOutTime:          r.duty_out_time          || "",
    workPercentage:       r.work_percentage        ?? "",
    portalKm:             r.portal_km              ?? "",
    gps_km:               r.gps_km                ?? "",
    meterReadingDistance: r.meter_reading_distance ?? "",
    distance:             r.distance ? `${parseFloat(r.distance).toFixed(3)} KM` : "0.000 KM",
    orderBy:              new Date(r.date).getTime(),
  }));
};

// Batch update enriched GPS fields — fire-and-forget after vehicle click enrichment
export const updateGPSEnrichedData = (city, year, month, vehicle, enrichedRows) => {
  enrichedRows.forEach((r) =>{
    supabase.from(GPS_TABLE)
      .update({
        duty_in_time:           r.dutyInTime           || "",
        duty_out_time:          r.dutyOutTime          || "",
        work_percentage:        String(r.workPercentage ?? ""),
        portal_km:              String(r.portalKm       ?? ""),
        distance:               String(parseFloat(r.distance) || 0),
        meter_reading_distance: String(r.meterReadingDistance ?? ""),
      })
      .eq("city", city).eq("year", year).eq("month", month)
      .eq("vehicle", vehicle).eq("date", r.date).eq("ward", r.ward)
      .then(({ error }) => { if (error) console.warn("GPS enrich update failed:", error.message); });
  });
};

// Update gps_km for specific rows after Wevois fetch — fire-and-forget
export const updateGPSKm = (city, year, month, vehicle, updates) => {
  // updates = [{ date, ward, gps_km }]
  updates.forEach(({ date, ward, gps_km }) => {
    supabase
      .from(GPS_TABLE)
      .update({ gps_km: String(gps_km) })
      .eq("city", city)
      .eq("year", year)
      .eq("month", month)
      .eq("vehicle", vehicle)
      .eq("date", date)
      .eq("ward", ward)
      .then(({ error }) => { if (error) console.warn("GPS KM update failed:", error.message); });
  });
};

// Delete city/year/month/vehicle GPS rows, then bulk insert
// Existing gps_km values preserve hoti hain — Wevois data lost nahi hota
export const saveGPSEntries = async (city, year, month, vehicle, trackRows) => {
  if (!trackRows.length) return;

  // Step 1: Existing gps_km values fetch karo (jo Wevois se pehle save hue the)
  const { data: existing } = await supabase
    .from(GPS_TABLE)
    .select("date, ward, gps_km")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .eq("vehicle", vehicle)
    .neq("gps_km", "");
  const existingKmMap = {};
  (existing || []).forEach((r) => { existingKmMap[`${r.date}|${r.ward}`] = r.gps_km; });

  // Step 2: Delete + Insert fresh rows (gps_km = "")
  const { error: delErr } = await supabase
    .from(GPS_TABLE)
    .delete()
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .eq("vehicle", vehicle);
  if (delErr) console.warn("GPS delete failed:", delErr.message);

  const rows = trackRows.map((r) => ({
    city, year, month, vehicle,
    date:                   r.date                || "",
    ward:                   r.ward                || "",
    name:                   r.name                || "",
    driver:                 r.driver              || "",
    duty_in_time:           r.dutyInTime          || "",
    duty_out_time:          r.dutyOutTime         || "",
    work_percentage:        String(r.workPercentage        ?? ""),
    portal_km:              String(r.portalKm              ?? ""),
    gps_km:                 "",
    meter_reading_distance: String(r.meterReadingDistance  ?? ""),
    distance:               String(r.distance              || "0"),
  }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase.from(GPS_TABLE).insert(rows.slice(i, i + 500));
    if (error) console.warn("GPS insert failed:", error.message);
  }

  // Step 3: Pehle se saved gps_km restore karo (fire-and-forget)
  Object.entries(existingKmMap).forEach(([key, gps_km]) => {
    const [date, ward] = key.split("|");
    supabase.from(GPS_TABLE)
      .update({ gps_km })
      .eq("city", city).eq("year", year).eq("month", month)
      .eq("vehicle", vehicle).eq("date", date).eq("ward", ward)
      .then(({ error }) => { if (error) console.warn("GPS KM restore failed:", error.message); });
  });
};

