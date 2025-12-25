import * as sbs from '../supabaseServices';

export const getWardData = async() => {
  const result = await sbs.getDataByColumnName('CityWiseWard', 'CityId', '74')

  if(!result.success){
    return {status : 'error', message : result?.error}
  }

  return{
    status : 'success',
    message : 'Ward list fetched successfully',
    data : result?.data
  }
}