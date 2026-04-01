import * as sbs from "../supabaseServices";
import { getData } from "../dbServices";
import { saveRealtimeDbServiceHistory, saveRealtimeDbServiceDataHistory } from "../../D2DMonitoring/Services/DbServiceTracker/serviceTracker";

const FILE = 'dataSync';

/**
 * Fetch all employees from Supabase
 */
export const getEmployees = async () => {
    const result = await sbs.getData('Employees');
    if (result.success) {
        // Sort by employee_name alphabetically
        const sortedData = [...result.data].sort((a, b) =>
            (a.employee_name || "").localeCompare(b.employee_name || "")
        );
        return { status: 'success', message: 'Employee data fetched successfully', data: sortedData };
    } else {
        return { status: 'error', message: result.error };
    }
};

export const saveEmployee = async (employeeData) => {
    // Add created_at if it's a new record, and ensure status is present
    const dataToSave = {
        ...employeeData,
        status: employeeData.status ?? true,
        created_at: employeeData.created_at || new Date().toISOString()
    };

    // Using upsert by employee_code as it's the primary/unique key according to schema
    const result = await sbs.upsertByConflictKeys('Employees', dataToSave, 'employee_code');
    if (result.success) {
        return { status: 'success', message: 'Employee saved successfully', data: result.data };
    } else {
        return { status: 'error', message: result.message || 'Failed to save employee' };
    }
};

/**
 * Delete an employee by Employee Code
 */
/**
 * Delete an employee by id
 */
export const deleteEmployee = async (id) => {
    // Using the common deleteData which uses the 'id' column
    const result = await sbs.deleteData('Employees', id);
    if (result.success) {
        return { status: 'success', message: 'Employee deleted successfully' };
    } else {
        return { status: 'error', message: result.error };
    }
};

const uploadImageFromFirebase = async (employeeId, cityName) => {
    const firebaseUrl = await getData(`Employees/${employeeId}/GeneralDetails/profilePhotoURL`);
    saveRealtimeDbServiceHistory(FILE, 'uploadImageSupabaseFromFirebase');
    saveRealtimeDbServiceDataHistory(FILE, 'uploadImageSupabaseFromFirebase', firebaseUrl);
    if (!firebaseUrl) return null;
    let blob;
    try {
        const res = await fetch(firebaseUrl);
        if (!res.ok) return null;
        blob = await res.blob();
    } catch { return null; }
    const file = new File([blob], 'profileImage.jpg', { type: 'image/jpeg' });
    const result = await sbs.uploadEmployeeProfileImage(file, cityName, employeeId);
    return result.success ? result.url : null;
};

export const syncEmployeeProfileImage = async (employeeId, cityName) => {
    if (!employeeId || !cityName) return { url: null };
    const { exists, url: existingUrl } = await sbs.checkEmployeeImageExists(cityName, employeeId);
    if (exists) return { url: existingUrl };
    const url = await uploadImageFromFirebase(employeeId, cityName);
    return { url };
};

/**
 * Batch version of syncMonitoringEmployee.
 * One Supabase query for all IDs → missing ones fall back to Firebase individually.
 * Returns an object: { [employeeId]: { name, mobile, dummyFlag, photo } }
 */
/**
 * @param {string[]} employeeIds
 * @param {string}   cityName
 * @param {Function} onPhotoReady - (employeeId, photoUrl) → called when bg photo sync completes
 */
