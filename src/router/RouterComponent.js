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
import Reports from "../pages/Reports/Reports";
import Vehicle from "../MobileAppPages/Vehicles/Pages/Vehicles/Vehicle";
import { IoMagnet } from "react-icons/io5";
import TaskData from "../pages/Task-Data/TaskData";
import User from "../pages/Users/Users";
import Login from "../pages/Login/login";
import ProtectedRouter from "./ProtectedRouter/ProtectedRouter";

const RouterComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedDate = localStorage.getItem("loginDate");
    const today = dayjs().format("DD/MM/YYYY");
    if (savedDate && savedDate !== today) {
      localStorage.removeItem("loginDate");
      localStorage.removeItem("isLogin");
      localStorage.removeItem("userName");
      navigate("/");
    }
  }, [location.pathname]);



  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

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
           <ProtectedRouter>
              <MainLayout />
              <DailyAssignment />
           </ProtectedRouter>
          }
        />

        <Route
          path="/start-assignment"
          element={
           <ProtectedRouter>
              <StartAssignment />
          </ProtectedRouter>
          }
        />

        <Route
          path="/penalties"
          element={
            <ProtectedRouter>
              <Penalty />
           </ProtectedRouter>
          }
        />

        <Route
          path="/duty-on"
          element={
          <ProtectedRouter>
              <DutyOn />
            </ProtectedRouter>
          }
        />

        <Route
          path="/duty-off"
          element={
          <ProtectedRouter>
              <DutyOff />
            </ProtectedRouter>
          }
        />

        <Route
          path="/work-monitoring"
          element={
            <ProtectedRouter>
              <WorkMonitoring />
          </ProtectedRouter>
          }
        />
        <Route
          path="/locationTracker"
          element={
           <ProtectedRouter>
              <LocationTracker />
            </ProtectedRouter>
          }
        />
        <Route
          path="/Settings"
          element={
          <ProtectedRouter>
              <MainLayout />
              <Settings />
           </ProtectedRouter>
          }
        />

        <Route
          path="/AssignmentSummary"
          element={
          <ProtectedRouter>
              <AssignmentSummary />
           </ProtectedRouter>
          }
        />

        <Route
          path="/tasks"
          element={
           <ProtectedRouter>
              <MainLayout />
              <Task />
            </ProtectedRouter>
          }
        />

        <Route
          path="/duty-start"
          element={
               <ProtectedRouter>
                <DutyStart/>
               </ProtectedRouter>
              
            
          }
        />
        <Route
          path="/realtime-monitoring"
          element={<ProtectedRouter><MainLayout /><RealtimeMonitoring/></ProtectedRouter>}
        />
        <Route
          path="/reports"
          element={   <ProtectedRouter><MainLayout /><Reports />   </ProtectedRouter>}
        />

        <Route
          path="/vehicle"
          element={
           <ProtectedRouter>
              <MainLayout />
              <Vehicle />
           </ProtectedRouter>
          }
        />
        <Route
          path="/TaskData"
          element={
            <ProtectedRouter>
              <MainLayout/>
              <TaskData/>
            </ProtectedRouter>
          }
        />
       <Route
  path="/users"
  element={
  <ProtectedRouter>
    <MainLayout/>
        <User/>
     </ProtectedRouter>
    
  }
/>

        {/* <Route
          path="/users"
          element={
            <>
              <MainLayout/> 
              <User/>
            </>
          }
        /> */}
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
