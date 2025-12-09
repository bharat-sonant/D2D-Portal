import { useEffect, useState } from 'react';
import styles from '../../Styles/Vehicle/Vehicle.module.css';
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import VehicleList from '../../Components/Vehicles/VehicleList';
import AddVehicles from '../../Components/Vehicles/AddVehicles';
import * as action from '../../Action/VehicleList/VehicleListAction';
import VehicleDetails from '../../Components/Vehicles/VehicleDetails';
import { LucideSettings } from 'lucide-react';
import VehicleHistoryData from '../../Components/VehicleHistory/VehicleHistoryData';

const Vehicle = () => {
    const [showModal, setShowModal] = useState(false);
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleList, setVehicleList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vehicleId, setVehicleId] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [canvasModal, setCanvasModal] = useState(false);

    useEffect(() => {
        action.getVehicles(setVehicleList, setLoading);
    }, [])

    useEffect(() => {
        if (vehicleList.length > 0 && !vehicleId) {
            setVehicleId(vehicleList[0].vehicleId);
        };
    }, [vehicleList]);

    useEffect(() => {
        if (vehicleId) {
            action.vehicleDetails(vehicleId, setVehicleDetails);
        };
    }, [vehicleId])

    const handleOpen = () => {
        setShowModal(true);
    }

    const handleVehicleSelection = (item) => {
        setVehicleId(item.vehicleId);
    };

    const handleOpenCanvas = () => {
        setCanvasModal(true);
    };

    const handleCanvasOff = () => {
        setCanvasModal(false);
    }

    return (
        <>
            {vehicleId && (
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
                        vehicleId={vehicleId}
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
                />
            </div>
            <VehicleHistoryData
                canvasModal={canvasModal}
                vehicleDetails={vehicleDetails}
                onHide={handleCanvasOff}
            />
            {/* <HistoryData
                openCanvas={openCanvas}
                onHide={onHideCanvas}
                taskHistory={taskHistory}
                onEditClick={handleClickEdit}
                handleDelete={handleDelete}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                setTaskList={setTaskList}
                setSelectedTaskId={setSelectedTaskId}
                getHistory={getHistory}

            /> */}

            {/* <DeleteConfirmation
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={selectedTask?.name || "this task"}
            /> */}
        </>
    )
}

export default Vehicle