export const syncMonitoringEmployeesBatch = async (employeeIds, cityName, onPhotoReady) => {
    if (!employeeIds?.length) return {};

    // Step 1: single batch query — 1 round-trip instead of N
    const foundMap = await sbs.getMonitoringEmployeesBatch(employeeIds);

    const result = {};
    const missing = [];

    for (const id of employeeIds) {
        const row = foundMap.get(String(Number(id)));
        if (row) {
            const photo = row.profilePhotoUrl || null;

            // Supabase mein hai but photo nahi → background sync
            if (!photo && cityName && onPhotoReady) {
                (async () => {
                    const { url: photoUrl } = await syncEmployeeProfileImage(id, cityName);
                    if (!photoUrl) return;
                    await sbs.upsertMonitoringEmployee(id, { profilePhotoUrl: photoUrl });
                    onPhotoReady(id, photoUrl);
                })();
            }

            result[String(id)] = {
                name:      row.Name            || null,
                mobile:    row.Mobile != null  ? String(row.Mobile) : null,
                dummyFlag: row.isDummyId       ?? null,
                photo,
            };
        } else {
            missing.push(id);
        }
    }

    // Step 2: individually sync truly missing employees (Firebase → Supabase)
    if (missing.length) {
        await Promise.all(missing.map(async (id) => {
            result[String(id)] = await syncMonitoringEmployee(id, cityName, onPhotoReady);
        }));
    }

    return result;
};

/**
 * @param {string}   employeeId
 * @param {string}   cityName
 * @param {Function} onPhotoReady - (employeeId, photoUrl) → called when bg photo sync completes
 */
export const syncMonitoringEmployee = async (employeeId, cityName, onPhotoReady) => {
    if (!employeeId) return { name: null, mobile: null, dummyFlag: null, photo: null };

    const { success, data: existing } = await sbs.getMonitoringEmployee(employeeId);
    if (success && existing) {
        const photo = existing.profilePhotoUrl || null;

        // Photo nahi hai Supabase mein → background mein sync karo
        if (!photo && cityName && onPhotoReady) {
            (async () => {
                const { url: photoUrl } = await syncEmployeeProfileImage(employeeId, cityName);
                if (!photoUrl) return;
                await sbs.upsertMonitoringEmployee(employeeId, { profilePhotoUrl: photoUrl });
                onPhotoReady(employeeId, photoUrl);
            })();
        }

        return {
            name:      existing.Name            || null,
            mobile:    existing.Mobile != null  ? String(existing.Mobile) : null,
            dummyFlag: existing.isDummyId       ?? null,
            photo,
        };
    }

    // ── Phase 1: name/mobile/dummyFlag only — fast (Realtime DB) ────────────
    const [name, mobile, dummyFlag] = await Promise.all([
        getData(`Employees/${employeeId}/GeneralDetails/name`),
        getData(`Employees/${employeeId}/GeneralDetails/mobile`),
        getData(`EmployeeDetailData/${employeeId}/isDummyId`),
    ]);

    saveRealtimeDbServiceHistory(FILE, 'syncMonitoringEmployee');
    saveRealtimeDbServiceDataHistory(FILE, 'syncMonitoringEmployee', { name, mobile, dummyFlag });

    // Supabase mein save karo (photo baad mein aayega)
    await sbs.upsertMonitoringEmployee(employeeId, {
        Name:            name      || null,
        Mobile:          mobile    != null ? Number(mobile)    : null,
        isDummyId:       dummyFlag != null ? Number(dummyFlag) : null,
        profilePhotoUrl: null,
        CityName:        cityName  || null,
    });

    // ── Phase 2: Photo background mein sync karo (non-blocking) ─────────────
    if (cityName) {
        (async () => {
            const { url: photoUrl } = await syncEmployeeProfileImage(employeeId, cityName);
            if (!photoUrl) return;
            await sbs.upsertMonitoringEmployee(employeeId, { profilePhotoUrl: photoUrl });
            if (onPhotoReady) onPhotoReady(employeeId, photoUrl);
        })();
    }

    return {
        name:      name      || null,
        mobile:    mobile    != null ? String(mobile) : null,
        dummyFlag: dummyFlag ?? null,
        photo:     null, // background mein aayega
    };
};

/**
 * Fetch branches for dropdown
 */
export const getBranches = async () => {
    const result = await sbs.getData('Branches');
    if (result.success) {
        const sortedData = [...result.data].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
        );
        return { status: 'success', message: 'Branches fetched successfully', data: sortedData };
    } else {
        // Fallback or error
        return { status: 'error', message: result.error };
    }
};
