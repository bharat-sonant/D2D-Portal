import { Offcanvas } from 'react-bootstrap';
import style from '../../Styles/HistoryData/HistoryData.module.css';
import { images } from '../../../../assets/css/imagePath';
import { Calendar, User } from 'lucide-react';
import dayjs from 'dayjs';

const HistoryData = (props) => {
    return (
        <>
            <Offcanvas placement="end" show={props.openCanvas} onHide={props.onHide} className={style.responsiveOffcanvas} style={{ width: "30%" }} >
                <div className={style.canvas_container} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                    <div className={style.OffcanvasHeader}>
                        <h4 className={style.header_title}>Task History</h4>
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

                        <div className={style.listContainer}>
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