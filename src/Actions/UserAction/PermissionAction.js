
import { upsertByConflictKeys } from "../../services/supabaseServices"
import * as usrService from "../../services/UserServices/UserServices"

export const savePagesPermnissionAction=(permissionDetail)=>{
   usrService.savePagesPermission(permissionDetail)
}

export const getUserPagesPermissionsAction=async (userId,setPermissions)=>{
     let response = await usrService.getUserPagesPermissions(userId)
     setPermissions([])
     if(response.status==='success'){
     setPermissions(response.mappedPermissions)
     }
}

export const saveSuperAdminPermissionsAction=async (permissionsData,getUserPermissions)=>{
 let response =  await upsertByConflictKeys("UserPortalAccess",permissionsData,"user_id,access_page");
 if(response.success){
    getUserPermissions();
 }
}