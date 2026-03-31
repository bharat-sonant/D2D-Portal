/**
 * DailyWorkReport — Cache
 *
 * Ward list  : in-memory only  (derived from local WardCityMap — no network call needed)
 * Past dates : localStorage   7d   TTL  (static data)
 * Today      : sessionStorage 30m  TTL  (stale-while-revalidate supported)
 */

const PREFIX      = 'dwr_';
const REPORT_TTL  = 7  * 24 * 60 * 60 * 1000;  // 7 days
const TODAY_TTL   = 30 * 60 * 1000;             // 30 minutes

const reportKey = (city, date) => `${PREFIX}report_${city.toLowerCase()}_${date}`;
const todayKey  = (city, date) => `${PREFIX}today_${city.toLowerCase()}_${date}`;

// ─── In-memory ward list cache (no localStorage — data is from local JSON) ──
const _wardCache = new Map();

// ─── Helpers ─────────────────────────────────────────────────────

const lsRead = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { data, expiry } = JSON.parse(raw);
        if (Date.now() > expiry) { localStorage.removeItem(key); return null; }
        return data;
    } catch { return null; }
};

const lsWrite = (key, data, ttl) => {
    try {
        localStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttl }));
    } catch {}
};

// allowStale: expired hone ke baad bhi data return karo (SWR ke liye)
const ssRead = (key, allowStale = false) => {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const { data, expiry } = JSON.parse(raw);
        if (Date.now() > expiry) {
            if (!allowStale) { sessionStorage.removeItem(key); return null; }
            return data;
        }
        return data;
    } catch { return null; }
};

const ssWrite = (key, data, ttl) => {
    try {
        sessionStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttl }));
    } catch {}
};

// ─── Public API ──────────────────────────────────────────────────

export const getCachedWardList = (city) => _wardCache.get(city.toLowerCase()) ?? null;
export const setCachedWardList = (city, data) => { _wardCache.set(city.toLowerCase(), data); };

const MAX_REPORT_DATES = 7; // sirf last 7 dates store karo

export const getCachedReport = (city, date) => lsRead(reportKey(city, date));

export const setCachedReport = (city, date, data) => {
    lsWrite(reportKey(city, date), data, REPORT_TTL);

    // Agar 7 se zyada dates cached hain to oldest delete karo
    try {
        const prefix = `${PREFIX}report_${city.toLowerCase()}_`;
        const allKeys = Object.keys(localStorage).filter(k => k.startsWith(prefix));

        if (allKeys.length > MAX_REPORT_DATES) {
            // Har key ka date nikalo aur sort karo (oldest first)
            const sorted = allKeys
                .map(k => ({ key: k, date: k.replace(prefix, '') }))
                .sort((a, b) => a.date.localeCompare(b.date));

            // 7 se zyada hain to purane wale delete karo
            sorted.slice(0, sorted.length - MAX_REPORT_DATES)
                  .forEach(({ key }) => localStorage.removeItem(key));
        }
    } catch {}
};

export const getTodayCache        = (city, date)       => ssRead(todayKey(city, date));
export const getStaleTodayCache   = (city, date)       => ssRead(todayKey(city, date), true);
export const setTodayCache        = (city, date, data) => ssWrite(todayKey(city, date), data, TODAY_TTL);

export const cleanExpiredCache = () => {
    const WARD_KEY_PREFIX = `${PREFIX}wards_`;
    const clean = (storage) => {
        try {
            Object.keys(storage)
                .filter(k => k.startsWith(PREFIX))
                .forEach(k => {
                    try {
                        // Remove legacy dwr_wards_* entries (now in-memory only)
                        if (k.startsWith(WARD_KEY_PREFIX)) { storage.removeItem(k); return; }
                        const { expiry } = JSON.parse(storage.getItem(k));
                        if (Date.now() > expiry) storage.removeItem(k);
                    } catch { storage.removeItem(k); }
                });
        } catch {}
    };
    clean(localStorage);
    clean(sessionStorage);
};
