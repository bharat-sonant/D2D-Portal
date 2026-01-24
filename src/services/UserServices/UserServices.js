import * as sbs from "../supabaseServices";
import axios from "axios";

export const saveUserData = async (userDetail) => {
  const result = await sbs.saveData('Users', userDetail);
  if (result?.success) {
    return { status: 'success', message: 'User saved successfully', data: result?.data };
  } else {
    return { status: 'error', message: result?.error };
  }
};

export const updateUserData = async (userId, userDetail) => {
  const result = await sbs.updateData('Users', 'id', userId, userDetail);
  if (result.success) {
    return { status: 'success', message: 'User data updated successfully', data: result.data };
  } else {
    return { status: 'error', message: result.error, error: result?.err };
  }
}


export const getUserData = async () => {
  const result = await sbs.getData('Users');
  if (result.success) {
    const sortedData = [...result.data].sort((a, b) => a.name.localeCompare(b.name));
    return { status: 'success', message: 'User data fetched successfully', data: sortedData };
  } else {
    return { status: 'error', message: result.error };
  }
}

export const updateUserStatus = async (userId, userDetail) => {
  const result = await sbs.updateData('Users', 'id', userId, userDetail);
  if (result.success) {
    return { status: 'success', message: 'User status updated successfully', data: result.data };
  } else {
    return { status: 'error', message: result.error };
  }
}

export const getCities = async () => {
  const result = await sbs.getData('Cities');
  if (result.success) {
    const activeCities = result.data.filter(
      city => city.status === 'active'
    );

    const sortedData = activeCities.sort((a, b) =>
      a.city_name.localeCompare(b.city_name)
    );

    return { status: 'success', message: 'City data fetched successfully', data: sortedData };
  } else {
    return { status: 'error', message: result.error };
  };
};


export const saveUserCityAccess = async (payload) => {
  try {
    const response = await axios.post('http://localhost:3001/site-assignment/create',payload);
    return {status: 'success',message: response.data?.message || 'Site assigned successfully',data: response.data?.data,};
  } catch (error) {
      if(error.response) {
      return {status: 'error',message:error.response.data?.message ||'Request failed',errors: error.response.data,statusCode: error.response.status};
    }
    return {
      status: 'error',
      message: 'Network error or server not reachable',
    };
  }
};

export const fetchUserCityAccess = async (userId) => {
  const result = await sbs.getDataByColumnName('UserCityAccess', 'user_id', userId);
  if (result?.success) {
    return { status: 'success', message: 'User saved successfully', data: result?.data };
  } else {
    return { status: 'error', message: result?.error };
  };
};

export const removeCityAccess = async (userId) => {
 
  const result = await sbs.deleteData("UserCityAccess", userId);
}
export const setUserDefaultCity = (userId, cityId) => {
  return new Promise(async (resolve, reject) => {
    if (!userId && cityId) {
      return reject('Invalid parameters');
    }
    const result = await sbs.updateData('Users', 'id', userId, { default_city: cityId });
    if (result.success) {
      return resolve({ status: 'success', message: 'Default city updated successfully.', data: result.data });
    } else {
      return reject({ status: 'error', message: result.error, error: result?.err });
    }
  });
}

export const savePagesPermission = (permissionDetail) => {
  return new Promise(async (resolve, reject) => {
    if (!permissionDetail) {
      return reject('Invalid parameters');
    }
    const result = await sbs.upsertByConflictKeys('UserPortalAccess', permissionDetail, "user_id,access_page");
    if (result.success) {
      return resolve ({ status: 'success', message: 'User permission updated successfully.', data:{} });
    } else {
      return reject({status: 'error', message: result.error, error: result?.err});
    }
  });
}

export const getUserPagesPermissions = async (userId) => {

  return new Promise(async (resolve, reject) => {
    if (!userId) {
      return reject('Invalid parameters');
    }
    const response = await sbs.getDataByColumnName('UserPortalAccess', 'user_id', userId)
    if (response.success) {
      const mappedPermissions = {};
      response.data.forEach((item) => { mappedPermissions[item.access_page] = item.access_control });
      return resolve({ status: 'success', message: 'Pages permission data fetched successfully.', mappedPermissions });
    } else {
      return reject({ status: 'error', message: response.error, error: response?.err });
    }
  });
}

export const fetchUserLoginHistory = async (userId) => {
  const result = await sbs.getDataByColumnName('UserLoginHistory', 'user_id', userId);
  if (result.success) {
    const sortedData = result.data
      .sort((a, b) => new Date(b.login_date) - new Date(a.login_date))
      .slice(0, 50);
    return { status: "success", message: "Login history fetched successfully", data: sortedData };
  } else {
    return { status: "error", message: result.error };
  }
};

export const updateUserLastLogin = async (userId) => {
  if (!userId) {
    return { status: "error", message: "Invalid user id" };
  }

  const payload = {
    last_login_at: new Date().toISOString()
  };

  const result = await sbs.updateData(
    "Users",
    "id",
    userId,
    payload
  );

  if (result?.success) {
    return {
      status: "success",
      message: "User last login updated successfully",
      data: result.data
    };
  } else {
    return {
      status: "error",
      message: result?.error,
      error: result?.err
    };
  }
};
