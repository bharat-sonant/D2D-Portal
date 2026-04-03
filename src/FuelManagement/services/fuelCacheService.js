import { supabase } from "../../createClient";

const SUMMARY_TABLE = "VehicleMonthSummaryCache";
const FUEL_TABLE    = "VehicleFuelCache";
const GPS_TABLE     = "VehicleGPSCache";
const LOG_TABLE     = "ApiUsageLogs";

// ── Usage Logger → Supabase atomic increment via RPC (fire-and-forget) ────────
const logUsage = (city, _year, _month, service, source, bytes) => {
  const now  = new Date();
  const date = now.toISOString().slice(0, 10);                          // YYYY-MM-DD
  const year = String(now.getFullYear());                               // actual current year
  const month = now.toLocaleString("en-US", { month: "long" });        // actual current month
  supabase.rpc("increment_api_usage", {
    p_city: city, p_year: year, p_month: month, p_date: date,
    p_service: service, p_source: source, p_bytes: bytes,
  }).then(({ error }) => { if (error) console.warn("Usage log failed:", error.message); });
};

// ── Read usage logs from Supabase (already aggregated per row) ───────────────
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

// ── Month Summary ─────────────────────────────────────────────────────────────

export const getSummaryCache = async (city, year, month) => {
  const { data, error } = await supabase
    .from(SUMMARY_TABLE)
    .select("*")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();
  if (error || !data) return null;
  return data;
};

export const saveSummaryCache = async (city, year, month, { total_qty, total_amount, total_km }) => {
  const { error } = await supabase
    .from(SUMMARY_TABLE)
    .upsert({ city, year, month, total_qty, total_amount, total_km }, { onConflict: "city,year,month" });
  if (error) console.warn("Summary cache save failed:", error.message);
};

// ── Fuel Entries ──────────────────────────────────────────────────────────────

export const getFuelCache = async (city, year, month) => {
  const { data, error } = await supabase
    .from(FUEL_TABLE)
    .select("*")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month);
  if (error || !data?.length) return null;
  return data;
};

// Returns only distinct vehicle names — lightweight query for vehicles list
export const getVehicleListData = async (city, year, month) => {
  const { data, error } = await supabase
    .from(FUEL_TABLE)
    .select("vehicle")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month);
  if (error || !data?.length) return null;
  logUsage(city, year, month, "getVehicleListData", "Supabase", new Blob([JSON.stringify(data)]).size);
  return [...new Set(data.map((r) => r.vehicle).filter(Boolean))].sort();
};

// Returns fuel entries for a specific vehicle only
export const getFuelDataByVehicle = async (city, year, month, vehicle) => {
  const { data, error } = await supabase
    .from(FUEL_TABLE)
    .select("*")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .eq("vehicle", vehicle);
  if (error || !data?.length) return null;
  logUsage(city, year, month, "getFuelDataByVehicle", "Supabase", new Blob([JSON.stringify(data)]).size);
  return data;
};

export const saveFuelCache = async (city, year, month, entries) => {
  const rows = entries.map((e) => ({
    city, year, month,
    vehicle:       e.vehicle       || "",
    date:          e.date          || "",
    meter_reading: e.meterReading  || "",
    fuel_type:     e.fuelType      || "",
    fuel_vehicle:  e.fuelVehicle   || "",
    petrol_pump:   e.petrolPump    || "",
    pay_method:    e.payMethod     || "",
    remark:        e.remark        || "",
    quantity:      e.quantity      || 0,
    amount:        e.amount        || 0,
  }));

  // Insert in 500-row chunks to avoid request size limits
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase.from(FUEL_TABLE).insert(rows.slice(i, i + 500));
    if (error) console.warn("Fuel cache save failed:", error.message);
  }
};

// Map Supabase rows → app shape
export const mapFuelRows = (rows) =>
  rows.map((r) => ({
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

// ── GPS Routes ────────────────────────────────────────────────────────────────

// Silent version — used by autoMigrate (no usage log)
export const checkGPSCache = async (city, year, month, vehicle) => {
  const { data, error } = await supabase
    .from(GPS_TABLE)
    .select("id")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .eq("vehicle", vehicle)
    .limit(1);
  if (error || !data?.length) return null;
  return true;
};

// Normal version — used on vehicle click (logs usage)
export const getGPSData = async (city, year, month, vehicle) => {
  const { data, error } = await supabase
    .from(GPS_TABLE)
    .select("*")
    .eq("city", city)
    .eq("year", year)
    .eq("month", month)
    .eq("vehicle", vehicle);
  if (error || !data?.length) return null;
  logUsage(city, year, month, "getGPSData", "Supabase", new Blob([JSON.stringify(data)]).size);
  return data;
};

export const saveGPSCache = async (city, year, month, vehicle, trackList) => {
  const rows = trackList.map((t) => ({
    city, year, month, vehicle,
    date:                   t.date                          || "",
    ward:                   t.ward                          || "",
    name:                   t.name                          || "",
    driver:                 t.driver                        || "",
    duty_in_time:           t.dutyInTime                    || "",
    duty_out_time:          t.dutyOutTime                   || "",
    work_percentage:        String(t.workPercentage  ?? ""),
    portal_km:              String(t.portalKm        ?? ""),
    gps_km:                 String(t.gps_km          ?? ""),
    meter_reading_distance: String(t.meterReadingDistance ?? ""),
    distance:               t.distance                      || "",
  }));

  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase.from(GPS_TABLE).insert(rows.slice(i, i + 500));
    if (error) console.warn("GPS cache save failed:", error.message);
  }
};

// ── Bulk GPS save for multiple vehicles (parallel chunk insert) ───────────────
export const saveGPSCacheMultiple = async (city, year, month, vehicleTrackPairs) => {
  const allRows = vehicleTrackPairs.flatMap(({ vehicle, trackList }) =>
    trackList.map((t) => ({
      city, year, month, vehicle,
      date:                   t.date                          || "",
      ward:                   t.ward                          || "",
      name:                   t.name                          || "",
      driver:                 t.driver                        || "",
      duty_in_time:           t.dutyInTime                    || "",
      duty_out_time:          t.dutyOutTime                   || "",
      work_percentage:        String(t.workPercentage  ?? ""),
      portal_km:              String(t.portalKm        ?? ""),
      gps_km:                 String(t.gps_km          ?? ""),
      meter_reading_distance: String(t.meterReadingDistance ?? ""),
      distance:               t.distance                      || "",
    }))
  );

  const CHUNK = 500;
  const chunks = [];
  for (let i = 0; i < allRows.length; i += CHUNK) {
    chunks.push(allRows.slice(i, i + CHUNK));
  }

  // Insert all chunks in parallel
  const results = await Promise.all(
    chunks.map((chunk) => supabase.from(GPS_TABLE).insert(chunk))
  );
  results.forEach((r) => {
    if (r.error) console.warn("GPS bulk insert failed:", r.error.message);
  });
};

// Map Supabase rows → app shape
export const mapGPSRows = (rows) =>
  rows
    .map((r) => ({
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
      distance:             r.distance               || "0.000 KM",
      orderBy:              new Date(r.date).getTime(),
    }))
    .sort((a, b) => a.orderBy - b.orderBy);
