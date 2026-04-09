import React, { useEffect, useState, useCallback } from "react";
import styles from "./FuelReport.module.css";
import { FiTruck, FiDroplet, FiMapPin, FiSearch } from "react-icons/fi";
import { MdLocalGasStation, MdSpeed, MdCloudDownload, MdSync } from "react-icons/md";
import { updateFuelJSON, fetchWevoisGPSKm, enrichVehicleGPSData } from "../../services/fuelUpdateService";
import { useParams } from "react-router-dom";
import { getCityFirebaseConfigAsync } from "../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../firebase/firebaseService";
import { getUsageLogs, getSummaryCache, getVehicleList, getFuelByVehicle, getGPSByVehicle, updateGPSKm, updateGPSEnrichedData } from "../../services/fuelCacheService";

const toTitleCase = (value = "") =>
  String(value).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
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


// ── Component ─────────────────────────────────────────────────────────────────
const FuelReport = () => {
  const { city } = useParams();
  const cityName  = toTitleCase(city || "");

  const now = new Date();
  const [year, setYear]   = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(MONTH_NAMES[now.getMonth()]);

  const [vehicles, setVehicles]           = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [search, setSearch]               = useState("");

  const [summary, setSummary]             = useState({ quantity: 0, amount: 0, runningKm: 0 });
  const [vehicleFuelList, setVehicleFuelList] = useState([]);
  const [fuelTotals, setFuelTotals]           = useState({ qty: 0, amount: 0 });

  const [vehicleTrackList, setVehicleTrackList] = useState([]);
  const [totalDistance, setTotalDistance]       = useState("0.000 KM");

  const [loading, setLoading]               = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [syncing, setSyncing]               = useState(false);

  const [syncMessage, setSyncMessage] = useState("");
  const [syncPercent, setSyncPercent] = useState(0);

  const [showDataModal, setShowDataModal] = useState(false);
  const [usageLogs, setUsageLogs]         = useState([]);
  const [usageLoading, setUsageLoading]   = useState(false);
  const [uFilterYear, setUFilterYear]     = useState(String(now.getFullYear()));
  const [uFilterMonth, setUFilterMonth]   = useState(MONTH_NAMES[now.getMonth()]);
  const [uFilterDate, setUFilterDate]     = useState("");
  const [activeService, setActiveService] = useState(null);

  // ── Init Firebase ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!city) return;
    getCityFirebaseConfigAsync(cityName)
      .then((config) => connectFirebase(config, cityName))
      .catch((err)  => console.error("Firebase init error:", err));
  }, [city, cityName]);

  // ── Fetch month data — Supabase Tables se ────────────────────────────────
  const fetchMonthData = useCallback(async () => {
    if (!cityName) return;
    setLoading(true);
    setActiveVehicle(null);
    setVehicleFuelList([]);
    setVehicleTrackList([]);
    setFuelTotals({ qty: 0, amount: 0 });
    setTotalDistance("0.000 KM");

    // Dono parallel start — jo pehle aaye woh pehle set ho
    getSummaryCache(cityName, year, month).then((summaryData) => {
      setSummary(summaryData ? {
        quantity:  Number(summaryData.total_qty)    || 0,
        amount:    Number(summaryData.total_amount) || 0,
        runningKm: Number(summaryData.total_km)     || 0,
      } : { quantity: 0, amount: 0, runningKm: 0 });
    });

    const vehicleListData = await getVehicleList(cityName, year, month);
    setVehicles(vehicleListData);
    setLoading(false);
  }, [cityName, year, month]);

  useEffect(() => { fetchMonthData(); }, [fetchMonthData]);

  // ── Manual Sync ───────────────────────────────────────────────────────────
  // Full sync — Fuel + GPS/KM sab complete hone ke baad UI show hoga
  // Progress overlay se user ko pata rehta hai kya ho raha hai
  const handleSyncData = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncMessage("Sync shuru ho rahi hai...");
    setSyncPercent(0);
    try {
      await updateFuelJSON(cityName, year, month, ({ message, percent }) => {
        setSyncMessage(message);
        setSyncPercent(percent ?? 0);
      });
      setSyncMessage("Data load ho raha hai...");
      setSyncPercent(100);
      await fetchMonthData();
    } catch (err) {
      console.error("[SyncData] Error:", err);
      setSyncMessage("Sync fail hua. Console check karein.");
    } finally {
      setSyncing(false);
      setSyncMessage("");
      setSyncPercent(0);
    }
  }, [cityName, year, month, syncing, fetchMonthData]);

  // ── Vehicle click — Fuel + GPS parallel table queries ─────────────────────
  const handleVehicleClick = useCallback(async (vehicle) => {
    setActiveVehicle(vehicle);
    setVehicleTrackList([]);
    setVehicleFuelList([]);
    setTotalDistance("0.000 KM");
    setVehicleLoading(true);

    // Fuel + GPS parallel — dono table se ek saath
    const [fuelData, gpsData] = await Promise.all([
      getFuelByVehicle(cityName, year, month, vehicle),
      getGPSByVehicle(cityName, year, month, vehicle),
    ]);

    setVehicleFuelList(fuelData);
    setFuelTotals({
      qty:    fuelData.reduce((s, e) => s + e.quantity, 0),
      amount: fuelData.reduce((s, e) => s + e.amount,   0),
    });

    if (gpsData.length === 0) {
      setVehicleTrackList([]);
      setTotalDistance("0.000 KM");
      setVehicleLoading(false);
      return;
    }

    // Sirf unenriched rows — dutyInTime="" wali (aaj ki date chod ke)
    // distance sync mein fill ho chuki hai, "0.000 KM" check nahi karna

    let trackList = [...gpsData];
    const todayStr = new Date().toISOString().slice(0, 10);
    const unenriched = trackList.filter((r) => r.dutyInTime === "" && r.date !== todayStr);
    if (unenriched.length > 0) {
      const enriched = await enrichVehicleGPSData(cityName, year, month, vehicle, unenriched);
      // Enriched rows ko trackList mein merge karo
      enriched.forEach((er) => {
        const idx = trackList.findIndex((r) => r.date === er.date && r.ward === er.ward);
        if (idx !== -1) trackList[idx] = er;
      });
      // Table mein save — fire-and-forget
      updateGPSEnrichedData(cityName, year, month, vehicle, enriched);
    }

    // GPS KM — Wevois se parallel (gps_km="" wali rows fill karo)
    const gpsNeeded = trackList.filter((r) => r.gps_km === "" && r.dutyInTime);
    if (gpsNeeded.length > 0) {
      const updates = [];
      await Promise.all(
        gpsNeeded.map(async (row) => {
          const km  = await fetchWevoisGPSKm(row.dutyInTime, row.dutyOutTime, vehicle, row.date);
          const idx = trackList.findIndex((r) => r.date === row.date && r.ward === row.ward);
          if (idx !== -1) {
            trackList[idx] = { ...trackList[idx], gps_km: km };
            updates.push({ date: row.date, ward: row.ward, gps_km: km });
          }
        })
      );
      if (updates.length > 0) updateGPSKm(cityName, year, month, vehicle, updates);
    }

    const totalKM = trackList.reduce((s, r) => s + (parseFloat(r.distance) || 0), 0);
    setVehicleTrackList([...trackList]);
    setTotalDistance(totalKM.toFixed(3) + " KM");
    setVehicleLoading(false);
  }, [cityName, year, month]);

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
    const y = String(now.getFullYear());
    const m = MONTH_NAMES[now.getMonth()];
    setUFilterYear(y); setUFilterMonth(m); setUFilterDate("");
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
          <div
            className={`${styles.statPill} ${styles.statPillClickable} ${syncing ? styles.statPillSyncing : ""}`}
            onClick={handleSyncData}
            title="Sync Data"
          >
            <MdSync className={`${styles.pillIcon} ${syncing ? styles.spinIcon : ""}`} />
            <div>
              <span>{syncing ? "Syncing..." : "Sync Data"}</span>
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

      {/* ══════ SYNC PROGRESS OVERLAY ══════ */}
      {syncing && (
        <div className={styles.syncOverlay}>
          <div className={styles.syncCard}>
            <MdSync className={styles.syncCardIcon} />
            <div className={styles.syncCardTitle}>Syncing Data…</div>
            <div className={styles.syncCardMsg}>{syncMessage}</div>
            <div className={styles.syncBarTrack}>
              <div className={styles.syncBarFill} style={{ width: `${syncPercent}%` }} />
            </div>
            <div className={styles.syncPercent}>{syncPercent}%</div>
          </div>
        </div>
      )}

      {/* ══════ USAGE HISTORY DRAWER ══════ */}
      {showDataModal && (
        <div className={styles.drawerOverlay} onClick={() => setShowDataModal(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>

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

            <div className={styles.drawerBody}>

              {/* ── Left: Services grouped by Source ── */}
              <div className={styles.drawerCol2}>
                {usageLoading ? (
                  <p className={styles.drawerEmpty}>Loading…</p>
                ) : usageLogs.length === 0 ? (
                  <p className={styles.drawerEmpty}>No data found.</p>
                ) : (() => {
                  // Group by source → service
                  const bySource = {};
                  usageLogs.forEach(({ source, service, calls, totalBytes }) => {
                    if (!bySource[source]) bySource[source] = {};
                    if (!bySource[source][service]) bySource[source][service] = { calls: 0, bytes: 0 };
                    bySource[source][service].calls += calls;
                    bySource[source][service].bytes += totalBytes;
                  });
                  const SOURCE_ORDER  = ["SupabaseTable", "FirebaseRealtimeDB", "ExternalAPI", "SupabaseStorage"];
                  const SOURCE_LABELS = {
                    SupabaseTable:      "Supabase Table",
                    FirebaseRealtimeDB: "Firebase DB",
                    ExternalAPI:        "External API",
                    SupabaseStorage:    "Supabase Storage",
                  };
                  return SOURCE_ORDER.filter((src) => bySource[src]).map((src) => (
                    <div key={src} className={styles.drawerSrcGroup}>
                      <div className={`${styles.drawerSrcHeader} ${styles[`src${src}`]}`}>
                        {SOURCE_LABELS[src]}
                      </div>
                      {Object.entries(bySource[src])
                        .sort(([, a], [, b]) => b.calls - a.calls)
                        .map(([svc, { calls, bytes }]) => {
                          const key      = `${src}:${svc}`;
                          const isActive = activeService === key;
                          return (
                            <div key={key} className={`${styles.drawerSvcRow} ${isActive ? styles.drawerSvcActive : ""}`} onClick={() => setActiveService(isActive ? null : key)}>
                              <span className={styles.drawerSvcName}>{svc}</span>
                              <span className={styles.drawerSvcBytes}>{formatBytes(bytes)}</span>
                              <span className={styles.drawerSvcCalls}>{calls}</span>
                            </div>
                          );
                        })}
                    </div>
                  ));
                })()}
              </div>

              {/* ── Right: Year/Month filter + Date breakdown ── */}
              <div className={styles.drawerCol3}>
                <div className={styles.drawerCol3Header}>
                  <select className={styles.usageSelect} value={uFilterYear} onChange={(e) => { setUFilterYear(e.target.value); fetchUsageLogs(e.target.value, uFilterMonth, uFilterDate); }}>
                    {[now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear()].map((y) => <option key={y}>{y}</option>)}
                  </select>
                  <select className={styles.usageSelect} value={uFilterMonth} onChange={(e) => { setUFilterMonth(e.target.value); fetchUsageLogs(uFilterYear, e.target.value, uFilterDate); }}>
                    {MONTH_NAMES.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className={styles.drawerDateList}>
                  <div className={styles.drawerDateHeader}>
                    <span>DATE</span><span style={{ textAlign: "center" }}>COUNTS</span><span style={{ textAlign: "right", paddingRight: 4 }}>SIZE</span>
                  </div>
                  {(() => {
                    const filtered = activeService
                      ? (() => { const [src, svc] = activeService.split(":"); return usageLogs.filter((l) => l.source === src && l.service === svc); })()
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
