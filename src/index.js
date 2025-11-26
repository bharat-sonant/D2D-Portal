// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import { BrowserRouter } from 'react-router-dom';
// import RouterComponent from './router/RouterComponent';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import globleStyles from "./assets/css/globleStyles.module.css";
// import "../src/assets/css/style.css";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//       <div className={globleStyles.mobileFrame}>
//   <BrowserRouter>
//         <RouterComponent />
//         <ToastContainer
//           position="bottom-center"
//           autoClose={1500}
//           hideProgressBar
//           closeOnClick
//           pauseOnHover={false}
//           draggable={false}
//           theme="dark"
//           closeButton={false}
//           toastClassName="compact-toast"
//           bodyClassName="compact-toast-body"
//         />
//   </BrowserRouter>
//   </div>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import RouterComponent from './router/RouterComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import globleStyles from "./assets/css/globleStyles.module.css";
import "../src/assets/css/style.css";

function AppWrapper() {
  const location = useLocation();

  // jis page me mobile frame remove karna hai
  const noFrameRoutes = ['/settings', '/daily-assignment']; // <-- yaha route add karo

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
    <AppWrapper />
  </BrowserRouter>
);
