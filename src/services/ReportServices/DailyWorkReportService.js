import dayjs from 'dayjs';
import * as sbs from '../supabaseServices';

export const getDailyWorkReport = async(date) => {
  const result = await sbs.getDataByColumnName('DailyWorkAssignment', 'date', date)

  if(!result.success){
    return {status : 'error', message : result?.error}
  }

  return{
    status : 'success',
    message : "Daily work report data fetched successfully",
    data : result?.data
  }
}