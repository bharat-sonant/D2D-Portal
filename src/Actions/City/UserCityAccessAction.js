import * as common from "../../common/common";
import * as service from "../../services/UserCityAccessService/UserCityAccessService";

/* =========================================================
   FETCH USERS BY SELECTED CITY
========================================================= */
export const getUsersByCity = async (
  cityId,
  setUserList,
  setLoading
) => {
  if (!cityId) {
    setUserList([]);
    return;
  }

  if (setLoading) setLoading(true);

  try {
    const resp = await service.getUsersByCity(cityId);

    if (resp.status === "success") {
      // Optional: format users if required by UI
      const users = resp.data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        empCode: u.empCode,
        status: u.status,
        userType: u.userType,
      }));

      setUserList(users);
    } else {
      setUserList([]);
      common.setAlertMessage("warn", resp.message || "Failed to fetch users");
    }
  } catch (err) {
    console.error("Error fetching users by city:", err);
    setUserList([]);
    common.setAlertMessage("warn", "Exception occurred while fetching users!");
  }

  if (setLoading) setLoading(false);
};
