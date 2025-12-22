import { useEffect, useState } from 'react';
import styles from '../../Styles/Vehicle/Vehicle.module.css';
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import VehicleList from '../../Components/Vehicles/VehicleList';
import AddVehicles from '../../Components/Vehicles/AddVehicles';
import * as action from '../../../../Actions/VehiclesAction/VehiclesAction';
import VehicleDetails from '../../Components/Vehicles/VehicleDetails';
import { LucideSettings } from 'lucide-react';
import VehicleHistoryData from '../../Components/VehicleHistory/VehicleHistoryData';
import DeleteConfirmation from '../../../Tasks/Components/DeleteConfirmation/DeleteConfirmation';

const Vehicle = () => {
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

    /* =========================
       Fetch Vehicles
    ========================= */
    const fetchVehicles = () => {
        action.getVehicles(setVehicleList, setLoading);
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (vehicleList.length > 0 && !selectedVehicleId) {
            setSelectedVehicleId(vehicleList[0].id);
        }
    }, [vehicleList]);

    useEffect(() => {
        if (selectedVehicleId) {
            action.vehicleDetails(selectedVehicleId, setVehicleDetails);
            historyData();
        }
    }, [selectedVehicleId]);

    const historyData = () => {
        action.getHistoryData(selectedVehicleId, setVehicleHistory);
    };

    const handleOpen = () => setShowModal(true);

    const handleVehicleSelection = (item) => {
        setSelectedVehicleId(item.id);
    };

    const handleOpenCanvas = () => setCanvasModal(true);
    const handleCanvasOff = () => setCanvasModal(false);

    const handleEditClick = () => {
        setCanvasModal(false);
        setShowModal(true);
        setShowHistory(false);
        setVehicleName(vehicleDetails?.vehicles_No || '');
        setChassisNo(vehicleDetails?.chassis_no || '');
        setVehicleId(vehicleDetails?.id);
    };

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
        <>
            {selectedVehicleId && (
                <div className={`${GlobalStyles.floatingDiv}`} style={{ bottom: "90px" }}>
                    <button
                        className={`${GlobalStyles.floatingBtn}`}
                        onClick={handleOpenCanvas}
                    >
                        <LucideSettings style={{ position: 'relative', bottom: '3px' }} />
                    </button>
                </div>
            )}

            <div className={`${GlobalStyles.floatingDiv}`}>
                <button
                    className={`${GlobalStyles.floatingBtn}`}
                    onClick={handleOpen}
                >
                    +
                </button>
            </div>

            <div className={`${styles.employeePage}`}>
                <div className={`${styles.employeeLeft}`}>
                    <VehicleList
                        vehicleList={vehicleList}
                        loading={loading}
                        onSelectVehicle={handleVehicleSelection}
                        selectedVehicleId={selectedVehicleId}
                    />
                </div>

                <div className={`${styles.employeeRight}`}>
                    <div className={`row g-0`}>
                        <div className={`col-md-5 ${GlobalStyles.pStart} ${GlobalStyles.pMobile}`}>
                            <VehicleDetails vehicleDetails={vehicleDetails} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={GlobalStyles.mainSections}>
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
                    fetchVehicles={fetchVehicles}
                    historyData={historyData}
                    vehicleList={vehicleList}
                />
            </div>

            <VehicleHistoryData
                canvasModal={canvasModal}
                vehicleDetails={vehicleDetails}
                onHide={handleCanvasOff}
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

            <DeleteConfirmation
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={confirmDelete}
                itemName={vehicleDetails?.vehicles_No || "this vehicle"}
            />
        </>
    );
};

export default Vehicle; 