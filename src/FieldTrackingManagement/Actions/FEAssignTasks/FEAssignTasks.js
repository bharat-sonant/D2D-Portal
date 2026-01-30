import api from "../../../api/api"
import * as common from '../../../common/common'

export const assignTaskAction = async(payload) => {
try{
  const response = await api.post('/fe-task-assignment/assign-task',payload)
  console.log('response', response)
  if(response.success){
    common.setAlertMessage('success','Task assigned successfully')
  }else{
    common.setAlertMessage('error','Task Assignment faild, Try again !')
  }
}catch(error){
  common.setAlertMessage('error',error || 'Something went wrong, Try Again please !')
  console.log('error in assigning task', error)
}
}