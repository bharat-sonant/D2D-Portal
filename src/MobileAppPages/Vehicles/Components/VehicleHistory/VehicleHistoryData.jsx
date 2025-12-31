import { Offcanvas } from 'react-bootstrap';
import style from '../../Styles/VehicleHistoryData/VehicleHistory.module.css';
import { Calendar, User, Edit2, Trash2, History, Info } from 'lucide-react';
import { images } from '../../../../assets/css/imagePath';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { formatEvent, ActiveInactiveVehicles } from '../../../../Actions/VehiclesAction/VehiclesAction';
import StatusConfirmation from '../../../Tasks/Components/StatusConfirmation/StatusConfirmation';

const VehicleHistoryData = (props) => {
    const [toggle, setToggle] = useState(props.vehicleDetails?.status === "active");
    const [showStatusConfirm, setShowStatusConfirm] = useState(false);

    useEffect(() => {
        if (props.vehicleDetails) {
            setToggle(props.vehicleDetails?.status?.toLowerCase() === "active");
        }
    }, [props.vehicleDetails?.status]);

    const handleToggleClick = (e) => {
        e.preventDefault();
        setShowStatusConfirm(true);
    };

    const confirmStatusChange = () => {
        // ActiveInactiveVehicles expects (props, setToggle, toggle)
        // It toggles internally based on the current 'toggle' value passing in.
        ActiveInactiveVehicles(props, setToggle, toggle);
        setShowStatusConfirm(false);
    };

    return (
        <>
            <Offcanvas
                placement="end"
                show={props.canvasModal}
                onHide={() => { props.onHide(); props.setShowHistory(false); }}
                className={style.responsiveOffcanvas}
                style={{ width: "45%" }}
            >
                <div className={style.canvas_container} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                    <div className={style.OffcanvasHeader}>
                        <h4 className={style.header_title}>Vehicle Settings</h4>
                    </div>

                    <div className={style.scroll_section}>
                        <div className={style.canvas_header_end}>
                            <img
                                src={images.iconClose}
                                className={style.close_popup}
                                onClick={() => { props.onHide(); props.setShowHistory(false); }}
                                alt="Close"
                            />
                        </div>

                        <div className={style.taskControlCard}>
                            <div className={style.controlRow}>
                                <h3 className={style.taskName}>
                                    {props.vehicleDetails?.vehicles_No || "N/A"}
                                </h3>

                                <div className={style.actionButtons}>
                                    <div className={style.sectionTitle}>
                                        <span title="History Icon">
                                            {/* HISTORY ICON COMMENTED */}
                                            {/*
                                            <History
                                                size={18}
                                                onClick={getHistoryData}
                                                className={style.historyIcon}
                                            />
                                            */}
                                        </span>
                                    </div>

                                    {toggle && (
                                        <button
                                            className={style.editButton}
                                            onClick={props.onEditClick}
                                            title="Edit Vehicle"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    )}

                                    {!toggle && (
                                        <button
                                            className={style.deleteButton}
                                            onClick={props.handleDelete}
                                            title="Delete Vehicle"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className={style.statusSection}>
                                    <div className={style.toggleContainer}>
                                        <label className={style.toggleSwitch}>
                                            <input
                                                type="checkbox"
                                                checked={toggle}
                                                onClick={handleToggleClick}
                                                readOnly
                                            />
                                            <span className={style.toggleSlider}></span>
                                        </label>

                                        <span className={`${style.statusText} ${toggle ? style.active : style.inactive}`}>
                                            {toggle ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Offcanvas>

            <StatusConfirmation
                isOpen={showStatusConfirm}
                onClose={() => setShowStatusConfirm(false)}
                onConfirm={confirmStatusChange}
                itemName={props.vehicleDetails?.vehicles_No || "this vehicle"}
                status={!toggle ? "active" : "inactive"}
            />
        </>
    );
};

export default VehicleHistoryData;
