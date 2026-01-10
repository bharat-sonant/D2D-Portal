import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainLayout from "../mainLayout/MainLayout";
import { useNavigate } from "react-router-dom";
import StartAssignment from "../MobileAppPages/DailyAssignments/StartAssignment/pages/StartAssignment/StartAssignment";
import Penalty from "../MobileAppPages/PenaltyManagement/Pages/PenaltyList/Penalty";
import WorkMonitoring from "../MobileAppPages/Monitoring/Pages/WorkMonitoring/WorkMonitoring";
import LocationTracker from "../NavigatorPages/LocationTracker/locationTracker";
import Settings from "../MobileAppPages/Settings/Pages/Settings";
import AssignmentSummary from "../MobileAppPages/DailyAssignments/AssignmentSummary/Pages/AssignmentSummary/AssignmentSummary";
import DutyOn from "../MobileAppPages/DutyOn/pages/DutyOn/DutyOn";
import DutyOff from "../MobileAppPages/DutyOff/pages/DutyOff/DutyOff";
import DutyStart from "../MobileAppPages/DutyStart/pages/DutyStart";
import Reports from "../pages/Reports/Reports";
import User from "../pages/Users/Users";
import Login from "../pages/Login/login";
import ProtectedRouter from "./ProtectedRouter/ProtectedRouter";
import City from "../pages/City/City";
import Monitoring from "../pages/Monitoring/Monitoring";
import { subscribeUserPermissions } from "../services/supabaseServices";
import { supabase } from "../createClient";
import { usePermissions } from "../context/PermissionContext";
import { getUserPagesPermissions } from "../services/UserServices/UserServices";


const RouterComponent = () => {
    const navigate = useNavigate();
   let userId = localStorage.getItem('userId')
     const {permissionGranted,setPermissionGranted  
 } = usePermissions();

   useEffect(() => {
  console.log("🚀 Router realtime effect fired. userId:", userId);

  if (!userId) return;

  const channel = subscribeUserPermissions({
    userId, 
    setPermissionGranted,
  });

  return () => {
    console.log("🧹 Realtime cleanup");
    if (channel) supabase.removeChannel(channel);
  };
}, [userId]);


useEffect(() => {
  if (!userId) return;

  const fetchPermissions = async () => {
    const response = await getUserPagesPermissions(userId);

    if (response?.status === "success") {
      setPermissionGranted(response.mappedPermissions);
    }
  };

  fetchPermissions();
}, [userId]);

console.log(permissionGranted.CanAccessUserPage)

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

       <Route
  path="/Dashboard"
  element={
   
      <MainLayout>
        <Dashboard />
      </MainLayout>
  
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
          path="/duty-start"
          element={
            <ProtectedRouter>
              <DutyStart />
            </ProtectedRouter>


          }
        />
        <Route
          path="/reports"
          element={<ProtectedRouter><MainLayout /><Reports />   </ProtectedRouter>}
        />


        {/* <Route
          path="/vehicle"
          element={
            <ProtectedRouter>
              <MainLayout />
              <Vehicle />
            </ProtectedRouter>
          }
        /> */}

        <Route
          path="/monitoring"
          element={
            <ProtectedRouter>
              <MainLayout />
              <Monitoring />
            </ProtectedRouter>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRouter>
              <>
                <MainLayout />
                {
                  (Object.keys(permissionGranted).length > 0 &&
                    permissionGranted.CanAccessUserPage) ? (
                  <User />
                ) : Object.keys(permissionGranted).length === 0 ? (
                  <div>Loading...</div>
                ) : (
                  <Navigate to="/Dashboard" replace />
                )}
              </>
            </ProtectedRouter>
          }
        />
   



        <Route
          path="/cities"
          element={
            <>
              <MainLayout />
              <City />
            </>
          }
        />
      </Routes>






    </>
  );
};
const AutoLogoutComponent = ({
  loggedInempCode,
  emp_code,
  loginStatus,
  isUserActive,
  ref,
}) => {
  const navigate = useNavigate(); // Moved inside the BrowserRouter context

  useEffect(() => {
    if (
      Number(isUserActive) === 2 &&
      emp_code === loggedInempCode &&
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
