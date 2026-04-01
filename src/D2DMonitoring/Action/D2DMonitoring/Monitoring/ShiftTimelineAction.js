/**
 * ShiftTimelineAction.js
 *
 * Shift Timeline ka data manage karta hai:
 *   1. Pehle Supabase check karo (WardName + CityName + date)
 *   2. Mila → turant return karo, lekin background mein Firebase check bhi karo
 *   3. Nahi mila → Firebase se fetch karo → Supabase mein save karo → dikhao
 *
 * Background Firebase Sync (ward select hone par har baar):
 *   - Firebase se latest times fetch karo
 *   - Agar Supabase ke data se alag/zyada entries hain → upsert karo → onDataUpdate callback
 *
 * Multiple times support:
 *   DutyInTime, wardReachedOn, DutyOutTime → comma-separated store hote hain
 *   e.g. "06:00:00,07:30:00"  (2 duty cycles)
 *
 * Multiple images support:
 *   DutyOnImage, DutyOutImage → comma-separated Supabase Storage URLs
 *   e.g. "https://.../1.png,https://.../2.png"
 */

import dayjs from 'dayjs';
import { supabase } from '../../../../createClient';
import { getDownloadURLFromStorage } from '../../../../services/dbServices';
import {
    getWardDutyOnTimeFromDB,
    getWardDutyOffTimeFromDB,
    getWardReachedTimeFromDB,
} from '../../../Services/D2DMonitoringService/D2DMonitoringDutyIn';
import {
    saveRealtimeDbServiceHistory,
    saveRealtimeDbServiceDataHistory,
} from '../../../Services/DbServiceTracker/serviceTracker';

const SERVICE = 'dataSync';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABLE = 'WasteCollectionInfo';

/**
 * In-memory cache — page reload hone tak data store rehta hai.
 * Key: "{wardName}-{city}-{YYYY-MM-DD}"  (date-based → roz fresh fetch)
 * Value: Supabase row object
 */
const shiftTimelineCache = new Map();

/**
 * Background sync deduplication — ek ward ka ek baar hi background Firebase
 * check hoga per session. Page reload hone par fresh check hoga.
 * Key: same as shiftTimelineCache key
 */
const bgSyncDone = new Set();

/**
 * Firebase Storage folder → Supabase Storage folder mapping
 *
 * Firebase path  : {city}/{firebaseFolder}/{wardName}/{year}/{month}/{date}/N.png
 * Supabase bucket: {city lowercase}
 * Supabase path  : {supabaseFolder}/{wardName}/{year}/{month}/{date}/N.png
 */
const IMAGE_FOLDER_MAP = [
    { firebaseFolder: 'DutyOnImages', supabaseFolder: 'DutyInImages' }, // Duty In  images
    { firebaseFolder: 'DutyOutImages', supabaseFolder: 'DutyOutImages' }, // Duty Out images
];

// ─── Time Utilities ───────────────────────────────────────────────────────────

/**
 * Ek raw time string ko "HH:mm:ss" format mein convert karta hai.
 *
 * Supported inputs:
 *   "8:37 AM"  → "08:37:00"
 *   "14:02"    → "14:02:00"
 *   "06:00:00" → "06:00:00"
 */
const normalizeSingleTime = (val) => {
    if (!val || typeof val !== 'string') return null;

    const trimmed = val.trim();

    // Case 1: Already 24hr format — "H:mm" or "HH:mm:ss"
    const match24hr = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match24hr) {
        const hh = String(match24hr[1]).padStart(2, '0');
        return `${hh}:${match24hr[2]}:00`;
    }

    // Case 2: 12hr AM/PM format — "8:37 AM" or "08:37:00 PM"
    const match12hr = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
    if (match12hr) {
        let h = parseInt(match12hr[1], 10);
        const m = match12hr[2];
        const ampm = match12hr[3].toUpperCase();

        if (ampm === 'AM' && h === 12) h = 0;
        if (ampm === 'PM' && h !== 12) h += 12;

        return `${String(h).padStart(2, '0')}:${m}:00`;
    }

    return null;
};

