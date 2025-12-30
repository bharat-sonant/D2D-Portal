import { images } from "../../assets/css/imagePath";
import style from "../../assets/css/City/wardList.module.css";
import AddVehicles from "../../MobileAppPages/Vehicles/Components/Vehicles/AddVehicles";
import { useEffect, useState } from "react";
import * as action from "../../Actions/VehiclesAction/VehiclesAction";
import VehicleList from "../../MobileAppPages/Vehicles/Components/Vehicles/VehicleList";
import VehicleHistoryData from "../../MobileAppPages/Vehicles/Components/VehicleHistory/VehicleHistoryData";
import DeleteConfirmation from "../../MobileAppPages/Tasks/Components/DeleteConfirmation/DeleteConfirmation";

const AddVehiclesCard = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  const [chassisNo, setChassisNo] = useState('');
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [canvasModal, setCanvasModal] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [vehicleHistory, setVehicleHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  // 🔄 Fetch vehicle list
  const fetchVehicles = () => {
    if (props.selectedCity) {
      action.getVehicles(setVehicleList, setLoading, props.selectedCity.CityId);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [props.selectedCity]);

  // 📜 Fetch history
  const historyData = () => {
    if (selectedVehicleId) {
      action.getHistoryData(selectedVehicleId, setVehicleHistory);
    }
  };

  // 📄 Fetch vehicle details on selection
  useEffect(() => {
    if (selectedVehicleId) {
      action.vehicleDetails(selectedVehicleId, setVehicleDetails);
      historyData();
    }
  }, [selectedVehicleId]);

  // ✅ Row click → ONLY select vehicle
  const handleVehicleSelect = (item) => {
    setSelectedVehicleId(item.id);
  };

  // ✅ 3-dot click → open sidebar
  const handleEditIconClick = (item) => {
    setSelectedVehicleId(item.id);
    setCanvasModal(true);
  };

  // ✏ Edit from sidebar
  const handleEditClick = () => {
    setCanvasModal(false);
    setShowModal(true);
    setShowHistory(false);
    setVehicleName(vehicleDetails?.vehicles_No || '');
    setChassisNo(vehicleDetails?.chassis_no || '');
    setVehicleId(vehicleDetails?.id);
  };

  // 🗑 Delete flow
  const handleDeleteVehicle = () => {
    setCanvasModal(false);
    setConfirmModal(true);
    setShowHistory(false);
  };

  const confirmDelete = () => {
    action.deleteVehicle(
      vehicleDetails?.id,
      setVehicleList,
      setConfirmModal,
      setSelectedVehicleId,
      setVehicleDetails
    );
  };

  return (
    <div className={style.Detailscard} style={{ marginTop: '0px' }}>
      <div className={style.card_header}>
        <h5 className={style.heading}>Add Vehicles</h5>
        <div className="d-flex justify-content-center align-items-center">
          <button
            className={`btn ${style.custom_AddDesignation_btn} p-0`}
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
      </div>

      {/* 🚗 Vehicle List */}
      <div className={style.Scroll_List}>
        <VehicleList
          vehicleList={vehicleList}
          loading={loading}
          selectedVehicleId={selectedVehicleId}
          isEmbedded={true}
          onSelectVehicle={handleVehicleSelect} // row click
          onEditVehicle={handleEditIconClick}   // 3-dot click
        />
      </div>

      {/* ➕ Add / Edit Vehicle Modal */}
      <AddVehicles
        showModal={showModal}
        setShowModal={setShowModal}
        vehicleName={vehicleName}
        setVehicleName={setVehicleName}
        chassisNo={chassisNo}
        setChassisNo={setChassisNo}
        setVehicleList={setVehicleList}
        vehicleId={vehicleId}
        setVehicleDetails={setVehicleDetails}
        setVehicleId={setVehicleId}
        vehicleList={vehicleList}
        selectedCity={props.selectedCity}
      />

      {/* 📂 Vehicle History Sidebar */}
      <VehicleHistoryData
        canvasModal={canvasModal}
        vehicleDetails={vehicleDetails}
        onHide={() => setCanvasModal(false)}
        onEditClick={handleEditClick}
        setVehicleDetails={setVehicleDetails}
        setVehicleList={setVehicleList}
        setSelectedVehicleId={setSelectedVehicleId}
        handleDelete={handleDeleteVehicle}
        vehicleHistory={vehicleHistory}
        historyData={historyData}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />

      {/* ❌ Delete Confirmation */}
      <DeleteConfirmation
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={confirmDelete}
        itemName={vehicleDetails?.vehicles_No || "this vehicle"}
      />
    </div>
  );
};

export default AddVehiclesCard;
