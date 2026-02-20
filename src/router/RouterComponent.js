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
import DailyReport from "../pages/DailyReport/DailyReport";

// Employee section pages
import EmployeeDashboard from "../EmployeeManagement/pages/EmployeeDashboard";
import Employees from "../EmployeeManagement/pages/Employees";
import Branches from "../EmployeeManagement/pages/Branches";
import Departments from "../EmployeeManagement/pages/Department/Departments";
import OfficeDashboard from "../MobileAppPages/MyOffice/Pages/Dashboard/Dashboard";
import FuelManagementLayout from "../mainLayout/FuelManagementLayout";
import FieldEmployees from "../FuelManagement/pages/FieldEmployees";
import FuelAnalysis from "../FuelManagement/pages/FuelAnalysis/FuelAnalysis";
import MobileAppsRoutes from "./MobileAppsRoutes";
import FuelEntries from "../FuelManagement/pages/FuelEntries/FuelEntries";
import FE_Dashboard from "../FieldTrackingManagement/Pages/FE-Dashboard/FE_Dashboard";
import FETracking from "../FieldTrackingManagement/Pages/FETracking/FETracking";
import FEReports from "../FieldTrackingManagement/Pages/FEReports/FEReports";
import FETasks from "../FieldTrackingManagement/Pages/FETasks/FETasks";
import FEAnalysis from "../FieldTrackingManagement/Pages/FEAnalysis/FEAnalysis";
import FE_Layout from "../FieldTrackingManagement/Layout/FE_Layout";
import FEAssignments from "../FieldTrackingManagement/Pages/FEAssignments/FEAssignments";
import FuelReport from "../FuelManagement/pages/FuelReport/FuelReport";
import FEUsers from "../FieldTrackingManagement/Pages/FEEmployees/FEUsers";
import D2DMonitoringLayout from "../mainLayout/D2DMonitoringLayout/D2DMonitoringLayout";
import D2DMonitoringDashboard from "../D2DMonitoring/Pages/Dashboard/D2DMonitoringDashboard";
import D2DReports from "../D2DMonitoring/Pages/D2DReports/Reports";
import D2DRealtime from "../D2DMonitoring/Pages/D2DRealtime/Realtime";
import D2DMonitoring from "../D2DMonitoring/Pages/D2DMonitoring/Monitoring";


const RouterComponent = () => {
  const navigate = useNavigate();

  let userId = localStorage.getItem('userId');
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

        <Route path="/d2dMonitoring/dashboard" element={
          <ProtectedRouter>
            <D2DMonitoringLayout>
              <D2DMonitoringDashboard />
            </D2DMonitoringLayout>
          </ProtectedRouter>
        } />

        <Route path="/d2dMonitoring/realtime" element={
          <ProtectedRouter>
            <D2DMonitoringLayout>
              <D2DRealtime />
            </D2DMonitoringLayout>
          </ProtectedRouter>
        } />

        <Route path="/d2dMonitoring/report" element={
          <ProtectedRouter>
            <D2DMonitoringLayout>
              <D2DReports />
            </D2DMonitoringLayout>
          </ProtectedRouter>
        } />

        <Route path="/d2dMonitoring/monitoring" element={
          <ProtectedRouter>
            <D2DMonitoringLayout>
              <D2DMonitoring />
            </D2DMonitoringLayout>
          </ProtectedRouter>
        } />

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
        <Route
          path="/fuel/add_fuel_entries"
          element={
            <ProtectedRouter>
              <FuelManagementLayout />
              <FuelEntries />
            </ProtectedRouter>
          }
        />
        <Route
          path="/fuel/fuel_report"
          element={
            <ProtectedRouter>
              <FuelManagementLayout />
              <FuelReport />
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
        {/* <Route
          path="/Settings"
          element={
            <ProtectedRouter>
              <MainLayout />
              <Settings />
            </ProtectedRouter>
          }
        /> */}

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
        <Route
          path="/daily-report"
          element={<ProtectedRouter><MainLayout /><DailyReport /></ProtectedRouter>}
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
          path="/user"
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
          path="/sites"
          element={
            <>
              <MainLayout />
              <City />
            </>
          }
        />
        <Route path='MyOfficeDashboard' element={<OfficeDashboard />} />
        {/* ================= FIELD EXECUTIVE ROUTES ================= */}

        <Route
          path="/field-executive/dashboard"
          element={
            <ProtectedRouter>
              <FE_Layout>
                <FE_Dashboard />
              </FE_Layout>
            </ProtectedRouter>
          }
        />

        <Route
          path="/field-executive/users"
          element={
            <ProtectedRouter>
              <FE_Layout>
                <FEUsers />
              </FE_Layout>
            </ProtectedRouter>
          }
        />

        <Route
          path="/field-executive/tracking"
          element={
            <ProtectedRouter>
              <FE_Layout>
                <FETracking />
              </FE_Layout>
            </ProtectedRouter>
          }
        />

        <Route
          path="/field-executive/reports"
          element={
            <ProtectedRouter>
              <FE_Layout>
                <FEReports />
              </FE_Layout>
            </ProtectedRouter>
          }
        />

        <Route
          path="/field-executive/tasks"
          element={
            <ProtectedRouter>
              <FE_Layout>
                <FETasks />
              </FE_Layout>
            </ProtectedRouter>
          }
        />

        <Route
          path="/field-executive/analysis"
          element={
            <ProtectedRouter>
              <FE_Layout>
                <FEAnalysis />
              </FE_Layout>
            </ProtectedRouter>
          }
        />
        <Route
          path="/field-executive/assignments"
          element={
            <ProtectedRouter>
              <FE_Layout>
                <FEAssignments />
              </FE_Layout>
            </ProtectedRouter>
          }
        />

        <>
          {MobileAppsRoutes()}
        </>
      </Routes>
    </>
  );
};


export default RouterComponent;
//showUpdateNotification
