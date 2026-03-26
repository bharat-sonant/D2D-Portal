import CryptoJS from "crypto-js";

const KEY = process.env.REACT_APP_CACHE_SECRET || "d2d_default_key";

// Key ko hash karo — DevTools mein ward name/city visible na ho
const hashKey = (key) => CryptoJS.MD5(key).toString();

const encrypt = (data) => {
    try { return CryptoJS.AES.encrypt(JSON.stringify(data), KEY).toString(); }
    catch { return null; }
};

const decrypt = (cipher) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipher, KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch { return null; }
};

// ─── sessionStorage (tab-level) ───────────────────────────────────────────────

export const ssSet = (key, data) => {
    try {
        const encrypted = encrypt(data);
        if (encrypted) sessionStorage.setItem(hashKey(key), encrypted);
    } catch { /* quota */ }
};

export const ssGet = (key) => {
    try {
        const cipher = sessionStorage.getItem(hashKey(key));
        return cipher ? decrypt(cipher) : null;
    } catch { return null; }
};

// ─── localStorage with TTL (persistent across tab close/reopen) ───────────────
// Poora entry encrypt hota hai — key bhi hashed, value bhi opaque

export const lsSet = (key, data, ttlDays = 7) => {
    try {
        const entry = { d: data, exp: Date.now() + ttlDays * 86400000 };
        const encrypted = encrypt(entry);
        if (encrypted) localStorage.setItem(hashKey(key), encrypted);
    } catch { /* quota */ }
};

export const lsGet = (key) => {
    try {
        const hk = hashKey(key);
        const cipher = localStorage.getItem(hk);
        if (!cipher) return null;
        const entry = decrypt(cipher);
        if (!entry?.exp) return null;
        if (Date.now() > entry.exp) {
            localStorage.removeItem(hk);
            return null;
        }
        return entry.d;
    } catch { return null; }
};
