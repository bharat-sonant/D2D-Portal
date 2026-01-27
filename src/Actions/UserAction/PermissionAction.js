import { upsertByConflictKeys } from "../../services/supabaseServices"
import * as usrService from "../../services/UserServices/UserServices"
import axios from 'axios';
import * as common from "../../common/common";

export const savePagesPermnissionAction=async(permissionDetail)=>{
        try {
         const response = await axios.post( 'http://localhost:3001/pages-permission/updatepermission',permissionDetail);
         const apiData = response.data;
         common.setAlertMessage('success', apiData.message || 'Permission updated successfully.');
         } catch (err) {
          console.error(err.response?.data?.message)
          common.setAlertMessage('error','Failed to update permission access');
         }
}

export const getUserPagesPermissionsAction=async (userId,setPermissions)=>{
     try {
    const response = await axios.get(
      'http://localhost:3001/pages-permission/getpermissions',
      {
        params: { userId }
      }
    );
    setPermissions([]);
    if (response.status === 200) {
      setPermissions(response.data.data);
    }
  } catch (error) {
    console.error('Failed to fetch permissions', error);
    setPermissions([]);
  }
}

export const saveSuperAdminPermissionsAction=async (permissionsData,getUserPermissions)=>{
 
 let response =  await upsertByConflictKeys("UserPortalAccess",permissionsData,"user_id,access_page");
 if(response.success){
    getUserPermissions();
 }
}