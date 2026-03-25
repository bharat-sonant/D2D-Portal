import { increment } from "firebase/database";
import { saveData, getData } from "../../../services/dbServices";
import dayjs from "dayjs";

const ROOT = "RealtimeDbServiceDetails";
export function trackCall() { }

export function saveRealtimeDbServiceHistory(serviceFileName, functionName) {
  try {
    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");
    const base = `${ROOT}/History/${serviceFileName}/${functionName}`;

    saveData(`${base}/${year}/${month}/${date}`, { count: increment(1) });
    saveData(`${base}/${year}/${month}`, { count: increment(1) });
    saveData(`${ROOT}/Summary/${serviceFileName}/${functionName}`, { count: increment(1) });
  } catch (err) {
    console.log("Error while saving db service in db", err);
  }
}

export function saveRealtimeDbServiceDataHistory(serviceFileName, functionName, data) {
  try {
    if (data === null || data === undefined) return;

    const dataSizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
    const dataSize = parseFloat((dataSizeInBytes / 1024).toFixed(4));

    const year = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date = dayjs().format("YYYY-MM-DD");
    const base = `${ROOT}/History/${serviceFileName}/${functionName}`;

    saveData(`${base}/${year}/${month}/${date}`, { dataSize: increment(dataSize) });
    saveData(`${base}/${year}/${month}`, { dataSize: increment(dataSize) });
    saveData(`${ROOT}/Summary/${serviceFileName}/${functionName}`, { dataSize: increment(dataSize) });
  } catch (err) {
    console.log("Error while saving db service in db", err);

  }
}

// ── Read Stats (year + month as strings, e.g. "2026" + "March") ──────────────

// Panel 1: all service files for a given month
export async function getServiceFiles(year, month) {
  try {
    const history = await getData(`${ROOT}/History`);
    if (!history) return [];

    const result = [];
    for (const [sfName, sfData] of Object.entries(history)) {
      if (!sfData || typeof sfData !== "object") continue;
      if (/^\d{4}$/.test(sfName)) continue; // skip old year-keyed structure

      let totalCalls = 0;
      let totalBytes = 0;
      for (const funcData of Object.values(sfData)) {
        if (typeof funcData !== "object") continue;
        const m = funcData?.[year]?.[month];
        if (m) {
          totalCalls += m.count || 0;
          totalBytes += (m.dataSize || 0) * 1024; // KB → bytes
        }
      }
      if (totalCalls > 0) result.push({ name: sfName, totalCalls, totalBytes });
    }
    return result.sort((a, b) => b.totalBytes - a.totalBytes);
  } catch {
    return [];
  }
}

// Panel 2: all functions inside a service for a given month
export async function getFunctionStats(serviceFile, year, month) {
  try {
    const sfData = await getData(`${ROOT}/History/${serviceFile}`);
    if (!sfData || typeof sfData !== "object") return [];

    return Object.entries(sfData)
      .filter(([, v]) => typeof v === "object")
      .map(([funcName, funcData]) => {
        const m = funcData?.[year]?.[month];
        return {
          functionName: funcName,
          callCount: m?.count || 0,
          totalBytes: (m?.dataSize || 0) * 1024,
        };
      })
      .filter((f) => f.callCount > 0)
      .sort((a, b) => b.totalBytes - a.totalBytes);
  } catch {
    return [];
  }
}

// Panel 3: per-date breakdown for one function in a given month
export async function getDateBreakdown(serviceFile, funcName, year, month) {
  try {
    const monthData = await getData(`${ROOT}/History/${serviceFile}/${funcName}/${year}/${month}`);
    if (!monthData || typeof monthData !== "object") return [];

    return Object.entries(monthData)
      .filter(([k, v]) => /^\d{4}-\d{2}-\d{2}$/.test(k) && typeof v === "object")
      .map(([date, info]) => ({
        date,
        count: info.count || 0,
        bytes: (info.dataSize || 0) * 1024,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}
