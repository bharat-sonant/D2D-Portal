import React, { useEffect, useState, useCallback } from "react";
import styles from "./FuelReport.module.css";
import { FiTruck, FiDroplet, FiMapPin, FiSearch } from "react-icons/fi";
import { MdLocalGasStation, MdSpeed, MdCloudDownload } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getCityFirebaseConfigAsync } from "../../../configurations/cityDBConfig";
import { connectFirebase, getStorageInstance, waitForFirebaseReady } from "../../../firebase/firebaseService";
import { ref, getDownloadURL } from "firebase/storage";
import {
  getSummaryCache,      saveSummaryCache,
  getFuelCache,         saveFuelCache,       mapFuelRows,
  getVehicleListCache,  getFuelCacheByVehicle,
  getGPSCache, checkGPSCache, saveGPSCache,  mapGPSRows,
  saveGPSCacheMultiple, getUsageLogs,
} from "../../services/fuelCacheService";

const toTitleCase = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Helper: fetch JSON from Firebase Storage ──────────────────────────────────
const fetchStorageJSON = async (cityName, storagePath) => {
  await waitForFirebaseReady();
  const storage = getStorageInstance();
  if (!storage) throw new Error("Firebase Storage not ready");
  const fileRef = ref(storage, `${cityName}/VehicleFuelJSONData/${storagePath}`);
  const url = await getDownloadURL(fileRef);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return { data: JSON.parse(text), bytes: new Blob([text]).size };
};

// "2026-04-01" → "1 Apr"
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.getDate() + " " + d.toLocaleString("en-US", { month: "short" });
};

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// Parse GPS trackData object (Firebase format) → trackList array
const parseTrackData = (trackData) => {
  const trackList = [];
  let distTotal = 0;
  Object.keys(trackData).forEach((date) => {
    const dayList = trackData[date];
    if (!Array.isArray(dayList)) return;
    dayList.forEach((item) => {
      distTotal += Number(item.distance) || 0;
      trackList.push({
        date,
        ward:                 item.ward                 || "",
        name:                 item.name                 || "",
        driver:               item.driver               || "",
        dutyInTime:           item.dutyInTime           || "",
        dutyOutTime:          item.dutyOutTime          || "",
        workPercentage:       item.workPercentage       ?? "",
        portalKm:             item.portalKm             ?? "",
        gps_km:               item.gps_km               ?? "",
        meterReadingDistance: item.meterReadingDistance ?? "",
        distance:             (Number(item.distance) || 0).toFixed(3) + " KM",
        orderBy:              new Date(date).getTime(),
      });
    });
  });
  trackList.sort((a, b) => a.orderBy - b.orderBy);
  return { trackList, distTotal };
};

