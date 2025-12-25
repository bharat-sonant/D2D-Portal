import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import RouterComponent from './router/RouterComponent';
import 'react-toastify/dist/ReactToastify.css';
import globleStyles from "./assets/css/globleStyles.module.css";
import "../src/assets/css/style.css";
import { CityProvider } from './context/CityContext';
import { LoginProvider } from './context/LoginContext';

const AppWrapper = () => {
  const location = useLocation();
  // jis page me mobile frame remove karna hai
  const noFrameRoutes = ['/settings', '/tasks', '/realtime-monitoring', '/reports', '/vehicle', '/TaskData', '/users', '/', '/cities', "/Dashboard", "/monitoring"]; // <-- yaha route add karo

  const shouldRemoveFrame = noFrameRoutes.includes(location.pathname);

  return (
    <div className={shouldRemoveFrame ? '' : globleStyles.mobileFrame}>
      <RouterComponent />
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