/**
 * Firebase se aane wali raw time value ko Supabase ke liye
 * comma-separated "HH:mm:ss" text mein convert karta hai.
 *
 * Firebase se ye formats aa sakte hain:
 *   String  : "8:37 AM"
 *   Array   : ["8:37 AM", "9:00 AM"]
 *   Object  : { 0: "8:37 AM", 1: "9:00 AM" }
 *
 * Supabase mein store hoga: "08:37:00,09:00:00"
 */
const buildTimesText = (raw) => {
    if (!raw) return null;

    let rawValues = [];
    if (Array.isArray(raw)) rawValues = raw;
    else if (typeof raw === 'object') rawValues = Object.values(raw);
    else if (typeof raw === 'string') rawValues = raw.split(',');

    const normalized = [...new Set(
        rawValues
            .map(v => normalizeSingleTime(String(v).trim()))
            .filter(Boolean)
    )];

    return normalized.length > 0 ? normalized.join(',') : null;
};

/**
 * Supabase mein stored time text ko display ke liye format karta hai.
 *
 * Input : "08:37:00,09:00:00"  (comma-separated, multiple times)
 * Output: "08:37"              (pehli time, HH:mm format)
 */
export const formatShiftTime = (storedText) => {
    if (!storedText) return null;
    const firstEntry = storedText.split(',')[0].trim();
    return firstEntry.length >= 5 ? firstEntry.substring(0, 5) : firstEntry;
};

// ─── Change Detection ─────────────────────────────────────────────────────────

/**
 * Firebase ke naye data ko existing data se compare karta hai.
 *
 * Change detect hota hai jab:
 *   1. Firebase mein entries zyada hain (naya duty cycle aaya)
 *   2. Firebase ki value alag hai (koi time update hua)
 *
 * @returns {boolean}
 */
const hasDataChanged = (existingData, newTimes) => {
    const countEntries = (str) => (str ? str.split(',').filter(Boolean).length : 0);

    const fields = [
        { existing: existingData?.DutyInTime,    fresh: newTimes.DutyInTime },
        { existing: existingData?.DutyOutTime,   fresh: newTimes.DutyOutTime },
        { existing: existingData?.wardReachedOn, fresh: newTimes.wardReachedOn },
    ];

    return fields.some(({ existing, fresh }) => {
        if (!fresh) return false; // Firebase mein kuch nahi — no change
        if (!existing) return true; // Pehle kuch nahi tha, ab hai — change
        if (countEntries(fresh) > countEntries(existing)) return true; // Naye entries
        if (fresh !== existing) return true; // Value alag hai
        return false;
    });
};

// ─── Image Utilities ──────────────────────────────────────────────────────────

/**
 * Firebase URL se image download karke Supabase Storage mein upload karta hai.
 *
 * @param {string} firebaseUrl - Firebase Storage download URL
 * @param {string} bucket      - Supabase Storage bucket name (city lowercase)
 * @param {string} filePath    - Supabase mein file ka path
 * @returns {string|null}      - Supabase public URL ya null
 */
const uploadImageToSupabaseStorage = async (firebaseUrl, bucket, filePath) => {
    if (!firebaseUrl) return null;

    try {
        const response = await fetch(firebaseUrl);
        if (!response.ok) return null;
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, blob, {
                upsert: true,
                contentType: blob.type || 'image/png',
            });

        if (uploadError) {
            console.error('[ShiftTimeline] Image upload error:', filePath, uploadError.message);
            return null;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;

    } catch (err) {
        console.error('[ShiftTimeline] Image upload failed:', filePath, err.message);
        return null;
    }
};

/**
 * Ek duty image type (DutyIn ya DutyOut) ke liye:
 *   - Firebase se 1.png aur 2.png fetch karta hai
 *   - Supabase Storage mein upload karta hai
 *   - Comma-separated Supabase URLs return karta hai
 *
 * @returns {string|null} - "url1,url2" ya null
 */
