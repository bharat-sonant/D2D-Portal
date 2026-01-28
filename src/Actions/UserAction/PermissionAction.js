import { upsertByConflictKeys } from "../../services/supabaseServices"
import * as common from "../../common/common";
import api from "../../api/api";

export const savePagesPermnissionAction=async(permissionDetail)=>{
        try {
         const response = await api.post('pages-permission/updatepermission',permissionDetail);
         common.setAlertMessage('success', response.message || 'Permission updated successfully.');
         } catch (err) {
          console.error(err.response?.data?.message)
          common.setAlertMessage('error','Failed to update permission access');
         }
}

export const getUserPagesPermissionsAction=async (userId,setPermissions)=>{
     try {
    const response = await api.get('pages-permission/getpermissions',{params: { userId }});
    setPermissions([]);
    setPermissions(response.data);
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