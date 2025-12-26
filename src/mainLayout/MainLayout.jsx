import React from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "./Topbar";

const MainLayout = () => {
    return (
        <>
            <Topbar />
        </>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
