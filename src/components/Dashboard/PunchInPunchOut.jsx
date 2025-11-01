import React, { useEffect, useState } from "react";
import * as punchInOutAction from "../../actions/DashboardAction/PunchInPunchOutAction";
import styles from "../../assets/css/Dashboard/PunchInOut.module.css";
import Camera from "../Camera";
import { usePermissions } from "../../context/PermissionContext";
import { images } from "../../assets/css/imagePath";
import HolidayCountList from "../Holidays/HolidayCountList";
import { getWorkStatus } from "../../services/Attendance/PunchInAndPunchOutService";
import PunchOutAlert from "./PunchOutAlert";

const PunchInPunchOut = (props) => {
  const { setIsLocationPermissionGranted, setIsCameraPermissionGranted } = usePermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPunchInImage, setCapturedPunchInImage] = useState(null);
  const [capturedPunchOutImage, setCapturedPunchOutImage] = useState(null);
  const [punchInTime, setPunchInTime] = useState("00:00");
  const [punchOutTime, setPunchOutTime] = useState("00:00");
  const [buttonText, setButtonText] = useState("Punch In");
  const [flag, setFlag] = useState("1");
  const [latLng, setLatLng] = useState("");
  const [loader, setLoader] = useState(true);
  const [globalTime, setGlobalTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageSaveButtonLoading, setImageSaveButtonLoading] = useState(false);
  const [cameraIconClick, setCameraIconClick] = useState(false);
  const [cameraButtonId, setCameraButtonId] = useState("");
  const [holidayList, setHolidayList] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [holidayCount, setHolidayCount] = useState("0");
  const [isNetworkConnected, setIsNetworkConnected] = useState(navigator.onLine); // Track network status
  const [showPunchOutAlert, setShowPunchOutAlert] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [workedHrs, setWorkedHrs] = useState({
    workedTime: '',
    remainingTime: '',
  });
  const [dailyWorkedHrs, setDailyWorkedHrs] = useState("")

  const empCode = localStorage.getItem("empCode");
  const company = localStorage.getItem("company");
  const distanceFromOffice = "0";

  useEffect(() => {
    punchInOutAction.todayAttendanceData(
      company,
      empCode,
      setCapturedPunchInImage,
      setPunchInTime,
      setPunchOutTime,
      setCapturedPunchOutImage,
      setFlag,
      setButtonText,
      setLoader
    );
  }, []);

  useEffect(() => {
    punchInOutAction.getHolidaysCount(setHolidayCount);
    punchInOutAction.getHolidayList(setHolidayList);
  }, []);

  // Handle network status changes
  useEffect(() => {
    const handleNetworkChange = () => {
      setIsNetworkConnected(navigator.onLine);
    };
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  const requestLegacyCompatibleCameraPermission = () => {
    return new Promise((resolve, reject) => {
      const constraints = { video: true, audio: false };

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(resolve).catch(reject);
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, resolve, reject);
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(constraints, resolve, reject);
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(constraints, resolve, reject);
      } else {
        console.error("Camera API is not supported in this browser.");
        reject(new Error("Camera API not supported"));
      }
    });
  };

  const handleCameraError = (error) => {
    console.error("Camera Error:", error);
    if (error.name === "NotAllowedError") {
      console.error("Please allow camera access.");
    } else if (error.name === "NotFoundError") {
      console.error("No camera found.");
    }
    setIsCameraPermissionGranted(true);
  };

  const CheckUserWorkedHours = async () => {
    setLoading(true);
    let workingTime = await getWorkStatus(punchInTime, company, empCode)
    if (workingTime.status === true) {
      if(punchInTime!=='00:00'){
       let res = isGreaterOrEqualTo3Hours(workingTime.dailyWorkedHrs)
      if (res === false) {
        setLoading(false);
        setDailyWorkedHrs(workingTime.dailyWorkedHrs)
        setShowPunchOutAlert(true)
      } else {
        handlePunchInOutClick(false)
      }
      }else{
        handlePunchInOutClick(false)
      }
   
    } else {
      setLoading(false);
      setWorkedHrs(prev => ({
        ...prev,
        workedTime: workingTime.worked,
        remainingTime: workingTime.remaining,
      }));
      setShowPunchOutAlert(true)
    }

  }

  function isGreaterOrEqualTo3Hours(timeStr) {
    if (timeStr !== "0 min") {
      let hours = 0;
      let minutes = 0;

      // Normalize string
      timeStr = timeStr.toLowerCase();

      // Match hours
      const hrMatch = timeStr.match(/(\d+)\s*hrs?/);
      if (hrMatch) {
        hours = parseInt(hrMatch[1]);
      }

      // Match minutes
      const minMatch = timeStr.match(/(\d+)\s*min/);
      if (minMatch) {
        minutes = parseInt(minMatch[1]);
      }

      const totalMinutes = hours * 60 + minutes;

      return totalMinutes >= 180;
    } else {
      return false;
    }

  }
  const handlePunchInOutClick = async (value) => {
    setButtonLoading(value)

    if (!isNetworkConnected) {
      alert("Network is unavailable. Please check your connection and try again.");
      return;
    }
    let stream = null;
    try {
      stream = await requestLegacyCompatibleCameraPermission();
      await punchInOutAction.handlePunchIn(
        company,
        empCode,
        setGlobalTime,
        setLatLng,
        cameraOpen,
        setCameraOpen,
        setIsLocationPermissionGranted,
        setIsCameraPermissionGranted,
        setShowPunchOutAlert
      );
    } catch (error) {
      handleCameraError(error);
    } finally {
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setLoading(false);
      setButtonLoading(false)
    }


  };

  const handleCameraClick = async (event) => {
    if (!isNetworkConnected) {
      alert("Network is unavailable. Please check your connection and try again.");
      return;
    }
    const buttonId = event.target.id;
    let stream = null;
    try {
      stream = await requestLegacyCompatibleCameraPermission();
      await punchInOutAction.handleCameraIconClick(
        setLatLng,
        cameraOpen,
        setCameraOpen,
        setIsLocationPermissionGranted,
        setCameraIconClick
      );
      setCameraButtonId(buttonId);
    } catch (error) {
      handleCameraError(error);
    } finally {
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handlePunchInOut = async (image) => {

    if (cameraIconClick) {
      punchInOutAction.updatePunchInPunchOutImage(
        company,
        empCode,
        image,
        cameraButtonId,
        latLng,
        setCapturedPunchInImage,
        setCapturedPunchOutImage,
        setCameraIconClick
      );
    } else {
      setLoading(true);
      setImageSaveButtonLoading(true);
      await punchInOutAction.handleCapture(
        image,
        flag,
        company,
        empCode,
        latLng,
        globalTime,
        distanceFromOffice,
        setCapturedPunchInImage,
        setPunchInTime,
        setButtonText,
        setFlag,
        setCapturedPunchOutImage,
        setPunchOutTime,
        setCameraOpen,
        setImageSaveButtonLoading,
        props.setRefresh
      );
      setLoading(false);
    }
  };
  const handleClose = () => {
    setShowPunchOutAlert(false)
    setButtonLoading(false)
    setWorkedHrs({ workedTime: '', remainingTime: '', })
    setDailyWorkedHrs("")
  }


  return (
    <>
      <div className={styles.BoxBody}>
        <div className={styles.PunchInBox3}>
          <button
            className={`btn ${styles.button}`}
            onClick={CheckUserWorkedHours}
            disabled={flag === "3" || loading}
          >
            {loading ? (
              <div className={styles.spinnerContainer}>
                <div className={`spinner-border ${styles.borderSpinner}`} role="status" />
              </div>
            ) : (
              <>
                {flag !== "3" && (
                  <img src={images.punchIcon} className={`${styles.PunchIcon}`} />
                )}
                <div className={styles.btnText}>{buttonText}</div>
              </>
            )}
          </button>
        </div>

        <div className={styles.punchInBox}>
          <div className={styles.pinchIn}>
            <div className={styles.punchMain}>
              <img
                src={capturedPunchInImage || images.DeafultImg}
                alt="Punch In"
                className={`${styles.DeafultImg}`}
              />
              {(flag === "2" || flag === "3") && (
                <img
                  onClick={handleCameraClick}
                  className={styles.cameraIcon}
                  src={images.iconReUpload}
                  alt="cameraImage"
                  id="punchInImage"
                />
              )}
            </div>
            <h4 className={styles.timeView}>{punchInTime}</h4>
            <p className={styles.puchName}>Punch In</p>
          </div>

          <div className={styles.pinchIn}>
            <div className={styles.punchMain}>
              <img
                src={capturedPunchOutImage || images.DeafultImg}
                alt="Punch Out"
                className={`${styles.DeafultImg}`}
              />
              {flag === "3" && (
                <img
                  onClick={handleCameraClick}
                  className={styles.cameraIcon}
                  src={images.iconReUpload}
                  alt="cameraImage"
                  id="punchOutImage"
                />
              )}
            </div>
            <h4 className={styles.timeView}>{punchOutTime}</h4>
            <p className={styles.puchName}>Punch Out</p>
          </div>
        </div>

        {cameraOpen && (
          <Camera
            onClose={() => {
              setCameraOpen(false);
              setCameraIconClick(false);
            }}
            title={"Capture Image"}
            onCapture={handlePunchInOut}
            setIsCameraVisible={setIsCameraPermissionGranted}
            loading={imageSaveButtonLoading}
          />
        )}
      </div>

      <HolidayCountList
        showMore={showMore}
        onHide={() => setShowMore(false)}
        holidayList={holidayList}
      />
      <PunchOutAlert
        show={showPunchOutAlert}
        workedHrs={workedHrs}
        handleClose={handleClose}
        handlePunchInOutClick={handlePunchInOutClick}
        buttonLoading={buttonLoading}
        dailyWorkedHrs={dailyWorkedHrs}
      />
    </>
  );
};

export default PunchInPunchOut;
