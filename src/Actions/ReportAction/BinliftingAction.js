import { getBinliftingPlanService } from "../../services/ReportServices/BinliftingService"

export const getBinliftingData = async(year, month, selectedDate) => {
  try{
    const response = await getBinliftingPlanService(year, month, selectedDate);
  }catch(error){

  }
}