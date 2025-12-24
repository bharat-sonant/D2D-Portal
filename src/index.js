import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import RouterComponent from './router/RouterComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import globleStyles from "./assets/css/globleStyles.module.css";
import "../src/assets/css/style.css";
import { CityProvider } from './context/CityContext';
import { LoginProvider } from './context/LoginContext';

const AppWrapper=() =>{
  const location = useLocation();
  // jis page me mobile frame remove karna hai
  const noFrameRoutes = ['/settings', '/daily-assignment', '/tasks', '/realtime-monitoring', '/reports', '/vehicle','/TaskData','/users','/','/cities',"/Dashboard"]; // <-- yaha route add karo

  const shouldRemoveFrame = noFrameRoutes.includes(location.pathname);

  return (
    <div className={shouldRemoveFrame ? '' : globleStyles.mobileFrame}>
      <RouterComponent />
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="dark"
        closeButton={false}
        toastClassName="compact-toast"
        bodyClassName="compact-toast-body"
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <CityProvider>
      <LoginProvider>
        <AppWrapper />
      </LoginProvider>
    </CityProvider>
  </BrowserRouter>
);