const syncDutyImages = async ({ firebaseFolder, supabaseFolder, city, bucket, wardName, year, month, day }) => {
    const uploadedUrls = [];

    for (const imgIndex of [1, 2]) {
        const firebasePath = `${city}/${firebaseFolder}/${wardName}/${year}/${month}/${day}/${imgIndex}.png`;
        const supabasePath = `${supabaseFolder}/${wardName}/${year}/${month}/${day}/${imgIndex}.png`;

        const firebaseUrl = await getDownloadURLFromStorage(firebasePath);
        if (!firebaseUrl) continue;

        // Firebase Storage hit — track karo
        saveRealtimeDbServiceHistory(SERVICE, 'syncDutyInAndOutImages');
        saveRealtimeDbServiceDataHistory(SERVICE, 'syncDutyInAndOutImages', { firebasePath });

        const supabaseUrl = await uploadImageToSupabaseStorage(firebaseUrl, bucket, supabasePath);
        if (supabaseUrl) uploadedUrls.push(supabaseUrl);
    }

    return uploadedUrls.length > 0 ? uploadedUrls.join(',') : null;
};

// ─── Supabase Table Helpers ───────────────────────────────────────────────────

/**
 * Supabase WasteCollectionInfo table mein ward ka row check karta hai (sirf current date ka).
 *
 * @param {string} wardName
 * @param {string} city
 * @param {string} date - YYYY-MM-DD format
 * @returns {object|null} - Row mila toh return, warna null
 */
const checkInSupabase = async (wardName, city, date) => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('WardName', wardName)
        .eq('CityName', city)
        .eq('date', date)
        .maybeSingle();

    if (error) {
        console.error('[ShiftTimeline] Supabase check error:', error.message);
        return null;
    }

    return data || null;
};

// ─── Background Firebase Sync ─────────────────────────────────────────────────

/**
 * Ward select hone par background mein Firebase check karta hai.
 *
 * Flow:
 *   1. Firebase se latest times fetch karo (fast, no storage)
 *   2. Existing data se compare karo
 *   3. Kuch naya mila → images bhi sync karo → Supabase upsert → cache update → onDataUpdate callback
 *
 * Ye function kabhi bhi UI ko block nahi karta — fire-and-forget hai.
 *
 * @param {object}   existingData  - Abhi dikhaye ja rahe data (cache/Supabase se)
 * @param {Function} onDataUpdate  - Naya data milne par UI update ke liye callback
 */
const backgroundSyncFromFirebase = async ({
    wardName, city, year, month, day, bucket, cacheKey, existingData, onDataUpdate,
}) => {
    try {
        console.log('[ShiftTimeline] Background sync: Firebase check start —', wardName);

        // Firebase Realtime DB hit — track karo
        saveRealtimeDbServiceHistory(SERVICE, 'backgroundFirebaseSync');
        saveRealtimeDbServiceDataHistory(SERVICE, 'backgroundFirebaseSync', { wardName, city, day });

        const [dutyInResp, dutyOutResp, reachedResp] = await Promise.all([
            getWardDutyOnTimeFromDB(year, month, day, wardName),
            getWardDutyOffTimeFromDB(year, month, day, wardName),
            getWardReachedTimeFromDB(year, month, day, wardName),
        ]);

        const freshTimes = {
            DutyInTime:    buildTimesText(dutyInResp?.status  === 'Success' ? dutyInResp.data  : null),
            wardReachedOn: buildTimesText(reachedResp?.status === 'Success' ? reachedResp.data : null),
            DutyOutTime:   buildTimesText(dutyOutResp?.status === 'Success' ? dutyOutResp.data : null),
        };

        // Koi change nahi → kuch nahi karna
        if (!hasDataChanged(existingData, freshTimes)) {
            console.log('[ShiftTimeline] Background sync: no changes detected —', wardName);
            return;
        }

        console.log('[ShiftTimeline] Background sync: change detected, syncing images + saving —', wardName);

        // Images bhi sync karo (naye duty cycle ki images bhi aa sakti hain)
        const imageArgs = { city, bucket, wardName, year, month, day };
        const [dutyInImagesText, dutyOutImagesText] = await Promise.all([
            syncDutyImages({ ...imageArgs, ...IMAGE_FOLDER_MAP[0] }),
            syncDutyImages({ ...imageArgs, ...IMAGE_FOLDER_MAP[1] }),
        ]);

        // Naya payload — existing se merge karo taaki purana data na jaaye
        const updatedPayload = {
            WardName:    wardName,
            CityName:    city,
            date:        day,
            DutyInTime:    freshTimes.DutyInTime    || existingData?.DutyInTime    || null,
            wardReachedOn: freshTimes.wardReachedOn || existingData?.wardReachedOn || null,
            DutyOutTime:   freshTimes.DutyOutTime   || existingData?.DutyOutTime   || null,
            DutyOnImage:   dutyInImagesText         || existingData?.DutyOnImage   || null,
            DutyOutImage:  dutyOutImagesText        || existingData?.DutyOutImage  || null,
        };

        // Supabase upsert — row hai toh update, nahi hai toh insert
        const { data: saved, error } = await supabase
            .from(TABLE)
            .upsert(updatedPayload, { onConflict: 'WardName,CityName,date' })
            .select()
            .maybeSingle();

        if (error) {
            console.error('[ShiftTimeline] Background sync upsert error:', error.message);
            return;
        }

        const finalData = saved || updatedPayload;
        shiftTimelineCache.set(cacheKey, finalData);

        console.log('[ShiftTimeline] Background sync: Supabase updated successfully —', wardName);

        // UI ko update karo
        if (onDataUpdate) {
            onDataUpdate(finalData);
        }

    } catch (err) {
        console.error('[ShiftTimeline] Background sync failed:', err.message);
    }
};

