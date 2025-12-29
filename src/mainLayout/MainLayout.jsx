import { useState } from "react";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import Topbar from "./Topbar";
import DefaultCitySelection from "../components/DefaultCitySelection/DefaultCitySelection";

const MainLayout = () => {
    const [showDefaultCity,setShowDefaultCity] = useState(JSON.parse(localStorage.getItem('defaultCity'))?false:true);
    return (
      <>
        <Topbar setShowDefaultCity={setShowDefaultCity}/>
        {showDefaultCity && (
          <DefaultCitySelection
            onClose={() => setShowDefaultCity(false)}
          />
        )}
      </>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};

export default MainLayout;
