import { increment } from "firebase/database";
import { saveData, getData } from "../../../services/dbServices";
import dayjs from "dayjs";

const ROOT = "RealtimeDbServiceDetails";

// ── Backend Function Call History ─────────────────────────────────────────────

export function trackCall() {}

export function saveRealtimeDbServiceHistory(serviceFileName, functionName) {
  try {
    const year  = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date  = dayjs().format("YYYY-MM-DD");
    const base  = `${ROOT}/History/${serviceFileName}/${functionName}`;

    saveData(`${base}/${year}/${month}/${date}`, { count: increment(1) });
    saveData(`${base}/${year}/${month}`,         { count: increment(1) });
    saveData(`${ROOT}/Summary/${serviceFileName}/${functionName}`, { count: increment(1) });
  } catch {
    // silent
  }
}

export function saveRealtimeDbServiceDataHistory(serviceFileName, functionName, data) {
  try {
    if (data === null || data === undefined) return;

    const dataSizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
    const dataSize        = parseFloat((dataSizeInBytes / 1024).toFixed(4));

    const year  = dayjs().format("YYYY");
    const month = dayjs().format("MMMM");
    const date  = dayjs().format("YYYY-MM-DD");
    const base  = `${ROOT}/History/${serviceFileName}/${functionName}`;

    saveData(`${base}/${year}/${month}/${date}`, { dataSize: increment(dataSize) });
    saveData(`${base}/${year}/${month}`,         { dataSize: increment(dataSize) });
    saveData(`${ROOT}/Summary/${serviceFileName}/${functionName}`, { dataSize: increment(dataSize) });
  } catch {
    // silent
  }
}

// ── Service File / Function Stats ─────────────────────────────────────────────

export async function getServiceFiles(filterDate) {
  try {
    const targetDate = dayjs(filterDate).format("YYYY-MM-DD");
    const year       = dayjs(filterDate).format("YYYY");
    const month      = dayjs(filterDate).format("MMMM");

    const history = await getData(`${ROOT}/History`);
    if (!history) return [];

    const result = [];

    for (const [key, value] of Object.entries(history)) {
      if (!value || typeof value !== "object") continue;
      if (/^\d{4}$/.test(key)) continue; // skip old year-keyed structure

      let totalCalls = 0;
      let totalBytes = 0;
      Object.values(value).forEach((funcData) => {
        const day = funcData?.[year]?.[month]?.[targetDate];
        if (day) {
          totalCalls += day.count    || 0;
          totalBytes += (day.dataSize || 0) * 1024;
        }
      });
      if (totalCalls > 0) result.push({ name: key, totalCalls, totalBytes });
    }

    return result.sort((a, b) => b.totalCalls - a.totalCalls);
  } catch {
    return [];
  }
}

export async function getFunctionStats(serviceFile, filterDate) {
  try {
    const targetDate = dayjs(filterDate).format("YYYY-MM-DD");
    const year       = dayjs(filterDate).format("YYYY");
    const month      = dayjs(filterDate).format("MMMM");

    const serviceData = await getData(`${ROOT}/History/${serviceFile}`);
    if (!serviceData || typeof serviceData !== "object") return [];

    return Object.entries(serviceData)
      .filter(([, v]) => typeof v === "object")
      .map(([funcName, funcData]) => {
        const day = funcData?.[year]?.[month]?.[targetDate];
        return {
          functionName: funcName,
          callCount:    day?.count    || 0,
          totalBytes:   (day?.dataSize || 0) * 1024,
        };
      })
      .filter((f) => f.callCount > 0)
      .sort((a, b) => b.callCount - a.callCount);
  } catch {
    return [];
  }
}
