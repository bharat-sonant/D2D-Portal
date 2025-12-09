import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainLayout from "../mainLayout/MainLayout";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DailyAssignment from "../pages/Daily-Assignment/DailyAssignment";
import StartAssignment from "../MobileAppPages/DailyAssignments/StartAssignment/pages/StartAssignment/StartAssignment";
import Penalty from "../MobileAppPages/PenaltyManagement/Pages/PenaltyList/Penalty";
import WorkMonitoring from "../MobileAppPages/Monitoring/Pages/WorkMonitoring/WorkMonitoring";
import LocationTracker from "../NavigatorPages/LocationTracker/locationTracker";
import Settings from "../MobileAppPages/Settings/Pages/Settings";
import AssignmentSummary from "../MobileAppPages/DailyAssignments/AssignmentSummary/Pages/AssignmentSummary/AssignmentSummary";
import DutyOn from "../MobileAppPages/DutyOn/pages/DutyOn/DutyOn";
import DutyOff from "../MobileAppPages/DutyOff/pages/DutyOff/DutyOff";
import Task from "../MobileAppPages/Tasks/Pages/Tasks/Task";
import DutyStart from "../MobileAppPages/DutyStart/pages/DutyStart";
import RealtimeMonitoring from "../pages/Realtime-Monitoring/realtime-monitoring";

const RouterComponent = () => {
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

        <Route
          path="/penalties"
          element={
            <>
              <Penalty />
            </>
          }
        />

        <Route
          path="/duty-on"
          element={
            <>
              <DutyOn />
            </>
          }
        />

        <Route
          path="/duty-off"
          element={
            <>
              <DutyOff />
            </>
          }
        />

        <Route
          path="/work-monitoring"
          element={
            <>
              <WorkMonitoring />
            </>
          }
        />
        <Route
          path="/locationTracker"
          element={
            <>
              <LocationTracker />
            </>
          }
        />
        <Route
          path="/Settings"
          element={
            <>
              <MainLayout />
              <Settings />
            </>
          }
        />

        <Route
          path="/AssignmentSummary"
          element={
            <>
              <AssignmentSummary />
            </>
          }
        />

        <Route
          path="/tasks"
          element={
            <>
              <MainLayout />
              <Task />
            </>
          }
        />

         <Route
          path="/duty-start"
          element={
            <>
              <DutyStart />
            </>
          }
        />
        <Route
          path="/realtime-monitoring"
          element={<><MainLayout /><RealtimeMonitoring /></>}
        />
      </Routes>

        

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
