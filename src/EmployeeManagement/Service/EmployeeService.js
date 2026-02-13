import axios from "axios";
import * as supabase from "../../services/supabaseServices";
import { setResponse } from "../../common/common";

const FIREBASE_URL = "https://devtest-62768-default-rtdb.firebaseio.com/Employees.json";

const fetchEmployeesFromFirebase = () => {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.get(FIREBASE_URL);

            if (!response || !response.data) {
                resolve(setResponse('fail', 'No employee data found in Firebase database', {}));
                return;
            }

            const employees = { ...response.data };
            delete employees.lastEmpId;

            if (Object.keys(employees).length === 0) {
                resolve(setResponse('success', 'No employees found in database', []));
                return;
            }

            const employeeList = Object.entries(employees).map(([firebase_id, emp]) => ({
                general_details: emp.GeneralDetails || null,
                bank_details: emp.BankDetails || null,
                address_details: emp.AddressDetails || null,
            }));

            resolve(setResponse('success', 'Employees fetched successfully', { employeeList }));

        } catch (error) {
            console.error('Error fetching employees from Firebase:', error);
            resolve(setResponse('fail', `Failed to fetch employees: ${error.message}`, {}));
        }
    });
};

export const migrateEmployeesToSupabase = () => {
    return new Promise(async (resolve) => {
        try {
            const employeesResponse = await fetchEmployeesFromFirebase();
            console.log(employeesResponse)
            if (employeesResponse.status === 'fail') {
                resolve(setResponse('fail', 'Employees data not found in Firebase...', {}));
                return;
            };

            if (!employeesResponse.data || !employeesResponse.data.employeeList || employeesResponse.data.employeeList.length === 0) {
                resolve(setResponse('fail', 'No employees to migrate', {}));
                return;
            };

            const result = await supabase.upsertByConflictKeys("Employees", employeesResponse.data.employeeList, "id");

            if (!result.success) {
                resolve(setResponse('fail', 'Error while saving data into Supabase.', result.message));
                return;
            }
            resolve(setResponse('success', `Migration completed successfully`, {}));

        } catch (error) {
            console.error("Error while migrating data into Supabase:", error.message);
            resolve(setResponse('fail', 'Error while saving data into Supabase.', error.message));
        };
    });
};

export const getEmployeesFromSupabase = () => {
    return new Promise(async (resolve) => {
        try {
            const result = await supabase.getData("Employees");

            if (!result.success) {
                resolve(setResponse('fail', 'Failed to fetch employees from Supabase', result.message));
                return;
            }

            if (!result.data || result.data.length === 0) {
                resolve(setResponse('success', 'No employees found', []));
                return;
            }

            const employeeList = result.data.map(emp => {
                const general = emp.general_details || {};

                return {
                    id: emp.id,
                    name: general.name || null,
                    empCode: general.empCode || null,
                    dateOfBirth: general.dateOfBirth || null,
                    dateOfJoining: general.dateOfJoining || null,
                    fatherName: general.fatherName || null,
                    gender: general.gender || null,
                    mobile: general.mobile || null,
                    status: general.status || null,
                    email: general.email || null
                };
            });

            resolve(setResponse('success', 'Employees fetched successfully', employeeList));

        } catch (error) {
            console.error("Error fetching employees from Supabase:", error.message);
            resolve(setResponse('fail', 'Error fetching employees from Supabase', error.message));
        }
    });
};