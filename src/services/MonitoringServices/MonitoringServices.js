import * as sbs from '../supabaseServices';

const sortWards = (list = []) => {
  return [...list].sort((a, b) => {
    const nameA = a.name?.trim();
    const nameB = b.name?.trim();

    const isPureNumberA = /^\d+$/.test(nameA);
    const isPureNumberB = /^\d+$/.test(nameB);

    const startsWithAlphaA = /^[A-Za-z]/.test(nameA);
    const startsWithAlphaB = /^[A-Za-z]/.test(nameB);

    // 1️⃣ Alphabet wards first (Ward 2)
    if (startsWithAlphaA && !startsWithAlphaB) return -1;
    if (!startsWithAlphaA && startsWithAlphaB) return 1;

    // 2️⃣ Both are pure numbers → numeric sort
    if (isPureNumberA && isPureNumberB) {
      return Number(nameA) - Number(nameB);
    }

    // 3️⃣ Fallback natural sort
    return nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
};


export const getWardData = async() => {
  const result = await sbs.getDataByColumnName('Wards', 'city_Id', '74')
  if(!result.success){
    return {status : 'error', message : result?.error}
  }

  return{
    status : 'success',
    message : 'Ward list fetched successfully',
    data : sortWards(result?.data)
  }
}