// ─── Initial Firebase Fetch (fresh — no Supabase data) ────────────────────────

/**
 * Firebase se data fetch karke Supabase mein save karta hai.
 *
 * Two-phase approach:
 *   Phase 1 (fast) → Times fetch karke turant return karo (UI instantly update ho)
 *   Phase 2 (background) → Images sync + Supabase save (non-blocking)
 *
 * @param {string}   cacheKey      - Memory cache update ke liye
 * @param {Function} onDataUpdate  - Images ready hone ya save complete hone par UI callback
 * @returns {object|null} - Partial data (times only) ya null
 */
const fetchFromFirebaseAndSave = async ({ wardName, city, year, month, day, bucket, cacheKey, onDataUpdate }) => {
    const imageArgs = { city, bucket, wardName, year, month, day };

    // Firebase Realtime DB hit — track karo
    saveRealtimeDbServiceHistory(SERVICE, 'SyncDutyInTimeAndOutTimeData');
    saveRealtimeDbServiceDataHistory(SERVICE, 'SyncDutyInTimeAndOutTimeData', { wardName, city, day });

    // ── Phase 1: Times only — fast (Realtime DB, no storage calls) ──────────
    const [dutyInResp, dutyOutResp, reachedResp] = await Promise.all([
        getWardDutyOnTimeFromDB(year, month, day, wardName),
        getWardDutyOffTimeFromDB(year, month, day, wardName),
        getWardReachedTimeFromDB(year, month, day, wardName),
    ]);

    const dutyInTime    = buildTimesText(dutyInResp?.status  === 'Success' ? dutyInResp.data  : null);
    const wardReachedOn = buildTimesText(reachedResp?.status === 'Success' ? reachedResp.data : null);
    const dutyOutTime   = buildTimesText(dutyOutResp?.status === 'Success' ? dutyOutResp.data : null);

    // Koi time data nahi mila — save skip karo
    if (!dutyInTime && !wardReachedOn && !dutyOutTime) {
        console.log('[ShiftTimeline] Firebase se koi data nahi mila — Supabase save skip');
        return null;
    }

    const partialData = {
        WardName: wardName,
        CityName: city,
        date: day,
        DutyInTime: dutyInTime,
        wardReachedOn,
        DutyOutTime: dutyOutTime,
        DutyOnImage: null,
        DutyOutImage: null,
    };

    // ── Phase 2: Images + Supabase save — background mein (non-blocking) ────
    (async () => {
        const [dutyInImagesText, dutyOutImagesText] = await Promise.all([
            syncDutyImages({ ...imageArgs, ...IMAGE_FOLDER_MAP[0] }),
            syncDutyImages({ ...imageArgs, ...IMAGE_FOLDER_MAP[1] }),
        ]);

        const payload = {
            ...partialData,
            DutyOnImage:  dutyInImagesText  || null,
            DutyOutImage: dutyOutImagesText || null,
        };

        const { data: saved, error } = await supabase
            .from(TABLE)
            .upsert(payload, { onConflict: 'WardName,CityName,date' })
            .select()
            .maybeSingle();

        if (error) {
            console.error('[ShiftTimeline] Supabase save error:', error.message, '| code:', error.code);
            return;
        }

        console.log('[ShiftTimeline] Saved to Supabase successfully (with images)');

        // Cache update karo with full data (images included)
        if (cacheKey) shiftTimelineCache.set(cacheKey, saved || payload);

        // UI callback — images ya full data ready hai
        if (onDataUpdate && (dutyInImagesText || dutyOutImagesText)) {
            onDataUpdate(saved || payload);
        }
    })();

    // Times turant return — UI block nahi hogi images ke liye
    return partialData;
};

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Shift Timeline ka main action function.
 *
 * Flow:
 *   Step 1 → Memory cache check (instant return)
 *   Step 2 → Supabase check (return if found)
 *   Step 3 → Firebase fresh fetch (Supabase mein nahi tha)
 *
 *   Steps 1 & 2 ke baad bhi background mein Firebase check hota hai:
 *   → Naya data mila toh Supabase upsert + onDataUpdate callback
 *
 * @param {object}   ward          - { id: "1" } (WardCityMap ward)
 * @param {string}   city          - City name, e.g. "Sikar"
 * @param {Function} onDataUpdate  - Koi bhi update milne par UI refresh ke liye callback
 *                                   Called with: (updatedRowData) → set state with this
 * @returns {object|null} - Current data (cache/Supabase/Firebase se)
 */
