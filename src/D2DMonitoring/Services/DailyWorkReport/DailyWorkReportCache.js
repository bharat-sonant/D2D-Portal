/**
 * DailyWorkReport — localStorage Cache
 *
 * Ward list  : 24h TTL   (rarely changes)
 * Past dates : 15-day TTL (static data)
 * Today      : NO cache  (always realtime)
 */

const CACHE_PREFIX = 'dwr_';
const WARD_TTL     = 24 * 60 * 60 * 1000;       // 24 hours
const REPORT_TTL   = 15 * 24 * 60 * 60 * 1000;  // 15 days

const wardKey   = (city)       => `${CACHE_PREFIX}wards_${city.toLowerCase()}`;
const reportKey = (city, date) => `${CACHE_PREFIX}report_${city.toLowerCase()}_${date}`;

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

// ─── Public API ─────────────────────────────────────────────────

export const getCachedWardList = (city)            => read(wardKey(city));
export const setCachedWardList = (city, data)      => write(wardKey(city), data, WARD_TTL);

export const getCachedReport   = (city, date)      => read(reportKey(city, date));
export const setCachedReport   = (city, date, data) => write(reportKey(city, date), data, REPORT_TTL);

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
