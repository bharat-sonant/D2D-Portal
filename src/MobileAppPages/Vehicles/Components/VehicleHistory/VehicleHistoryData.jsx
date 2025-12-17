import { Offcanvas } from 'react-bootstrap';
import style from '../../Styles/VehicleHistoryData/VehicleHistory.module.css';
import { Calendar, User, Edit2, Trash2, History, Info } from 'lucide-react';
import { images } from '../../../../assets/css/imagePath';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { formatEvent } from '../../Action/VehicleList/VehicleListAction';
import { ActiveInactiveVehicles } from '../../Action/AddVehicle/AddVehicleAction';

const VehicleHistoryData = (props) => {
    const [toggle, setToggle] = useState(props.vehicleDetails?.status === "active");

    useEffect(() => {
        if (props.vehicleDetails) {
            setToggle(props.vehicleDetails.status === "active");
        }
    }, [props.vehicleDetails]);

    const handleToggle = () => {
        ActiveInactiveVehicles(props, setToggle, toggle)
    };

    const getHistoryData = () => {
        props.setShowHistory(true);
    }

    return (
        <>
            <Offcanvas placement="end" show={props.canvasModal} onHide={() => { props.onHide(); props.setShowHistory(false) }} className={style.responsiveOffcanvas} style={{ width: "45%" }} >
                <div className={style.canvas_container} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                    <div className={style.OffcanvasHeader}>
                        <h4 className={style.header_title}>Vehicle Settings</h4>
                    </div>
                    <div className={style.scroll_section}>
                        <div className={style.canvas_header_end}>
                            <img
                                src={images.iconClose}
                                className={style.close_popup}
                                onClick={() => { props.onHide(); props.setShowHistory(false) }}
                                alt="Close"
                            />
                        </div>
                        <div className={style.taskControlCard}>
                            <div className={style.controlRow}>
                                <h3 className={style.taskName}>{props.vehicleDetails?.vehicles_No || "N/A"}</h3>


                                <div className={style.actionButtons}>
                                    <div className={style.sectionTitle}>
                                        <span title="History Icon">
                                            <History
                                                size={18}
                                                onClick={getHistoryData}
                                                className={style.historyIcon}
                                            />
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
                                                onChange={handleToggle}
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

                        {props.showHistory ? (
                            <div className={style.historyScroll}>
                                {props.vehicleHistory.map((item, index) => (
                                    <div key={index} className={style.historyCard}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%"
                                            }}
                                        >
                                            {/* LEFT SIDE → EVENT TEXT */}
                                            <div className={style.historyTitle}>
                                                {formatEvent(item.event)}
                                            </div>

                                            {/* RIGHT SIDE → META INFO */}
                                            <div className={style.metaRow}>
                                                <User size={16} />
                                                <span style={{ fontFamily: 'sans-serif', fontWeight: '500', fontSize: '12px' }}>
                                                    {item.by}
                                                </span>

                                                <Calendar size={16} style={{ marginLeft: "10px" }} />
                                                <span style={{ fontFamily: 'sans-serif', fontWeight: '500', fontSize: '12px' }}>
                                                    [{item.at ? dayjs(item.at).format('DD MMM, YYYY hh:mm A') : 'N/A'}]
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                ))}

                                {props.vehicleHistory.length === 0 && (
                                    <p style={{ color: "#777", textAlign: "center" }}>No history found.</p>
                                )}
                            </div>
                        ) : (
                            <div className={style.infoBox}>
                                <div className={style.infoIconWrapper}>
                                    <Info size={18} />
                                </div>

                                <div>
                                    <p className={style.infoText}>Click on the history icon above to view vehicle update history.</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </Offcanvas>
        </>
    )
}

export default VehicleHistoryData