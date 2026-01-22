import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import RouterComponent from './router/RouterComponent';
import 'react-toastify/dist/ReactToastify.css';
import globleStyles from "./assets/css/globleStyles.module.css";
import "../src/assets/css/style.css";
import { CityProvider } from './context/CityContext';
import { LoginProvider } from './context/LoginContext';
import { ToastContainer } from 'react-toastify';
import { PermissionProvider } from './context/PermissionContext';

const AppWrapper = () => {
  const location = useLocation();
  // jis page me mobile frame remove karna hai
  const noFrameRoutes = ['/settings', '/tasks', '/realtime-monitoring', '/reports', '/vehicle', '/users', '/', '/cities', "/Dashboard", "/monitoring","/employee/dashboard","/employee/employees","/employee/branches","/employee/departments", '/fuel/add-field-employee', '/fuel/fuel_analysis',"/fe-WebView/login","/fe-WebView/dashboard", "/fuel/add_fuel_entries"]; // <-- yaha route add karo

  const shouldRemoveFrame = noFrameRoutes.includes(location.pathname);

  return (
    <div className={shouldRemoveFrame ? '' : globleStyles.mobileFrame}>
      <RouterComponent />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
   <PermissionProvider>
    <CityProvider>
      <LoginProvider>
        <AppWrapper />
      </LoginProvider>
    </CityProvider>
    </PermissionProvider>
  </BrowserRouter>
);
