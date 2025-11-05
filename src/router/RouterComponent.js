import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainLayout from "../mainLayout/MainLayout";
import { usePermissions } from "../context/PermissionContext";
import LocationPermissionAlertDialog from "../components/AlertDialog/LocationPermissionAlertDialog";
import CameraPermissionAlertDialog from "../components/AlertDialog/CameraPermissionAlertDialog";
import notificationStyle from "../Style/commonStyle/confirmation.module.css";
import {
  mobileBrowserLocationStep,
  mobileBrowserCameraStep,
  desktopBrowserLocationStep,
  desktopBrowserCameraStep,
  desktopBrowserNotificationStep,
  desktopNotificationStep,
} from "../assets/PermissionAlertMessage/Message";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import NotificationPermissionModal from "../components/AlertDialog/NotificationPermissionModal";
import NewUpdateAlertWindow from "../components/AlertDialog/NewUpdateAlertWindow";
import Wards from "../pages/Wards/Wards";
import DailyAssignment from "../pages/Daily-Assignment/DailyAssignment";
import StartAssignment from "../MobileAppPages/DailyAssignments/StartAssignment/pages/StartAssignment/StartAssignment";

const RouterComponent = () => {
  const {
    isLocationPermissionGranted,
    setIsLocationPermissionGranted,
    isCameraPermissionGranted,
    setIsCameraPermissionGranted,
    setIsNotificationPermissionGranted,
    isNotificationPermissionGranted,
    isUserActive,
    ref,
    empCode,
    setOwnerStatus,
    showUpdateNotification,
    setShowUpdateNotification,
  } = usePermissions();

  const loginStatus = localStorage.getItem("islogin");
  const loggedInempCode = localStorage.getItem("empCode");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedDate = localStorage.getItem("loginDate");
    const today = dayjs().format("DD/MM/YYYY");
    if (savedDate && savedDate !== today) {
      localStorage.removeItem("loginDate");
      localStorage.removeItem("islogin");
      localStorage.removeItem("loginAsUser");
      navigate("/");
    }
  }, [location.pathname]);

  useEffect(() => {
    const owner = localStorage.getItem("isOwner");
    if (owner) {
      setOwnerStatus(owner);
    }
  }, []);

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}

        <Route
          path="/"
          element={
            <>
              <MainLayout />
              <Dashboard />
            </>
          }
        />




        <Route
          path="/wards"
          element={
            <>
              <MainLayout />
              <Wards />
            </>
          }
        />

        <Route
          path="/daily-assignment"
          element={
            <>
              <MainLayout />
              <DailyAssignment />
            </>
          }
        />

        <Route
          path="/start-assignment"
          element={
            <>
              <StartAssignment />
            </>
          }
        />
      </Routes>

      <LocationPermissionAlertDialog
        visible={isLocationPermissionGranted}
        title={"Please wait !"}
        msg={
          <>
            <p className={`${notificationStyle.msgText}`}>
              Location permission is blocked. Please allow location permission.
            </p>
            <div className={notificationStyle.notificationEnable}>
              <p className={notificationStyle.bodyTitle}>
                How to enable mobile browser location permission.
              </p>
              <ol className={`${notificationStyle.bodyOl}`}>
                {mobileBrowserLocationStep.map((step, i) => (
                  <li
                    className={`${notificationStyle.bodyDescription}`}
                    key={i}
                  >
                    <span className={`${notificationStyle.sNumber}`}>
                      {i + 1}
                      {". "}
                    </span>
                    <p className={`${notificationStyle.info}`}>{step} </p>
                  </li>
                ))}
              </ol>

              <br />
              <p className={notificationStyle.bodyTitle}>
                How to enable laptop, desktop web broswer location permission
              </p>
              <ol className={`${notificationStyle.bodyOl}`}>
                {desktopBrowserLocationStep.map((step, i) => (
                  <li
                    className={`${notificationStyle.bodyDescription}`}
                    key={i}
                  >
                    <span className={`${notificationStyle.sNumber}`}>
                      {i + 1}
                      {". "}
                    </span>
                    <p className={`${notificationStyle.info}`}>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </>
        }
        onConfirm={() => {
          setIsLocationPermissionGranted(false);
        }}
        btnOneText={"OK"}
      />

      <CameraPermissionAlertDialog
        visible={isCameraPermissionGranted}
        title={"Please wait !"}
        msg={
          <>
            <p className={`${notificationStyle.msgText}`}>
              Camera permission is blocked. Please allow location permission.
            </p>
            <div className={notificationStyle.notificationEnable}>
              <p className={notificationStyle.bodyTitle}>
                How to enable mobile browser camera permission.
              </p>
              <ol className={`${notificationStyle.bodyOl}`}>
                {mobileBrowserCameraStep.map((step, i) => (
                  <li
                    className={`${notificationStyle.bodyDescription}`}
                    key={i}
                  >
                    <span className={`${notificationStyle.sNumber}`}>
                      {i + 1}
                      {". "}
                    </span>
                    <p className={`${notificationStyle.info}`}>{step} </p>
                  </li>
                ))}
              </ol>

              <br />
              <p className={notificationStyle.bodyTitle}>
                How to enable laptop, desktop web broswer location permission
              </p>
              <ol className={`${notificationStyle.bodyOl}`}>
                {desktopBrowserCameraStep.map((step, i) => (
                  <li
                    className={`${notificationStyle.bodyDescription}`}
                    key={i}
                  >
                    <span className={`${notificationStyle.sNumber}`}>
                      {i + 1}
                      {". "}
                    </span>
                    <p className={`${notificationStyle.info}`}>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </>
        }
        onConfirm={() => {
          setIsCameraPermissionGranted(false);
        }}
        btnOneText={"OK"}
      />
      <NotificationPermissionModal
        visible={isNotificationPermissionGranted}
        title={"Please wait !"}
        msg={
          <>
            <p className={`${notificationStyle.msgText}`}>
              Notification permission is blocked. Please allow Notification
              permission.
            </p>
            <div className={notificationStyle.notificationEnable}>
              <p className={notificationStyle.bodyTitle}>
                How to enable Notification permission.
              </p>
              <ol className={`${notificationStyle.bodyOl}`}>
                {desktopBrowserNotificationStep.map((step, i) => (
                  <li
                    className={`${notificationStyle.bodyDescription}`}
                    key={i}
                  >
                    <span className={`${notificationStyle.sNumber}`}>
                      {i + 1}
                      {". "}
                    </span>

                    <p className={`${notificationStyle.info}`}>{step} </p>
                  </li>
                ))}
              </ol>

              <br />
              <p className={notificationStyle.bodyTitle}>
                Allow System Level Notification
              </p>
              <ol className={`${notificationStyle.bodyOl}`}>
                {desktopNotificationStep.map((step, i) => (
                  <li
                    className={`${notificationStyle.bodyDescription}`}
                    key={i}
                  >
                    <span className={`${notificationStyle.sNumber}`}>
                      {i + 1}
                      {". "}
                    </span>
                    <p className={`${notificationStyle.info}`}>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </>
        }
        onConfirm={() => {
          setIsNotificationPermissionGranted(false);
        }}
        btnOneText={"OK"}
      />

      {showUpdateNotification && (
        <NewUpdateAlertWindow
          setShowUpdateNotification={setShowUpdateNotification}
          showUpdateNotification={showUpdateNotification}
        />
      )}

      <AutoLogoutComponent
        loggedInempCode={loggedInempCode}
        empCode={empCode}
        loginStatus={loginStatus}
        isUserActive={isUserActive}
        ref={ref}
      />
    </>
  );
};
const AutoLogoutComponent = ({
  loggedInempCode,
  empCode,
  loginStatus,
  isUserActive,
  ref,
}) => {
  const navigate = useNavigate(); // Moved inside the BrowserRouter context

  useEffect(() => {
    if (
      Number(isUserActive) === 2 &&
      empCode === loggedInempCode &&
      loginStatus === "success"
    ) {
      localStorage.setItem("islogin", "Fail");
      localStorage.removeItem("name");
      localStorage.removeItem("isOwner");
      localStorage.removeItem("userName");
      localStorage.removeItem("loginDate");
      localStorage.removeItem("lastPath");
      localStorage.removeItem("empCode");
      localStorage.removeItem("company");
      localStorage.removeItem("branchCode");
      localStorage.removeItem("profileImage");
      localStorage.removeItem("companyEmail");
      // Check if ref and ref.current are defined before accessing them
      if (ref?.current) {
        ref.current();
        ref.current = null;
      }

      navigate("/");
    }
  }, [isUserActive, loggedInempCode, ref, loginStatus, navigate]);

  return null; // Since this is a logic-only component
};

export default RouterComponent;
//showUpdateNotification
