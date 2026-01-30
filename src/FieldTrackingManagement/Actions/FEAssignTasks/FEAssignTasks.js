import api from "../../../api/api"
import * as common from '../../../common/common'

export const assignTaskAction = async(payload) => {
try{
  const response = await api.post('/fe-task-assignment/assign-task',payload)
  if(response.success){
    common.setAlertMessage('success','Task assigned successfully')
    return { success: true, data: response.data };
  }else{
    common.setAlertMessage('error','Task Assignment faild, Try again !')
    return { success: false };
  }
}catch(error){
  common.setAlertMessage('error',error || 'Something went wrong, Try Again please !')
  console.log('error in assigning task', error)
  return { success: false };
}
}