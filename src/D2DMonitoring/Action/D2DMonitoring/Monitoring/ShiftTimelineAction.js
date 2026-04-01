/**
 * ShiftTimelineAction.js
 *
 * Shift Timeline ka data manage karta hai:
 *   1. Pehle Supabase check karo (WardName + CityName)
 *   2. Mila → Supabase se hi dikhao (Firebase call nahi)
 *   3. Nahi mila → Firebase se fetch karo → Supabase table + Storage mein save karo → dikhao
 *
 * Multiple times support:
 *   DutyInTime, wardReachedOn, DutyOutTime → comma-separated store hote hain
 *   e.g. "06:00:00,07:00:00"
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

/**
 * Firebase se data fetch karke Supabase mein save karta hai.
 *
 * Two-phase approach:
 *   Phase 1 (fast) → Times fetch karke turant return karo (UI instantly update ho)
 *   Phase 2 (background) → Images sync + Supabase save (non-blocking)
 *
 * @param {string}   cacheKey      - Memory cache update ke liye
 * @param {Function} onImagesReady - Images ready hone par UI callback
 * @returns {object|null} - Partial data (times only) ya null
 */
const fetchFromFirebaseAndSave = async ({ wardName, city, year, month, day, bucket, cacheKey, onImagesReady }) => {
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
            .insert(payload)
            .select()
            .maybeSingle();

        if (error) {
            console.error('[ShiftTimeline] Supabase save error:', error.message, '| code:', error.code);
            return;
        }

        console.log('[ShiftTimeline] Saved to Supabase successfully (with images)');

        // Cache update karo with full data (images included)
        if (cacheKey) shiftTimelineCache.set(cacheKey, saved || payload);

        // UI callback — images ready hain
        if (onImagesReady && (dutyInImagesText || dutyOutImagesText)) {
            onImagesReady({
                DutyOnImage:  dutyInImagesText  || null,
                DutyOutImage: dutyOutImagesText || null,
            });
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
 *   Step 1 → Memory cache check (instant)
 *   Step 2 → Supabase check (WardName + CityName + date)
 *   Step 3 → Firebase: times turant return, images background mein sync
 *
 * @param {object}   ward          - { id: "1" } (WardCityMap ward)
 * @param {string}   city          - City name, e.g. "Sikar"
 * @param {Function} onImagesReady - ({ DutyOnImage, DutyOutImage }) → called when bg images sync completes
 * @returns {object|null} - Supabase row data (ya partial Firebase data)
 */
export const getOrFetchShiftTimeline = async (ward, city, onImagesReady) => {
    if (!ward?.id || !city) return null;

    const wardName = String(ward.id);
    const year = dayjs().format('YYYY');
    const month = dayjs().format('MMMM');
    const day = dayjs().format('YYYY-MM-DD');
    const bucket = city.toLowerCase().trim();
    const cacheKey = `${wardName}-${city}-${day}`;

    // Step 1: Memory cache — instant, zero network calls
    if (shiftTimelineCache.has(cacheKey)) {
        console.log('[ShiftTimeline] Serving from memory cache');
        return shiftTimelineCache.get(cacheKey);
    }

    // Step 2: Supabase check — sirf current date ka data
    const supabaseData = await checkInSupabase(wardName, city, day);
    if (supabaseData) {
        shiftTimelineCache.set(cacheKey, supabaseData);
        console.log('[ShiftTimeline] Data found in Supabase — caching in memory');
        return supabaseData;
    }

    // Step 3: Firebase times turant return, images background mein
    console.log('[ShiftTimeline] Data not in Supabase — fetching from Firebase');
    const freshData = await fetchFromFirebaseAndSave({ wardName, city, year, month, day, bucket, cacheKey, onImagesReady });

    if (freshData) {
        shiftTimelineCache.set(cacheKey, freshData);
    }

    return freshData;
};
