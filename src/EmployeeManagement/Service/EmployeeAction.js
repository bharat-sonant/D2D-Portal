
import { getEmployeesFromSupabase } from "./EmployeeService";

export const getEmployeeListAction = async (setEmployees, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        const response = await getEmployeesFromSupabase();
        if (response.status === 'success') {
            console.log(response,"asd")
            setEmployees(response.data);
        } else {
            console.error("Error fetching employees:", response.message);
        }
    } catch (error) {
        console.error("Exception in getEmployeeListAction:", error);
    } finally {
        if (setLoading) setLoading(false);
    }
};
