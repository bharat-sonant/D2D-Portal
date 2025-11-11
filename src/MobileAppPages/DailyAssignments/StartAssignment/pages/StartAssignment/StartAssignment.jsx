import React, { useEffect, useState } from "react";
import styles from "../../styles/StartAssignment.module.css";
import { useLocation } from "react-router-dom";
import { fetchAllVehicles, startAssignmentAction } from "../../actions/StartAssignmentActions/StartAssignment";
import { getCityFirebaseConfig } from "../../../../../configurations/cityDBConfig";
import { connectFirebase } from "../../../../../firebase/firebaseService";
import { startAssignment } from "../../services/StartAssignmentService/StartAssignment";
import * as common from '../../../../../common/common'
import { ArrowDownNarrowWide, ArrowLeft, ChevronDown, Plus, Truck } from "lucide-react";
import { GraphDownArrow } from "react-bootstrap-icons";

const StartAssignment = () => {
  const [vehicles, setVehicles] = useState([]);
   const [activeVehicles, setActiveVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [driverId, setDriverId] = useState('')
  const [driverDeviceId, setDriverDeviceId] = useState('')
  const [helperId, setHelperID] = useState('');
  const [helperDeviceId, setHelperDeviceId] = useState('')
   const [driverHelperImage, setDriverHelperImage] = useState(null);
  const [vehicleMeterImage, setVehicleMeterImage] = useState(null);
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search);
   const ward = queryParams.get("ward") || "N/A";
  const user = queryParams.get("user") || "N/A";
  const city = queryParams.get("city") || "DevTest"; 

  useEffect(() => {
    if (city) {
      localStorage.setItem("city", city);

      let config = getCityFirebaseConfig(city);
      connectFirebase(config, city)
    } else {
      localStorage.setItem("city", "DevTest");
      console.warn("⚠️ No city found, defaulting to DevTest");
    }
  }, [city]);

  useEffect(() => {
    fetchAllVehicles(setVehicles, setLoading, setActiveVehicles);
  }, []);


  const handleVehicleChange = (e)=> {
    setSelectedVehicle(e.target.value);
  }

  // const activeVehicles = vehicles.filter(
  //   (v) => String(v.status) === "1" 
  // );

  const handleSubmit = async () => {
    if (!selectedVehicle) {
      common.setAlertMessage("error", "Please select a Vehicle !");
      return;
    }
      const result = await startAssignmentAction(selectedVehicle, ward);
    
    if (result.status === "success") {
      setSelectedVehicle("");
      setActiveVehicles((prev) =>
      prev.filter((v) => v.vehcileNo !== selectedVehicle)
    );
    }
  };

   const handleBack = () => {
    window.history.back();
  };

  const handleAddHelper = () => {
    console.log('Add helper clicked');
    // Add your logic here
  };

  const handleAddOpenDepot = () => {
    console.log('Add open depot clicked');
    // Add your logic here
  };

  const handleDriverHelperImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDriverHelperImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVehicleMeterImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleMeterImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


//  return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h2 className={styles.title}>Start Assignment</h2>

//         <div className={styles.details}>
//           <div className={styles.detailRow}>
//             <span className={styles.label}>City:</span>
//             <span className={styles.value}>{city}</span>
//           </div>
//           <div className={styles.detailRow}>
//             <span className={styles.label}>Ward:</span>
//             <span className={styles.value}>{ward}</span>
//           </div>
//           <div className={styles.detailRow}>
//             <span className={styles.label}>User:</span>
//             <span className={styles.value}>{user}</span>
//           </div>
//         </div>

//         <div className={styles.dropdownContainer}>
//           <label className={styles.dropdownLabel} htmlFor="vehicle-select">
//             Select Vehicle
//           </label>
//           {loading ? (
//             <div className={styles.loadingText}>Loading vehicles...</div>
//           ) : (
//             <select
//             key={selectedVehicle}
//               id="vehicle-select"
//               className={styles.dropdown}
//               value={selectedVehicle}
//               onChange={handleVehicleChange}
//             >
//               <option value="">-- Choose a vehicle --</option>
//               {activeVehicles?.map((vehicle, index) => (
//                 <option key={index} value={vehicle?.vehcileNo}>
//                   {vehicle.vehcileNo || 'N/A'} 
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>
//         <button
//           className={styles.startButton}
//           onClick={handleSubmit}
//           disabled={!selectedVehicle}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };
// export default StartAssignment;


return (
  <div className={styles.pageContainer}>
    {/* Green Header */}
    <div className={styles.header}>
      <button className={styles.backButton} onClick={handleBack}>
        <ArrowLeft />
      </button>
      <h1 className={styles.headerTitle}>Ward {ward}</h1>
    </div>

    <div className={styles.contentContainer}>
      {/* Vehicle Selection Card */}
      <div className={styles.vehicleCard}>
        {loading ? (
          <div className={styles.loadingText}>Loading vehicles...</div>
        ) : (
          <div className={styles.dropdownWrapper}>
            <div className={styles.dropdownDisplay}>
              <div className={styles.leftGroup}>
                <Truck color="#22c55e" size={24} className={styles.truckIcon} />
                <span className={styles.vehicleLabel}>
                  {selectedVehicle || "Select vehicle"}
                </span>
              </div>
              <ChevronDown className={styles.dropdownIcon} />
            </div>

            <select
              className={styles.vehicleDropdown}
              value={selectedVehicle}
              onChange={handleVehicleChange}
            >
              <option value="">-- Choose a vehicle --</option>
              {activeVehicles?.map((vehicle, index) => (
                <option key={index} value={vehicle?.vehcileNo}>
                  {vehicle.vehcileNo || "N/A"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>



       <div className={styles.idFieldsCard}>
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Driver ID</label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          />
        </div>
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Device ID</label>
          <div className={styles.deviceInputWrapper}>
            <span className={styles.devicePrefix}>DEV</span>
            <input
              type="text"
              className={styles.deviceInput}
              placeholder="Device ID"
              value={driverDeviceId}
              onChange={(e) => setDriverDeviceId(e.target.value)}
            />
          </div>
        </div>

      {/* Helper and Device ID Fields */}
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Helper ID</label>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Enter Employee ID"
            value={helperId}
            onChange={(e) => setHelperID(e.target.value)}
          />
        </div>
        <div className={styles.fieldColumn}>
          <label className={styles.fieldLabel}>Device ID</label>
          <div className={styles.deviceInputWrapper}>
            <span className={styles.devicePrefix}>DEV</span>
            <input
              type="text"
              className={styles.deviceInput}
              placeholder="Device ID"
              value={helperDeviceId}
              onChange={(e) => setHelperDeviceId(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button className={styles.addButton} onClick={handleAddHelper}>
          <Plus size={16}/>
          Add helper
        </button>
        <button className={styles.addButton} onClick={handleAddOpenDepot}>
          <Plus size={16}/>
          Add Open Depot
        </button>
      </div>

      {/* Camera Upload Section - Driver and Helper */}
      <div className={styles.cameraCard}>
        <div className={styles.cameraLabel}>कृपया DRIVER AND HELPER की फोटो खींचे |</div>
        <label className={styles.cameraBox}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleDriverHelperImageUpload}
            style={{ display: "none" }}
          />
          {driverHelperImage ? (
            <img src={driverHelperImage} alt="Driver and Helper" className={styles.uploadedImage} />
          ) : (
            <svg className={styles.cameraIcon} width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="#374151"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="12" cy="13" r="4" stroke="#374151" strokeWidth="1.5" fill="none" />
              <path d="M16 7h2" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </label>
      </div>

      {/* Camera Upload Section - Vehicle Meter */}
      <div className={styles.cameraCard}>
        <div className={styles.cameraLabel}>कृपया VEHICLE के METER की फोटो खींचे |</div>
        <label className={styles.cameraBox}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleVehicleMeterImageUpload}
            style={{ display: "none" }}
          />
          {vehicleMeterImage ? (
            <img src={vehicleMeterImage} alt="Vehicle Meter" className={styles.uploadedImage} />
          ) : (
            <svg className={styles.cameraIcon} width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="#374151"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="12" cy="13" r="4" stroke="#374151" strokeWidth="1.5" fill="none" />
              <path d="M16 7h2" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </label>
      </div>

      {/* Continue Button */}
      <button
        className={styles.continueButton}
        onClick={handleSubmit}
        disabled={!selectedVehicle}
      >
        CONTINUE
      </button>
    </div>
  </div>
);
};

export default StartAssignment;