export const getOrFetchShiftTimeline = async (ward, city, onDataUpdate) => {
    if (!ward?.id || !city) return null;

    const wardName = String(ward.id);
    const year     = dayjs().format('YYYY');
    const month    = dayjs().format('MMMM');
    const day      = dayjs().format('YYYY-MM-DD');
    const bucket   = city.toLowerCase().trim();
    const cacheKey = `${wardName}-${city}-${day}`;

    const bgSyncArgs = { wardName, city, year, month, day, bucket, cacheKey, onDataUpdate };

    // Step 1: Memory cache — instant, zero network calls
    if (shiftTimelineCache.has(cacheKey)) {
        const cachedData = shiftTimelineCache.get(cacheKey);
        console.log('[ShiftTimeline] Serving from memory cache —', wardName);

        // Background: sirf ek baar per session per ward Firebase check karo
        if (!bgSyncDone.has(cacheKey)) {
            bgSyncDone.add(cacheKey);
            backgroundSyncFromFirebase({ ...bgSyncArgs, existingData: cachedData }).catch(() => {});
        }

        return cachedData;
    }

    // Step 2: Supabase check — sirf current date ka data
    const supabaseData = await checkInSupabase(wardName, city, day);
    if (supabaseData) {
        shiftTimelineCache.set(cacheKey, supabaseData);
        console.log('[ShiftTimeline] Data found in Supabase — caching in memory —', wardName);

        // Background: sirf ek baar per session per ward Firebase check karo
        if (!bgSyncDone.has(cacheKey)) {
            bgSyncDone.add(cacheKey);
            backgroundSyncFromFirebase({ ...bgSyncArgs, existingData: supabaseData }).catch(() => {});
        }

        return supabaseData;
    }

    // Step 3: Supabase mein kuch nahi — Firebase se fresh fetch karo
    console.log('[ShiftTimeline] Data not in Supabase — fetching from Firebase —', wardName);
    const freshData = await fetchFromFirebaseAndSave({ wardName, city, year, month, day, bucket, cacheKey, onDataUpdate });

    if (freshData) {
        shiftTimelineCache.set(cacheKey, freshData);
    }

    return freshData;
};