// ── Component ─────────────────────────────────────────────────────────────────
const FuelReport = () => {
  const { city } = useParams();
  const cityName = toTitleCase(city || "");

  const now = new Date();
  const [year, setYear]   = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(MONTH_NAMES[now.getMonth()]);

  const [vehicles, setVehicles]           = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [search, setSearch]               = useState("");

  const [summary, setSummary] = useState({ quantity: 0, amount: 0, runningKm: 0 });
  const [allFuelEntries, setAllFuelEntries]   = useState([]);
  const [vehicleFuelList, setVehicleFuelList] = useState([]);
  const [fuelTotals, setFuelTotals]           = useState({ qty: 0, amount: 0 });

  const [vehicleTrackList, setVehicleTrackList] = useState([]);
  const [totalDistance, setTotalDistance]       = useState("0.000 KM");

  const [loading, setLoading]               = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [dataBytes, setDataBytes]           = useState(0);
  const [showDataModal, setShowDataModal]   = useState(false);
  const [usageLogs, setUsageLogs]           = useState([]);
  const [usageLoading, setUsageLoading]     = useState(false);
  const [uFilterYear, setUFilterYear]       = useState(String(new Date().getFullYear()));
  const [uFilterMonth, setUFilterMonth]     = useState(MONTH_NAMES[new Date().getMonth()]);
  const [uFilterDate, setUFilterDate]       = useState("");
  const [activeService, setActiveService]   = useState(null);

  // ── Init Firebase ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!city) return;
    const init = async () => {
      try {
        const config = await getCityFirebaseConfigAsync(cityName);
        connectFirebase(config, cityName);
      } catch (err) {
        console.error("Firebase init error:", err);
      }
    };
    init();
  }, [city, cityName]);

  // ── Fetch month data — Supabase first, Firebase fallback ──────────────────
  const fetchMonthData = useCallback(async () => {
    if (!cityName) return;
    setLoading(true);
    setDataBytes(0);
    setActiveVehicle(null);
    setVehicleFuelList([]);
    setVehicleTrackList([]);
    setFuelTotals({ qty: 0, amount: 0 });
    setTotalDistance("0.000 KM");

    let totalBytes = 0;

    // ── 1. Month Summary ──────────────────────────────────────
    const summaryCache = await getSummaryCache(cityName, year, month);
    if (summaryCache) {
      console.log("[MonthSummary] data get from Supabase");
      setSummary({
        quantity:   summaryCache.total_qty    || 0,
        amount:     summaryCache.total_amount || 0,
        runningKm:  summaryCache.total_km     || 0,
      });
      totalBytes += new Blob([JSON.stringify(summaryCache)]).size;
    } else {
      try {
        const { data: sd, bytes: sb } = await fetchStorageJSON(cityName, `${year}/${month}/MonthSummary.json`);
        console.log("[MonthSummary] data get from Firebase");
        totalBytes += sb;
        const s = {
          quantity:  Number(sd.qty)      || 0,
          amount:    Number(sd.amount)   || 0,
          runningKm: Number(sd.totalKM)  || 0,
        };
        setSummary(s);
        saveSummaryCache(cityName, year, month, { total_qty: s.quantity, total_amount: s.amount, total_km: s.runningKm });
      } catch (err) {
        console.warn("MonthSummary fetch failed:", err.message);
        setSummary({ quantity: 0, amount: 0, runningKm: 0 });
      }
    }

    // ── 2. Vehicles List ──────────────────────────────────────
    const vehicleList = await getVehicleListCache(cityName, year, month);
    if (vehicleList) {
      console.log("[VehicleList] data get from Supabase");
      setAllFuelEntries([]);
      setVehicles(vehicleList);
      totalBytes += new Blob([JSON.stringify(vehicleList)]).size;
    } else {
      try {
        const { data: fuelData, bytes: fb } = await fetchStorageJSON(cityName, `${year}/${month}/VehicleFuel.json`);
        console.log("[VehicleList] data get from Firebase");
        totalBytes += fb;
        const list = Array.isArray(fuelData) ? fuelData : [];
        const parsed = list.map((r) => ({
          vehicle:      r.vehicle      || "",
          date:         r.date         || "",
          meterReading: r.meterReading || "",
          fuelType:     r.fuelType     || "",
          fuelVehicle:  r.fuelVehicle  || "",
          petrolPump:   r.petrolPump   || "",
          payMethod:    r.payMethod    || "",
          remark:       r.remark       || "",
          quantity:     Number(r.quantity) || 0,
          amount:       Number(r.amount)   || 0,
          orderBy:      new Date(r.date).getTime(),
        }));
        setAllFuelEntries(parsed);
        setVehicles([...new Set(parsed.map((e) => e.vehicle).filter(Boolean))].sort());
        await saveFuelCache(cityName, year, month, parsed);
        // Data ab Supabase me save ho gaya — log karo
        await getVehicleListCache(cityName, year, month);
      } catch (err) {
        console.warn("VehicleFuel fetch failed:", err.message);
        setAllFuelEntries([]);
        setVehicles([]);
      }
    }

    setDataBytes(totalBytes);
    setLoading(false);
  }, [cityName, year, month]);

  useEffect(() => { fetchMonthData(); }, [fetchMonthData]);

  // ── Auto background GPS migration — runs silently after vehicles list loads ──
  useEffect(() => {
    if (!vehicles.length || !cityName) return;

    let cancelled = false;

    const autoMigrate = async () => {
      try {
        await waitForFirebaseReady();
        if (cancelled) return;

        // Phase 1: Check all caches in parallel
        const cacheChecks = await Promise.all(
          vehicles.map((v) => checkGPSCache(cityName, year, month, v))
        );
        if (cancelled) return;

        const toFetch = vehicles.filter((_, i) => !cacheChecks[i]);
        if (!toFetch.length) return;

        // Phase 2: Fetch all uncached from Firebase in parallel
        const fetchResults = await Promise.allSettled(
          toFetch.map((v) =>
            fetchStorageJSON(cityName, `${year}/${month}/VehicleWardKM/${v}.json`)
          )
        );
        if (cancelled) return;

        // Phase 3: Collect valid results
        const pairs = [];
        fetchResults.forEach((result, i) => {
          if (result.status === "fulfilled") {
            const { data: trackData } = result.value;
            const { trackList } = parseTrackData(trackData);
            if (trackList.length) pairs.push({ vehicle: toFetch[i], trackList });
          }
        });

        // Phase 4: Bulk insert to Supabase in parallel chunks
        if (pairs.length) {
          await saveGPSCacheMultiple(cityName, year, month, pairs);
          console.info(`[GPS AutoMigrate] ${pairs.length} vehicles saved to Supabase`);
        }
      } catch (err) {
        console.warn("[GPS AutoMigrate] Error:", err.message);
      }
    };

    autoMigrate();

    return () => { cancelled = true; };
  }, [cityName, year, month, vehicles]);

  // ── Vehicle click — Supabase first, Firebase fallback ────────────────────
  const handleVehicleClick = useCallback(async (vehicle) => {
    setActiveVehicle(vehicle);
    setVehicleTrackList([]);
    setVehicleFuelList([]);
    setTotalDistance("0.000 KM");
    setVehicleLoading(true);

    // Fuel entries — Supabase first, fallback to in-memory (Firebase path)
    const fuelByVehicle = await getFuelCacheByVehicle(cityName, year, month, vehicle);
    if (fuelByVehicle) console.log(`[FuelEntries — ${vehicle}] data get from Supabase`);
    else console.log(`[FuelEntries — ${vehicle}] data get from Firebase (memory)`);
    const fuelList = fuelByVehicle
      ? mapFuelRows(fuelByVehicle).sort((a, b) => a.orderBy - b.orderBy)
      : allFuelEntries.filter((e) => e.vehicle === vehicle).sort((a, b) => a.orderBy - b.orderBy);
    setVehicleFuelList(fuelList);
    setFuelTotals({
      qty:    fuelList.reduce((s, e) => s + e.quantity, 0),
      amount: fuelList.reduce((s, e) => s + e.amount,   0),
    });

    // Try Supabase cache first
    const gpsCache = await getGPSCache(cityName, year, month, vehicle);
    if (gpsCache) {
      console.log(`[GPSRoute — ${vehicle}] data get from Supabase`);
      const trackList = mapGPSRows(gpsCache);
      const distTotal = trackList.reduce((s, r) => s + (parseFloat(r.distance) || 0), 0);
      setVehicleTrackList(trackList);
      setTotalDistance(distTotal.toFixed(3) + " KM");
      setVehicleLoading(false);
      return;
    }

    // Fallback: Firebase
    try {
      await waitForFirebaseReady();
      const { data: trackData } = await fetchStorageJSON(
        cityName, `${year}/${month}/VehicleWardKM/${vehicle}.json`
      );
      console.log(`[GPSRoute — ${vehicle}] data get from Firebase`);
      const { trackList, distTotal } = parseTrackData(trackData);
      setVehicleTrackList(trackList);
      setTotalDistance(distTotal.toFixed(3) + " KM");
      saveGPSCache(cityName, year, month, vehicle, trackList);
    } catch (err) {
      console.warn("VehicleWardKM fetch failed:", err.message);
    }
    setVehicleLoading(false);
  }, [cityName, year, month, allFuelEntries]);

  const filteredVehicles = vehicles.filter((v) =>
    v.toLowerCase().includes(search.toLowerCase())
  );

  const fetchUsageLogs = async (filterYear, filterMonth, filterDate) => {
    setUsageLoading(true);
    setUsageLogs([]);
    const logs = await getUsageLogs(cityName, filterYear, filterMonth, filterDate || null);
    setUsageLogs(logs);
    setUsageLoading(false);
  };

  const handleOpenDataModal = () => {
    const y = String(new Date().getFullYear());
    const m = MONTH_NAMES[new Date().getMonth()];
    setUFilterYear(y);
    setUFilterMonth(m);
    setUFilterDate("");
    setActiveService(null);
    setShowDataModal(true);
    fetchUsageLogs(y, m, "");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ══════ TOP BAR ══════ */}
      <div className={styles.topBar}>
        <div className={styles.filters}>
          <select className={styles.select} value={year} onChange={(e) => setYear(e.target.value)}>
            {[now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear()].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <select className={styles.select} value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTH_NAMES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        <h1 className={styles.pageTitle}>VEHICLE FUEL REPORT</h1>

        <div className={styles.topRight}>
          <div className={styles.statPill}>
            <MdLocalGasStation className={styles.pillIcon} />
            <div>
              <strong>{summary.quantity.toLocaleString()}</strong>
              <span>Quantity</span>
            </div>
          </div>
          <div className={styles.statPill}>
            <span className={styles.rupee}>₹</span>
            <div>
              <strong>{summary.amount.toLocaleString()}</strong>
              <span>Amount</span>
            </div>
          </div>
          <div className={styles.statPill}>
            <MdSpeed className={styles.pillIcon} />
            <div>
              <strong>{summary.runningKm.toLocaleString()}</strong>
              <span>Running KM</span>
            </div>
          </div>
          <div className={`${styles.statPill} ${styles.statPillClickable}`} onClick={handleOpenDataModal}>
            <MdCloudDownload className={styles.pillIcon} />
            <div>
              <span>Data Loaded</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ BODY ══════ */}
      <div className={styles.body}>

        {/* ── Vehicle List ── */}
        <div className={styles.rightPanel}>
          {loading && <div className={styles.panelLoader}><span className={styles.loaderSpinner} /></div>}
          <div className={styles.vehicleListHeader}>
            <FiTruck /> Vehicles
            <span className={styles.vehicleCount}>{vehicles.length}</span>
          </div>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search vehicle…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className={styles.vehicleList}>
            {filteredVehicles.map((v) => (
              <li
                key={v}
                className={`${styles.vehicleItem} ${activeVehicle === v ? styles.activeVehicle : ""}`}
                onClick={() => handleVehicleClick(v)}
              >
                <span className={styles.vDot} />
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Fuel Entries ── */}
        <div className={styles.leftPanel}>
          <div className={styles.tableCard}>
            {vehicleLoading && <div className={styles.panelLoader}><span className={styles.loaderSpinner} /></div>}
            <div className={styles.tableCardHeader}>
              <FiDroplet /> Fuel Entries
            </div>
            <div className={styles.totalsRow}>
              <div className={styles.totalCard}>
                <FiDroplet className={styles.tcIcon} />
                <div>
                  <p className={styles.tcLabel}>Total Quantity</p>
                  <p className={styles.tcValue}>{fuelTotals.qty.toFixed(2)}</p>
                </div>
              </div>
              <div className={styles.totalCard}>
                <span className={styles.tcIconRupee}>₹</span>
                <div>
                  <p className={styles.tcLabel}>Total Amount</p>
                  <p className={styles.tcValue}>₹ {fuelTotals.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th><th>Meter</th><th>Type</th><th>Qty</th><th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleFuelList.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", opacity: 0.5, padding: "16px" }}>
                        {activeVehicle ? "No fuel entries found" : "Select a vehicle"}
                      </td>
                    </tr>
                  ) : (
                    vehicleFuelList.map((r, i) => (
                      <tr key={i}>
                        <td>{formatDate(r.date)}</td>
                        <td>{r.meterReading || "—"}</td>
                        <td><span className={styles.fuelBadge}>{r.fuelType || "—"}</span></td>
                        <td>{r.quantity.toFixed(2)}</td>
                        <td>₹ {r.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── GPS Route ── */}
        <div className={styles.midPanel}>
          <div className={styles.tableCard}>
            {vehicleLoading && <div className={styles.panelLoader}><span className={styles.loaderSpinner} /></div>}
            <div className={styles.tableCardHeader}>
              <FiMapPin /> GPS Route Data
            </div>
            <div className={styles.vehicleBar}>
              <div className={styles.vbItem}>
                <FiTruck className={styles.vbIcon} />
                <span>{activeVehicle || "---"}</span>
              </div>
              <div className={styles.vbItem}>
                <FiMapPin className={styles.vbIcon} />
                <span>{totalDistance}</span>
              </div>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th><th>Driver</th><th>Ward</th><th>Duty On</th><th>Duty Off</th>
                    <th>Work %</th><th>Portal KM</th><th>GPS KM</th><th>Meter KM</th><th>Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleTrackList.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: "center", opacity: 0.5, padding: "16px" }}>
                        {activeVehicle ? "No route data found" : "Select a vehicle"}
                      </td>
                    </tr>
                  ) : (
                    vehicleTrackList.map((r, i) => {
                      const workPct = Number(r.workPercentage);
                      return (
                        <tr key={i}>
                          <td>{formatDate(r.date)}</td>
                          <td>{r.name || r.driver}</td>
                          <td><span className={styles.wardChip}>{r.ward}</span></td>
                          <td>{r.dutyInTime}</td>
                          <td className={workPct < 100 ? styles.lateOff : ""}>{r.dutyOutTime}</td>
                          <td>
                            <span className={`${styles.workPct} ${workPct === 100 ? styles.full : workPct >= 90 ? styles.high : styles.low}`}>
                              {r.workPercentage}%
                            </span>
                          </td>
                          <td>{r.portalKm}</td>
                          <td>{r.gps_km}</td>
                          <td>{r.meterReadingDistance !== "" ? r.meterReadingDistance : "—"}</td>
                          <td><strong>{r.distance}</strong></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* ══════ USAGE HISTORY DRAWER ══════ */}
      {showDataModal && (
        <div className={styles.drawerOverlay} onClick={() => setShowDataModal(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>

            {/* ── Header ── */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerHeaderLeft}>
                <MdCloudDownload className={styles.drawerHeaderIcon} />
                <div>
                  <div className={styles.drawerTitle}>DB Service Tracking</div>
                  <div className={styles.drawerSubtitle}>{cityName}</div>
                </div>
              </div>
              <button className={styles.drawerClose} onClick={() => setShowDataModal(false)}>✕</button>
            </div>

            {/* ── 2 Column Body ── */}
            <div className={styles.drawerBody}>

              {/* ── Col 2: Service List (clickable) ── */}
              <div className={styles.drawerCol2}>
                {usageLoading ? (
                  <p className={styles.drawerEmpty}>Loading…</p>
                ) : usageLogs.length === 0 ? (
                  <p className={styles.drawerEmpty}>No data found.</p>
                ) : (
                  [...new Set(usageLogs.map((l) => l.service))]
                    .map((svc) => {
                      const svcLogs = usageLogs.filter((l) => l.service === svc);
                      return {
                        svc,
                        calls: svcLogs.reduce((s, l) => s + l.calls, 0),
                        bytes: svcLogs.reduce((s, l) => s + l.totalBytes, 0),
                      };
                    })
                    .sort((a, b) => b.calls - a.calls)
                    .map(({ svc, calls, bytes }) => {
                      const isActive = activeService === svc;
                      return (
                        <div
                          key={svc}
                          className={`${styles.drawerSvcRow} ${isActive ? styles.drawerSvcActive : ""}`}
                          onClick={() => setActiveService(isActive ? null : svc)}
                        >
                          <span className={styles.drawerSvcName}>{svc}</span>
                          <span className={styles.drawerSvcBytes}>{formatBytes(bytes)}</span>
                          <span className={styles.drawerSvcCalls}>{calls}</span>
                        </div>
                      );
                    })
                )}
              </div>

              {/* ── Col 3: Date breakdown ── */}
              <div className={styles.drawerCol3}>
                <div className={styles.drawerCol3Header}>
                  <select
                    className={styles.usageSelect}
                    value={uFilterYear}
                    onChange={(e) => { setUFilterYear(e.target.value); fetchUsageLogs(e.target.value, uFilterMonth, uFilterDate); }}
                  >
                    {[now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear()].map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                  <select
                    className={styles.usageSelect}
                    value={uFilterMonth}
                    onChange={(e) => { setUFilterMonth(e.target.value); fetchUsageLogs(uFilterYear, e.target.value, uFilterDate); }}
                  >
                    {MONTH_NAMES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div className={styles.drawerDateList}>
                  <div className={styles.drawerDateHeader}>
                    <span>DATE</span><span style={{textAlign:"center"}}>COUNTS</span><span style={{textAlign:"right", paddingRight:4}}>SIZE</span>
                  </div>
                  {(() => {
                    const filtered = activeService
                      ? usageLogs.filter((l) => l.service === activeService)
                      : usageLogs;
                    const byDate = {};
                    filtered.forEach(({ date, calls, totalBytes }) => {
                      if (!byDate[date]) byDate[date] = { calls: 0, totalBytes: 0 };
                      byDate[date].calls      += calls;
                      byDate[date].totalBytes += totalBytes;
                    });
                    return Object.entries(byDate)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([date, { calls, totalBytes }]) => (
                        <div key={date} className={styles.drawerDateRow}>
                          <span className={styles.drawerDateLabel}>{formatDate(date)}</span>
                          <span className={styles.drawerDateCalls}>{calls}</span>
                          <span className={styles.drawerDateBytes}>{formatBytes(totalBytes)}</span>
                        </div>
                      ));
                  })()}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FuelReport;
