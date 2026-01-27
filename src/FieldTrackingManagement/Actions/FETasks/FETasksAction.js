import api from "../../../api/api"
import * as common from '../../../common/common'

export const saveTaskAction = async(taskData) => {
  try{
    const response = await api.post('/tasks/create', taskData)
    if(response.success){
      common.setAlertMessage('Task Added Successfully');
    }
    return response.data;
  }catch(error){
    common.setAlertMessage("Task was not added, please try again !");
    throw error;
  }
}

export const getallTasks = async(setTasks, setLoading) => {
  try{
    setLoading(true)
    const response = await api.get('tasks');
    if(response.success){
      setTasks(response?.data?.tasks)
    }
  }catch(error){
    setTasks([]);
  }finally{
    setLoading(false);
  }
}

export const updateTaskAction = async(id, payload) => {
  try{
    const response = await api.patch(`/tasks/${id}`, payload);
    if(response.success){
      common.setAlertMessage("Task Updated successfully");
    }
    return response.data;
  }catch(error){
    common.setAlertMessage("Task modification failed, Please try again");
    throw error;
  }
}