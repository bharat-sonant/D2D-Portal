import * as sbs from "../supabaseServices";

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
      city => city.Status === 'active'
    );

    const sortedData = activeCities.sort((a, b) =>
      a.CityName.localeCompare(b.CityName)
    );

    return { status: 'success', message: 'City data fetched successfully', data: sortedData };
  } else {
    return { status: 'error', message: result.error };
  };
};

export const saveUserCityAccess = async (payload) => {
  const result = await sbs.saveData('UserCityAccess', payload);
  if (result?.success) {
    return { status: 'success', message: 'User saved successfully', data: result?.data };
  } else {
    return { status: 'error', message: result?.error };
  };
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
  console.log(userId,"asd")
  const result = await sbs.deleteData("UserCityAccess", userId);
  console.log(result)
}
export const setUserDefaultCity=(userId,cityId)=>{
  return new Promise(async(resolve,reject)=>{
    if (!userId && cityId) {
      return reject('Invalid parameters');
    }
    const result = await sbs.updateData('Users', 'id', userId, {defaultCity:cityId});
    if (result.success) {
      return resolve ({ status: 'success', message: 'Default city updated successfully.', data: result.data });
    } else {
      return reject({status: 'error', message: result.error, error: result?.err});
    }
  });
}