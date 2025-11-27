import { ref } from 'firebase/storage';
import * as common from '../../../common/common'
import * as db from '../../../services/dbServices'
import { resizeImage } from '../UtilServices/ImageUtils';
import { getDateTimeDetails } from '../UtilServices/DateTImeUtil';
import dayjs from 'dayjs';
const fail = 'fail'
const success = 'success'
const isFail = (res) => res?.status === "fail";
const year = dayjs().format("YYYY");
const month = dayjs().format("MMMM");
const date = dayjs().format("YYYY-MM-DD");

export const getAllActiveVehicles = () => {
  return new Promise(async(resolve)=> {
    try{
      const year = dayjs().format("YYYY");
      const month = dayjs().format("MMMM");
      const date = dayjs().format("YYYY-MM-DD");
      const path = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Vehicles/NotAssigned`
      const result = await db.getData(path)

      const cleaned = Object.values(result || {}).filter(
        (v) => typeof v === "string" && v.trim() !== ""
      );

      resolve(common.setResponse(success, "vehicels fetched successfully", cleaned))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch vehicles"))
    }
  })
}

export const getActiveDrivers = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('ActiveDrivers');

      // const activeDrivers = Object.values(result)
       const activeDrivers = Object.entries(result)
        .filter(([key, value]) => value.taskAssigned !== "yes")   
        .map(([key, value]) => ({
          Id: key,
          name: value.name,
        }));

      resolve(common.setResponse(success, "fetched active drivers successfully", activeDrivers))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch active drivers"))
    }
  })
}

export const getActiveHelpers = () => {
  return new Promise(async(resolve)=> {
    try{
      const result = await db.getData('ActiveHelpers');

      const activeHelpers = Object.entries(result)
        .filter(([key, value]) => value.taskAssigned !== "yes")   
        .map(([key, value]) => ({
          Id: key,
          name: value.name,
        }));

      resolve(common.setResponse(success, "fetched active drivers successfully", activeHelpers))
    }catch(error){
      resolve(common.setResponse(fail, "failed to fetch active drivers"))
    }
  })
}

export const startAssignmentService = (ward, selectedVehicle, selectedDriver, selectedHelper) => {
  return new Promise(async(resolve)=> {
    try{
      const { year, monthName, date, time, formattedDate } = getDateTimeDetails();
      const [driverAssignmentResult, driverTaskStatusResult, helperAssignmentResult, helperTaskStatusResult, vehicleTaskStatusResult, workAssignmentResult, assignmentSummaryResult, moveToInProgressResult, removeFromNotAssignedResult,  moveVehicleToInProgressResult, removeVehicleFromNotAssignedResult] = await Promise.all([
        saveDriverAssignment(selectedDriver, ward, selectedVehicle),
        SaveDriverTaskStatus(selectedDriver),
        saveHelperAssignment(selectedHelper, ward, selectedVehicle),
        saveHelperTaskStatus(selectedHelper),
        saveVehicleTaskStatus(selectedVehicle),
        saveWorkAssignment(ward, selectedVehicle, selectedDriver, selectedHelper),
        saveAssignmentSummaryStatus(year, monthName, date, ward),
        moveToInProgress(ward),
        removeFromNotAssigned(ward),
        moveVehicleToInProgress(selectedVehicle),
        removeVehicleFromNotAssigned(selectedVehicle)
      ])
      if (isFail(driverAssignmentResult)) return resolve(driverAssignmentResult);
      if (isFail(driverTaskStatusResult)) return resolve(driverTaskStatusResult);
      if(isFail(helperAssignmentResult)) return resolve(helperAssignmentResult);
      if(isFail(helperTaskStatusResult)) return resolve(helperTaskStatusResult);
      if(isFail(vehicleTaskStatusResult)) return resolve(vehicleTaskStatusResult);
      if (isFail(workAssignmentResult)) return resolve(workAssignmentResult);
      if(isFail(assignmentSummaryResult)) return resolve(assignmentSummaryResult);
      if(isFail(moveToInProgressResult)) return resolve(moveToInProgressResult);
       if(isFail(removeFromNotAssignedResult)) return resolve(removeFromNotAssignedResult);
       if (isFail(moveVehicleToInProgressResult)) return resolve(moveVehicleToInProgressResult);
if (isFail(removeVehicleFromNotAssignedResult)) return resolve(removeVehicleFromNotAssignedResult);
      const finalResult = {
        driverAssignment: driverAssignmentResult,
        driverTaskStatus : driverTaskStatusResult,
        helperAssignment: helperAssignmentResult,
        helperTaskStatus : helperTaskStatusResult,
        vehicleTaskStatus : vehicleTaskStatusResult,
        workAssignment: workAssignmentResult,
        assignmentSummary : assignmentSummaryResult,
        moveToInProgress : moveToInProgressResult,
        removeFromNotAssigned : removeFromNotAssignedResult,
        moveVehicleToInProgress : moveVehicleToInProgressResult,
        removeVehicleFromNotAssigned : removeVehicleFromNotAssignedResult,
      }

      return resolve(
        common.setResponse(success, "Assignment started successfully", finalResult)
      );
    }catch(error){
      resolve(common.setResponse(fail, "failed to start assignment"))
    }
  })
}

const moveToInProgress = async(ward) => {
  const inProgressPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Task/InProgress`

  const existing = await db.getData(inProgressPath);

  const payload = {};

  if(existing){
    Object.keys(existing).forEach((key)=>{
      payload[key] = existing[key]
    })
  }

  const nextIndex = existing ? Object.keys(existing).length+1 : 1;

  payload[nextIndex] = ward;

  const result = await db.saveData(inProgressPath, payload);

  return result?.success
        ? result
        : common.setResponse(fail, "Task failed to move into inProgress bucket", result);
}

const removeFromNotAssigned = async(ward) => {
  const notAssignedPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Task/NotAssigned`

  const existing = await db.getData(notAssignedPath);

  let keyToRemove = null;

  Object.keys(existing).forEach((key)=>{
    if(existing[key] === ward){
      keyToRemove = key
    }
  })

  if(keyToRemove === null){
    return
  }

  const removePath = `${notAssignedPath}/${keyToRemove}`
  const result = await db.removeData(removePath);

   return result?.success
        ? result
        : common.setResponse(fail, "Task failed to remove from not assigned bucket", result);
}

const moveVehicleToInProgress = async(selectedVehicle) => {
  const inProgressPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Vehicles/InProgress`

  const existing = await db.getData(inProgressPath);

  const payload = {};

  if(existing){
    Object.keys(existing).forEach((key)=>{
      payload[key] = existing[key]
    })
  }

  const nextIndex = existing ? Object.keys(existing).length+1 : 1;

  payload[nextIndex] = selectedVehicle;

  const result = await db.saveData(inProgressPath, payload);

  return result?.success
        ? result
        : common.setResponse(fail, "Vehicle failed to move into inProgress bucket", result);
}

const removeVehicleFromNotAssigned = async(selectedVehicle) => {
  const notAssignedPath = `AssignmentData/DailyAssignmentSummary/${year}/${month}/${date}/Vehicles/NotAssigned`

  const existing = await db.getData(notAssignedPath);

  let keyToRemove = null;

  Object.keys(existing).forEach((key)=>{
    if(existing[key] === selectedVehicle){
      keyToRemove = key
    }
  })

  if(keyToRemove === null){
    return
  }

  const removePath = `${notAssignedPath}/${keyToRemove}`
  const result = await db.removeData(removePath);

   return result?.success
        ? result
        : common.setResponse(fail, "Vehicle failed to remove from not assigned bucket", result);
}

const saveDriverAssignment = async(selectedDriver, ward, selectedVehicle) => {
  const userAssignmentPath = `AssignmentData/UserAssignments/${selectedDriver.Id}`
      const userAssignmentPayload = {
        task : ward,
        vehicle: selectedVehicle
      }

    const result = await db.saveData(userAssignmentPath, userAssignmentPayload);

    return result?.success
        ? result
        : common.setResponse(fail, "driver assignment failed", result);
}

const SaveDriverTaskStatus = async(selectedDriver) => {
  const path = `ActiveDrivers/${selectedDriver.Id}`
      const payload = {
        taskAssigned : "yes"
      }

    const result = await db.saveData(path, payload);

    return result?.success
        ? result
        : common.setResponse(fail, "driver task assignment status save failed", result);
}

const saveHelperTaskStatus = async(selectedHelper) => {
  const path = `ActiveHelpers/${selectedHelper.Id}`
  const payload = {
    taskAssigned : "yes"
  }

  const result = await db.saveData(path, payload);

  return result.success
      ? result
      : common.setResponse(fail, "Helper task assignment status save failed", result)
}

const saveVehicleTaskStatus = async(selectedVehicle) => {
  const path = `Vehicles/${selectedVehicle}`
  const payload = {
    taskAssigned : "yes"
  }

  const result = await db.saveData(path, payload);

  return result.success
      ? result
      : common.setResponse(fail, "Vehicle task assignment status save failed", result)
}

const saveAssignmentSummaryStatus = async(year, monthName, date, ward) => {
  const path = `AssignmentData/AssignmentSummary/${year}/${monthName}/${date}/Task`;
  const payload ={
    [ward] : "Assigned"
  }

  const result = await db.saveData(path, payload);

  return result.success
    ? result
    : common.setResponse(fail, "assignment summary status update failed", result)
}

const saveHelperAssignment = async(selectedHelper, ward, selectedVehicle) => {
  const userAssignmentPath = `AssignmentData/UserAssignments/${selectedHelper.Id}`
      const userAssignmentPayload = {
        task : ward,
        vehicle: selectedVehicle
      }

    const result = await db.saveData(userAssignmentPath, userAssignmentPayload);

    return result?.success
        ? result
        : common.setResponse(fail, "helper assignment failed", result);
}

const saveWorkAssignment = async(ward, selectedVehicle, selectedDriver, selectedHelper) => {
  const workAssignmentPath = `AssignmentData/WorkAssignment/${ward}`
      const workAssignmentPayload = {
        driver: selectedDriver.Id,
        helper: selectedHelper.Id,
        vehicle: selectedVehicle
      }

    const result = await db.saveData(workAssignmentPath, workAssignmentPayload);

    return result?.success
        ? result
        : common.setResponse(fail, "work assignment failed", result);
}

export const saveDriverHelperImage = async (
  selectedWard,
  year,
  month,
  date,
  file
) => {
  return new Promise(async (resolve) => {
    try {
      if (!selectedWard || !year || !month || !date || !file) {
        resolve(
          common.setResponse("fail", "Invalid Params !!!", {
            selectedWard,
            year,
            month,
            date,
            file,
          })
        );
        return;
      }

      const city = localStorage.getItem("city");
      const storage = await db.getReadyStorage();
      const ward = selectedWard !== "N/A" ? selectedWard : "Bharat";

      // Fetch sizes from DB
      const [originalSizeRes, thumbnailSizeRes] = await Promise.all([
        getOriginalImageSizes(),
        getThumbnailImageSizes(),
      ]);

      let originalWidth = 0;
      let thumbnailWidth = 70;

      if (originalSizeRes?.data) {
        const parsedLarge = parseInt(originalSizeRes.data.replace(/\D/g, ""));
        if (!isNaN(parsedLarge) && parsedLarge > 0) {
          originalWidth = parsedLarge; // Large width, else keep as 0 (no resizing)
        }
      }
      if (thumbnailSizeRes?.data) {
        const parsedThumb = parseInt(thumbnailSizeRes.data.replace(/\D/g, ""));
        if (!isNaN(parsedThumb) && parsedThumb > 0) {
          thumbnailWidth = parsedThumb;
        }
      }

      let largeFileToUpload = file;
      let thumbFileToUpload = null;

      if (originalWidth > 0) {
        largeFileToUpload = await resizeImage(file, originalWidth);
      }
      thumbFileToUpload = await resizeImage(file, thumbnailWidth);


      const basePath = `${city}/DutyOnImages/${ward}/${year}/${month}/${date}`;
      const fileRef = ref(storage, `${basePath}/1.jpg`);

      const thumbnailFileRef = ref(storage, `${basePath}/Thumbnail-1.jpg`);
      const result = await Promise.all([
        db.uploadImageToStorage(largeFileToUpload, fileRef),
        db.uploadImageToStorage(thumbFileToUpload, thumbnailFileRef)
      ]);

      resolve(
        common.setResponse(
          "success",
          "Driver/Helper Image saved successfully",
          result
        )
      );
    } catch (error) {
      resolve(
        common.setResponse("fail", "Failed to save Images", error)
      );
    }
  });
};

export const getOriginalImageSizes = async() => {
  return new Promise(async(resolve) => {
    try{
      const path = `Settings/BackOfficeApplicationSettings/DriverLargeImageWidthInPx`
      const result = await db.getData(path);
      if(result){
      resolve(common.setResponse("success", "image sizes fetched successfully", result))
      }else{
        resolve(common.setResponse("fail", "No data found for image sizes"))
      }
    }catch(error){
      resolve(common.setResponse("fail", "failed to get sizes for the images", error))
    }
  })
}

export const getThumbnailImageSizes = async() => {
  return new Promise(async(resolve) => {
    try{
      const path = `Settings/BackOfficeApplicationSettings/DriverThumbnailWidthInPx`
      const result = await db.getData(path);
      if(result){
      resolve(common.setResponse("success", "image sizes fetched successfully", result))
      }else{
        resolve(common.setResponse("fail", "No data found for image sizes"))
      }
    }catch(error){
      resolve(common.setResponse("fail", "failed to get sizes for the images", error))
    }
  })
}

