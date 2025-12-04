import { Offcanvas } from 'react-bootstrap';
import style from '../../Styles/HistoryData/HistoryData.module.css';
import { images } from '../../../../assets/css/imagePath';
import { Calendar, User, Edit2, Trash2, History } from 'lucide-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { ActiveInactiveTask } from '../../Action/Task/TaskAction';

const HistoryData = (props) => {
    const [toggle, setToggle] = useState(props.selectedTask?.status === "active");

    useEffect(() => {
        if (props.selectedTask) {
            setToggle(props.selectedTask.status === "active");
        }
    }, [props.selectedTask]);

    const handleToggle = () => {
        ActiveInactiveTask(props, setToggle, toggle)
    };

    return (
        <>
            <Offcanvas placement="end" show={props.openCanvas} onHide={props.onHide} className={style.responsiveOffcanvas} style={{ width: "30%" }} >
                <div className={style.canvas_container} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                    <div className={style.OffcanvasHeader}>
                        <h4 className={style.header_title}>Task Settings</h4>
                    </div>
                    <div className={style.scroll_section}>
                        <div className={style.canvas_header_end}>
                            <img
                                src={images.iconClose}
                                className={style.close_popup}
                                onClick={props.onHide}
                                alt="Close"
                            />
                        </div>

                        <div className={style.taskControlCard}>
                            <div className={style.controlRow}>
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

                                <div className={style.actionButtons}>
                                    <button
                                        className={style.editButton}
                                        onClick={props.onEditClick}
                                        title="Edit Task"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        className={style.deleteButton}
                                        onClick={props.handleDelete}
                                        title="Delete Task"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* History Section Title */}
                        <div className={style.sectionTitle}>
                            <History size={18} />
                            <h5>Task History</h5>
                        </div>

                        {/* History List */}
                        <div className={style.historyScroll}>
                            {props.taskHistory.map((item, index) => (
                                <div key={index} className={style.historyCard}>
                                    <div className={style.historyTitle}>
                                        {item.event}
                                    </div>
                                    <div className={style.metaRow}>
                                        <User size={16} />
                                        <span style={{ fontFamily: 'sans-serif', fontWeight: '500', fontSize: '12px' }}>{item.by}</span>

                                        <Calendar size={16} style={{ marginLeft: "10px" }} />
                                        <span style={{ fontFamily: 'sans-serif', fontWeight: '500', fontSize: '12px' }}>
                                            [{item.at ? dayjs(item.at).format('DD-MMM-YYYY hh:mm A') : 'N/A'}]
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {props.taskHistory.length === 0 && (
                                <p style={{ color: "#777", textAlign: "center" }}>No history found.</p>
                            )}
                        </div>

                    </div>

                </div>
            </Offcanvas>
        </>
    )
}

export default HistoryData