import { useEffect, useState } from 'react';
import styles from '../../Styles/Vehicle/Vehicle.module.css';
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import VehicleList from '../../Components/Vehicles/VehicleList';
import AddVehicles from '../../Components/Vehicles/AddVehicles';
import * as action from '../../Action/VehicleList/VehicleListAction';
import VehicleDetails from '../../Components/Vehicles/VehicleDetails';
import { LucideSettings } from 'lucide-react';
import VehicleHistoryData from '../../Components/VehicleHistory/VehicleHistoryData';
import DeleteConfirmation from '../../../Tasks/Components/DeleteConfirmation/DeleteConfirmation';
import { deleteVehicle } from '../../Action/AddVehicle/AddVehicleAction';

const Vehicle = () => {
    const [showModal, setShowModal] = useState(false);
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleList, setVehicleList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [canvasModal, setCanvasModal] = useState(false);
    const [vehicleId, setVehicleId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(false);
    const [vehicleHistory, setVehicleHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        action.getVehicles(setVehicleList, setLoading);
    }, [])

    useEffect(() => {
        if (vehicleList.length > 0 && !selectedVehicleId) {
            setSelectedVehicleId(vehicleList[0].vehicleId);
        };
    }, [vehicleList]);

    useEffect(() => {
        if (selectedVehicleId) {
            action.vehicleDetails(selectedVehicleId, setVehicleDetails);
            historyData();
        };
    }, [selectedVehicleId]);

    const historyData = () => {
        action.getHistoryData(selectedVehicleId, setVehicleHistory)
    }

    const handleOpen = () => {
        setShowModal(true);
    }

    const handleVehicleSelection = (item) => {
        setSelectedVehicleId(item.vehicleId);
    };

    const handleOpenCanvas = () => {
        setCanvasModal(true);
    };

    const handleCanvasOff = () => {
        setCanvasModal(false);
    }

    const handleEditClick = () => {
        setCanvasModal(false);
        setShowModal(true);
        setShowHistory(false);
        setVehicleName(vehicleDetails?.name);
        setVehicleId(vehicleDetails?.vehicleId);
    };

    const handleDeleteVehicle = () => {
        setCanvasModal(false);
        setConfirmModal(true);
        setShowHistory(false);
    }

    const confirmDelete = () => {
        deleteVehicle(
            vehicleDetails?.vehicleId,
            setVehicleList,
            setConfirmModal,
            setSelectedVehicleId,
            setVehicleDetails
        );
    }

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
                            <VehicleDetails
                                vehicleDetails={vehicleDetails}
                            />
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
                    setVehicleList={setVehicleList}
                    vehicleId={vehicleId}
                    setVehicleDetails={setVehicleDetails}
                    setVehicleId={setVehicleId}
                    historyData={historyData}
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
                itemName={vehicleDetails?.name || "this vehicle"}
            />
        </>
    )
}

export default Vehicle