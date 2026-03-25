/**
 * DailyWorkReport — Cache
 *
 * Ward list  : localStorage  24h TTL   (rarely changes)
 * Past dates : localStorage  15-day TTL (static data)
 * Today      : sessionStorage 5-min TTL (stale-while-revalidate)
 */

const CACHE_PREFIX  = 'dwr_';
const WARD_TTL      = 24 * 60 * 60 * 1000;       // 24 hours
const REPORT_TTL    = 15 * 24 * 60 * 60 * 1000;  // 15 days
const TODAY_TTL     = 5  * 60 * 1000;             // 5 minutes
const WORKER_TTL    = 15 * 24 * 60 * 60 * 1000;  // 15 days (vehicle rarely changes per date)

const wardKey   = (city)           => `${CACHE_PREFIX}wards_${city.toLowerCase()}`;
const reportKey = (city, date)     => `${CACHE_PREFIX}report_${city.toLowerCase()}_${date}`;
const todayKey  = (city, date)     => `${CACHE_PREFIX}today_${city.toLowerCase()}_${date}`;
const workerKey = (wardId, date)   => `${CACHE_PREFIX}worker_${wardId}_${date}`;

// ─── Internal helpers ───────────────────────────────────────────

const read = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { data, expiry } = JSON.parse(raw);
        if (Date.now() > expiry) { localStorage.removeItem(key); return null; }
        return data;
    } catch { return null; }
};

const write = (key, data, ttl) => {
    try {
        localStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttl }));
    } catch {}
};

const sessionRead = (key) => {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const { data, expiry } = JSON.parse(raw);
        if (Date.now() > expiry) { sessionStorage.removeItem(key); return null; }
        return data;
    } catch { return null; }
};

const sessionWrite = (key, data, ttl) => {
    try {
        sessionStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttl }));
    } catch {}
};

// ─── Public API ─────────────────────────────────────────────────

export const getCachedWardList = (city)             => read(wardKey(city));
export const setCachedWardList = (city, data)       => write(wardKey(city), data, WARD_TTL);

export const getCachedReport   = (city, date)       => read(reportKey(city, date));
export const setCachedReport   = (city, date, data) => write(reportKey(city, date), data, REPORT_TTL);

export const getTodayCache     = (city, date)           => sessionRead(todayKey(city, date));
export const setTodayCache     = (city, date, data)     => sessionWrite(todayKey(city, date), data, TODAY_TTL);

export const getWorkerCache    = (wardId, date)         => read(workerKey(wardId, date));
export const setWorkerCache    = (wardId, date, data)   => write(workerKey(wardId, date), data, WORKER_TTL);

/**
 * Page mount pe call karo — expired entries automatically delete ho jaayenge.
 */
export const cleanExpiredCache = () => {
    try {
        Object.keys(localStorage)
            .filter(k => k.startsWith(CACHE_PREFIX))
            .forEach(k => {
                try {
                    const { expiry } = JSON.parse(localStorage.getItem(k));
                    if (Date.now() > expiry) localStorage.removeItem(k);
                } catch { localStorage.removeItem(k); }
            });
    } catch {}
};
