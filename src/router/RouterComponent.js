import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainLayout from "../mainLayout/MainLayout";
import EmployeeLayout from "../mainLayout/EmployeeLayout";
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
import MyOfficeLogin from "../MobileAppPages/MyOffice/Pages/Login/Login";

// Employee section pages
import EmployeeDashboard from "../EmployeeManagement/pages/EmployeeDashboard";
import Employees from "../EmployeeManagement/pages/Employees";
import Branches from "../EmployeeManagement/pages/Branches";
import Departments from "../EmployeeManagement/pages/Departments";
import OfficeDashboard from "../MobileAppPages/MyOffice/Pages/Dashboard/Dashboard";
import FuelManagementLayout from "../mainLayout/FuelManagementLayout";
import FieldEmployees from "../FuelManagement/pages/FieldEmployees";
import FuelAnalysis from "../FuelManagement/pages/FuelAnalysis/FuelAnalysis";


const RouterComponent = () => {
  const navigate = useNavigate();

  let userId = localStorage.getItem('userId')
  const { permissionGranted, setPermissionGranted
  } = usePermissions();

  useEffect(() => {
    if (!userId) return;
    const channel = subscribeUserPermissions({
      userId,
      setPermissionGranted,
    });
    return () => {
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


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<><MyOfficeLogin /></>} />

        <Route
          path="/Dashboard"
          element={
            <>
              <MainLayout />
              <Dashboard />
            </>
          }
        />

        {/* Employee Management Section */}
        <Route path="/employee/dashboard" element={<ProtectedRouter><EmployeeLayout><EmployeeDashboard /></EmployeeLayout></ProtectedRouter>} />
        <Route path="/employee/employees" element={<ProtectedRouter><EmployeeLayout><Employees /></EmployeeLayout></ProtectedRouter>} />
        <Route path="/employee/branches" element={<ProtectedRouter><EmployeeLayout><Branches /></EmployeeLayout></ProtectedRouter>} />
        <Route path="/employee/departments" element={<ProtectedRouter><EmployeeLayout><Departments /></EmployeeLayout></ProtectedRouter>} />

        {/*Fuel Management Section*/}
        <Route
          path="/fuel/add-field-employee"
          element={
            <ProtectedRouter>
              <FuelManagementLayout />
              <FieldEmployees />
            </ProtectedRouter>
          }
        />
        <Route
          path="/fuel/fuel_analysis"
          element={
            <ProtectedRouter>
              <FuelManagementLayout />
              <FuelAnalysis />
            </ProtectedRouter>
          }
        />

        {/* Redirect old path */}
        <Route path="/employee-management" element={<Navigate to="/employee/dashboard" replace />} />

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
                {(Object.keys(permissionGranted).length > 0 &&
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
        <Route path='MyOfficeDashboard' element={<OfficeDashboard />} />
      </Routes>
    </>
  );
};


export default RouterComponent;
//showUpdateNotification
