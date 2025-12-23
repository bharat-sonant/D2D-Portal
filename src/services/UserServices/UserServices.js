import * as sbs from "../supabaseServices";

export const saveUserData = async (userDetail) => {
  const result = await sbs.saveData('Users', userDetail);
  if (result?.success) {
    return { status: 'success', message: 'User saved successfully', data: result?.data };
  } else {
    return { status: 'error', message: result?.error  };
  }
};    

export const updateUserData=async(userId,userDetail)=>{
   const result = await sbs.updateData('Users','id',userId,userDetail);
  if (result.success) {
    return { status: 'success', message: 'User data updated successfully', data: result.data };
  } else {
    return { status: 'error', message: result.error ,error: result?.err};
  }
}


export const getUserData=async()=>{
    const result = await sbs.getData('Users');
    if(result.success){
       const sortedData = [...result.data].sort((a, b) =>a.name.localeCompare(b.name));
      return { status: 'success', message: 'User data fetched successfully', data: sortedData };
    }else{
       return { status: 'error', message: result.error };
    } 
}

export const updateUserStatus = async(userId,userDetail)=>{
     const result = await sbs.updateData('Users','id',userId,userDetail);
  if (result.success) {
    return { status: 'success', message: 'User status updated successfully', data: result.data };
  } else {
    return { status: 'error', message: result.error };
  }
}