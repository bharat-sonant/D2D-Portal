import * as punchInOutService from "../../services/Attendance/PunchInAndPunchOutService"
import * as common from "../../common/common"
import { getHolidayCountOfCurrentMonth, getHolidaysData } from "../../services/Holiday/holidayServices";

const success = "success";

export const todayAttendanceData = (company, empCode, setCapturedPunchInImage, setPunchInTime, setPunchOutTime, setCapturedPunchOutImage, setFlag, setButtonText, setLoader) => {
    punchInOutService.getAttendance(company, empCode).then((res) => {
        if (res.status === success) {
            const inImage = res?.data?.inImage || null;
            const outImage = res?.data?.outImage || null;

            setCapturedPunchInImage(inImage);
            setPunchInTime(res?.data?.inTime || "00:00")
            setPunchOutTime(res?.data?.outTime || "00:00")
            setCapturedPunchOutImage(outImage);
            setLoader(false);
            setFlag(res.data.flag)
            if (res.data.flag === "2") {
                setButtonText("Punch Out")
            } else if (res.data.flag === "3") {
                setButtonText("Done")
            }
        } else {
            setLoader(false);
            setCapturedPunchInImage(null);
            setPunchInTime("00:00")
            setPunchOutTime("00:00")
            setCapturedPunchOutImage(null)
        }
    }).catch((error) => {
        setLoader(false);
        console.log("Error: ", error);
    })
}

export const handleCapture = async (image, flag, company, empCode, latLng, globalTime, distanceFromOffice, setCapturedPunchInImage, setPunchInTime, setButtonText, setFlag, setCapturedPunchOutImage, setPunchOutTime, setCameraOpen, setImageSaveButtonLoading, setRefresh) => {
    if (flag === "1") {
        let status = await punchInOutService.saveAttendance(company, empCode, latLng, globalTime, image, "PunchIn", distanceFromOffice);
        if (status.status === success) {
            setCapturedPunchInImage(image);
            setPunchInTime(globalTime);
            setRefresh(true);
            setButtonText("Punch Out");
            setFlag("2");
        } else {
            console.log("Error")
        }
    } else {
        let status = await punchInOutService.saveAttendance(company, empCode, latLng, globalTime, image, "PunchOut", distanceFromOffice);
        if (status.status === success) {
            setCapturedPunchOutImage(image);
            setPunchOutTime(globalTime);
            setRefresh(true);
            setButtonText("Done");
            setFlag("3");
        } else {
            console.log("Error")
            setRefresh(false);
        }

    }
    setImageSaveButtonLoading(false);
    setCameraOpen(false);
    // setRefresh(false);
};

export const handlePunchIn = async (
    company,
    empCode,
    setGlobalTime,
    setLatLng,
    cameraOpen,
    setCameraOpen,
    setIsLocationVisible,
    setIsCameraVisible,
    setShowPunchOutAlert
) => {
    try {
        // Fetch global time and location simultaneously
        const [timeResult, locationResult] = await Promise.all([
            common.getGlobalTime(company, empCode),
            common.getCurrentLocation(setIsLocationVisible),
        ]);

        if (!timeResult || timeResult.status !== "success") {
            console.error("Failed to fetch global time.");
            setIsCameraVisible(true);
            return;
        }

        if (!locationResult || locationResult.status !== "success") {
            console.error("Failed to fetch location.");
            setIsLocationVisible(true);
            return;
        }

        // console.log("timeResult: ", timeResult.status, locationResult.status);

        if (timeResult.status === "success" && locationResult.status === "success") {
            setGlobalTime(timeResult.data.time);
            setLatLng(`${locationResult.data.lat},${locationResult.data.lng}`);

            if (!cameraOpen) {
                setCameraOpen(true);
                setShowPunchOutAlert(false)
            }
        }


    } catch (error) {
        console.error("Error during Punch-In process:", error.message);
    }
};

export const getHolidaysCount = (setHolidayCount) => {
    const company = localStorage.getItem('company');
    getHolidayCountOfCurrentMonth(company).then((resp) => {
        if (resp.status === 'success') {
            setHolidayCount(resp.data.count);
        } else {
            setHolidayCount(resp.data.count);
        };
    });
};

export const getHolidayList = (setHolidayList) => {
    try {
        const company = localStorage.getItem("company");
        getHolidaysData(company).then((resp) => {
            if (resp.status === 'success') {
                setHolidayList(resp.data);
            } else {
                setHolidayList([]);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const handleCameraIconClick = async (
    setLatLng,
    cameraOpen,
    setCameraOpen,
    setIsLocationVisible,
    setCameraIconClick,
) => {
    try {
        // Fetch global time and location simultaneously
        const locationResult = await common.getCurrentLocation(setIsLocationVisible);

        if (!locationResult || locationResult.status !== "success") {
            console.error("Failed to fetch location.");
            setIsLocationVisible(true);
            return;
        }

        if (locationResult.status === "success") {
            setLatLng(`${locationResult.data.lat},${locationResult.data.lng}`);
            setCameraIconClick(true);
            setCameraOpen(true);
            if (!cameraOpen) {
                setCameraOpen(true);
            }
        }
    } catch (error) {
        console.error("Error during Punch-In process:", error.message);
    }
};

export const updatePunchInPunchOutImage = (company, empCode, cameraImage, attendanceType, latLng, setCapturedPunchInImage, setCapturedPunchOutImage, setCameraIconClick) => {
    punchInOutService.updateAttendanceImage(company, empCode, cameraImage, attendanceType, latLng).then((res) => {
        if (res.status === success) {
            if (attendanceType === "punchInImage") {
                setCapturedPunchInImage(res?.data?.imageUrl);
                setCameraIconClick(false)
            } else {
                setCameraIconClick(false)
                setCapturedPunchOutImage(res?.data?.imageUrl);
            }
        } else {
            setCameraIconClick(false)
            console.warn("Unexpected response status:", res.status);
        }
    }).catch((err) => {
        setCameraIconClick(false)
        console.error(err);
    })
}