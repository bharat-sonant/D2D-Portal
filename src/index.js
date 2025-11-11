import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import RouterComponent from './router/RouterComponent';
import { PermissionProvider } from './context/PermissionContext';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./assets/css/style.css";
import globleStyles from "./assets/css/globleStyles.module.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <div className={globleStyles.mobileFrame}>
  <BrowserRouter>
    <Provider store={store}>
      <PermissionProvider>
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
      </PermissionProvider>
    </Provider>
  </BrowserRouter>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
