import styles from "./AddVehiclesCard.module.css";
import AddVehicles from "../../MobileAppPages/Vehicles/Components/Vehicles/AddVehicles";
import GlobalStyles from "../../assets/css/globalStyles.module.css";
import { useEffect, useState } from "react";
import * as action from "../../Actions/VehiclesAction/VehiclesAction";
import VehicleList from "../../MobileAppPages/Vehicles/Components/Vehicles/VehicleList";
import VehicleHistoryData from "../../MobileAppPages/Vehicles/Components/VehicleHistory/VehicleHistoryData";
import DeleteConfirmation from "../../MobileAppPages/Tasks/Components/DeleteConfirmation/DeleteConfirmation";
import { useMemo } from "react";

const AddVehiclesCard = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [vehicleName, setVehicleName] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [canvasModal, setCanvasModal] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [vehicleHistory, setVehicleHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // 🔄 Fetch vehicle list
  const fetchVehicles = () => {
    if (props.selectedCity) {
      action.getVehicles(
        setVehicleList,
        setLoading,
        props.selectedCity.site_id
      );
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
    setVehicleName(vehicleDetails?.vehicles_No || "");
    setChassisNo(vehicleDetails?.chassis_no || "");
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
  const filteredVehicles = useMemo(() => {
    return [...vehicleList]
      .filter((vehicle) =>
        vehicle.vehicles_No?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a.status === "inactive" && b.status !== "inactive") return 1;
        if (a.status !== "inactive" && b.status === "inactive") return -1;
        return 0;
      });
  }, [vehicleList, searchTerm]);

  return (
    <div className={styles.vehicleList}>
      <div className={styles.cardHeader}>
        <h5 className={styles.heading}>Vehicles</h5>
        <div className="d-flex justify-content-center align-items-center">
          <button
            className={`btn ${styles.custom_AddDesignation_btn} p-0`}
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
      </div>
      {/* Search */}
      <input
        className={GlobalStyles.inputSearch}
        type="text"
        placeholder="Search vehicle..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* 🚗 Vehicle List */}
      <div className={styles.scrollList}>
        <VehicleList
          vehicleList={filteredVehicles}
          loading={loading}
          selectedVehicleId={selectedVehicleId}
          isEmbedded={true}
          onSelectVehicle={handleVehicleSelect} // row click
          onEditVehicle={handleEditIconClick} // 3-dot click
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
