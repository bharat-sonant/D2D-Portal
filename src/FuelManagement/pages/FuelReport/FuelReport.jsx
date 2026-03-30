import React, { useEffect, useState, useCallback } from "react";
import styles from "./FuelReport.module.css";
import { FiTruck, FiDroplet, FiMapPin, FiSearch } from "react-icons/fi";
import { MdLocalGasStation, MdSpeed, MdCloudDownload } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getCityFirebaseConfigAsync } from "../../../configurations/cityDBConfig";
import { connectFirebase, getStorageInstance, waitForFirebaseReady } from "../../../firebase/firebaseService";
import { ref, getDownloadURL } from "firebase/storage";

const toTitleCase = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Helper: fetch JSON from Firebase Storage (returns { data, bytes }) ───────
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

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// ── Component ────────────────────────────────────────────────────────────────
const FuelReport = () => {
  const { city } = useParams();
  const cityName = toTitleCase(city || "");

  const now = new Date();
  const [year, setYear]   = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(MONTH_NAMES[now.getMonth()]);

  // Vehicle list
  const [vehicles, setVehicles]     = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [search, setSearch]         = useState("");

  // Month summary (top bar)
  const [summary, setSummary] = useState({ quantity: 0, amount: 0, runningKm: 0 });

  // All fuel entries for the month (unfiltered)
  const [allFuelEntries, setAllFuelEntries] = useState([]);

  // Per-vehicle fuel entries & totals
  const [vehicleFuelList, setVehicleFuelList]   = useState([]);
  const [fuelTotals, setFuelTotals]             = useState({ qty: 0, amount: 0 });

  // GPS route data for selected vehicle
  const [vehicleTrackList, setVehicleTrackList] = useState([]);
  const [totalDistance, setTotalDistance]       = useState("0.000 KM");

  const [loading, setLoading] = useState(false);
  const [dataBytes, setDataBytes] = useState(0);

  // ── Init Firebase ──────────────────────────────────────────────────────────
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

  // ── Fetch month summary + fuel entries on year/month change ───────────────
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

    try {
      // 1. Month Summary
      const { data: summaryData, bytes: sb } = await fetchStorageJSON(cityName, `${year}/${month}/MonthSummary.json`);
      totalBytes += sb;
      setSummary({
        quantity: Number(summaryData.qty)      || 0,
        amount:   Number(summaryData.amount)   || 0,
        runningKm: Number(summaryData.totalKM) || 0,
      });
    } catch (err) {
      console.warn("MonthSummary fetch failed:", err.message);
      setSummary({ quantity: 0, amount: 0, runningKm: 0 });
    }

    try {
      // 2. Fuel Entries
      const { data: fuelData, bytes: fb } = await fetchStorageJSON(cityName, `${year}/${month}/VehicleFuel.json`);
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
      // Unique vehicles from JSON data, sorted alphabetically
      const uniqueVehicles = [...new Set(parsed.map((e) => e.vehicle).filter(Boolean))].sort();
      setVehicles(uniqueVehicles);
    } catch (err) {
      console.warn("VehicleFuel fetch failed:", err.message);
      setAllFuelEntries([]);
      setVehicles([]);
    }

    setDataBytes(totalBytes);
    setLoading(false);
  }, [cityName, year, month]);

  useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  // ── On vehicle click: filter fuel + fetch GPS route ───────────────────────
  const handleVehicleClick = useCallback(async (vehicle) => {
    setActiveVehicle(vehicle);
    setVehicleTrackList([]);
    setTotalDistance("0.000 KM");

    // Filter fuel entries
    const filtered = allFuelEntries
      .filter((e) => e.vehicle === vehicle)
      .sort((a, b) => a.orderBy - b.orderBy);
    setVehicleFuelList(filtered);

    const totalQty    = filtered.reduce((s, e) => s + e.quantity, 0);
    const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);
    setFuelTotals({ qty: totalQty, amount: totalAmount });

    // Fetch GPS route data
    try {
      await waitForFirebaseReady();
      const { data: trackData, bytes: tb } = await fetchStorageJSON(cityName, `${year}/${month}/VehicleWardKM/${vehicle}.json`);
      setDataBytes((prev) => prev + tb);
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
      setVehicleTrackList(trackList);
      setTotalDistance(distTotal.toFixed(3) + " KM");
    } catch (err) {
      console.warn("VehicleWardKM fetch failed:", err.message);
    }
  }, [cityName, year, month, allFuelEntries]);

  // ── Filtered vehicle list for search ──────────────────────────────────────
  const filteredVehicles = vehicles.filter((v) =>
    v.toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ══════ TOP BAR ══════ */}
      <div className={styles.topBar}>
        {/* Left – filters */}
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

        {/* Centre – title */}
        <h1 className={styles.pageTitle}>VEHICLE FUEL REPORT</h1>

        {/* Right – stats */}
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
          <div className={styles.statPill}>
            <MdCloudDownload className={styles.pillIcon} />
            <div>
              <strong>{formatBytes(dataBytes)}</strong>
              <span>Data Loaded</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ BODY ══════ */}
      <div className={styles.body}>

        {/* ── LEFT PANEL – Vehicle List ── */}
        <div className={styles.rightPanel}>
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

        {/* ── FUEL ENTRIES PANEL ── */}
        <div className={styles.leftPanel}>
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <FiDroplet /> Fuel Entries
              {loading && <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.6 }}>Loading…</span>}
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
                    <th>Date</th>
                    <th>Meter</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Amount</th>
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
                        <td>{r.date}</td>
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

        {/* ── MIDDLE PANEL – Route / GPS ── */}
        <div className={styles.midPanel}>
          <div className={styles.tableCard}>
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
                    <th>Date</th>
                    <th>Driver</th>
                    <th>Ward</th>
                    <th>Duty On</th>
                    <th>Duty Off</th>
                    <th>Work %</th>
                    <th>Portal KM</th>
                    <th>GPS KM</th>
                    <th>Meter KM</th>
                    <th>Distance</th>
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
                          <td>{r.date}</td>
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
    </div>
  );
};

export default FuelReport;
