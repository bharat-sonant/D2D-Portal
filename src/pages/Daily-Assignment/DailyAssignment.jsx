import styles from '../../Style/DailyAssignment/DailyAssignment.module.css';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaChevronLeft, FaChevronRight, FaClock, FaUser, FaTruck, FaCamera } from 'react-icons/fa';
import * as service from '../../services/DailyAssignment/DailyAssignmentService';
import * as wardService from '../../services/WardsServices/WardsService';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { connectFirebase } from '../../firebase/firebaseService';
import { getCityFirebaseConfig } from '../../configurations/cityDBConfig';
import { useLocation } from 'react-router-dom';
import ImageModal from '../../components/ImageModal/ImageModal';

const DailyAssignment = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [wards, setWards] = useState([]);
    const [zoneData, setZoneData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState("");

    const [showImgModal, setShowImgModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city") || "DevTest";

    useEffect(() => {
        if (city) {
            localStorage.setItem("city", city);
            let config = getCityFirebaseConfig(city);
            connectFirebase(config, city);
        } else {
            localStorage.setItem("city", "DevTest");
        }
    }, [city]);

    useEffect(() => {
        getWards();
    }, []);

    useEffect(() => {
        if (wards.length > 0) {
            getDutyOnOffDataList(selectedDate);
        }
    }, [wards, selectedDate]);

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const getWards = async () => {
        try {
            const response = await wardService.getAllWards();
            const wardsList = response?.data?.filter(Boolean) || [];
            setWards(wardsList);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const getDutyOnOffDataList = async (date) => {
        if (wards.length === 0) return;
        setLoading(true);

        const formattedDate = moment(date).format('YYYY-MM-DD');

        try {
            const responses = await Promise.all(
                wards.map(async (ward) => {
                    if (!ward) return null;

                    await service.getOrPushDailyAssignmentData(ward, formattedDate);
                    const res = await service.getDutyOnOffList(ward, formattedDate);

                    if (res?.status === "Success" && res.data) {
                        return { wardName: ward, data: res.data };
                    }
                    return { wardName: ward, data: null };
                })
            );

            setZoneData(responses);
        } catch (error) {
            console.error("Error fetching duty data:", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (img, title) => {
        setSelectedImage(img);
        setModalTitle(title);
        setShowImgModal(true);
    };

    const isToday = moment(selectedDate).isSame(moment(), 'day');

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div className={styles.dateControls}>
                    <button className={styles.navButton} onClick={handlePrevDay}>
                        <FaChevronLeft />
                    </button>

                    <div className={styles.datePickerWrapper}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd MMM yyyy"
                            className={styles.datePicker}
                            calendarClassName={styles.customCalendar}
                        />
                        {isToday && <span className={styles.todayBadge}>Today</span>}
                    </div>

                    <button className={styles.navButton} onClick={handleNextDay}>
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loaderBox}>
                    <Spinner animation="border" variant="primary" />
                    <p className={styles.loaderText}>Please wait... Loading Duty on/off data.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <div className={styles.tableContainer}>
                        <table className={styles.dutyTable}>
                            <thead>
                                <tr>
                                    <th className={styles.wardHeader}>Ward</th>
                                    <th className={styles.dataHeader}>Duty On/Off Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zoneData.map((zone, zoneIndex) => {
                                    const dutyList = zone?.data?.dutyImgList || [];

                                    return (
                                        <tr key={zoneIndex}>
                                            <td className={styles.wardCell}>
                                                <div className={styles.wardName}>{zone?.wardName}</div>
                                            </td>
                                            <td className={styles.dataCell}>
                                                {dutyList.length > 0 ? (
                                                    <div className={styles.cardsContainer}>
                                                        {dutyList.map((item, itemIndex) => (
                                                            <div key={itemIndex} className={styles.dutyCard}>
                                                                <div className={styles.cardHeader}>
                                                                    <h4 className={styles.cardTitle}>Duty On/Off {itemIndex + 1}</h4>
                                                                    <div className={styles.timeBadge}>
                                                                        <FaClock size={12} />
                                                                        <span>{item.dutyInTime || "---"} - {item.dutyOutTime || "---"}</span>
                                                                    </div>
                                                                </div>

                                                                {(item.dutyInImages?.length > 0 ||
                                                                    item.dutyInMeterImages?.length > 0 ||
                                                                    item.dutyOutImages?.length > 0 ||
                                                                    item.dutyOutMeterImages?.length > 0) && (
                                                                        <div className={styles.imagesSection}>
                                                                            <div className={styles.imagesSectionHeader}>
                                                                                <FaCamera size={14} />
                                                                                <span>Duty Images</span>
                                                                            </div>
                                                                            <div className={styles.imageRow}>
                                                                                {item.dutyInImages?.map((img, i) => (
                                                                                    <div key={i} className={styles.imageWrapper}>
                                                                                        <img src={img} className={styles.dutyImage}
                                                                                            onClick={() => openModal(img, "Duty On Image")} alt="Duty On" />
                                                                                        <span className={styles.imageLabel}>Duty On</span>
                                                                                    </div>
                                                                                ))}

                                                                                {item.dutyInMeterImages?.map((img, i) => (
                                                                                    <div key={i} className={styles.imageWrapper}>
                                                                                        <img src={img} className={styles.dutyImage}
                                                                                            onClick={() => openModal(img, "Duty On Meter Image")} alt="Meter In" />
                                                                                        <span className={styles.imageLabel}>Meter On</span>
                                                                                    </div>
                                                                                ))}

                                                                                {item.dutyOutImages?.map((img, i) => (
                                                                                    <div key={i} className={styles.imageWrapper}>
                                                                                        <img src={img} className={styles.dutyImage}
                                                                                            onClick={() => openModal(img, "Duty Off Image")} alt="Duty Out" />
                                                                                        <span className={styles.imageLabel}>Duty Out</span>
                                                                                    </div>
                                                                                ))}

                                                                                {item.dutyOutMeterImages?.map((img, i) => (
                                                                                    <div key={i} className={styles.imageWrapper}>
                                                                                        <img src={img} className={styles.dutyImage}
                                                                                            onClick={() => openModal(img, "Duty Off Meter Image")} alt="Meter Out" />
                                                                                        <span className={styles.imageLabel}>Meter Off</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                <div className={styles.infoGrid}>
                                                                    <div className={styles.infoItem}>
                                                                        <div className={styles.infoIcon}>
                                                                            <FaUser />
                                                                        </div>
                                                                        <div className={styles.infoContent}>
                                                                            <span className={styles.infoLabel}>Driver</span>
                                                                            <span className={styles.infoValue}>{item.driver || "Not Assigned"}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.infoItem}>
                                                                        <div className={styles.infoIcon}>
                                                                            <FaUser />
                                                                        </div>
                                                                        <div className={styles.infoContent}>
                                                                            <span className={styles.infoLabel}>Helper</span>
                                                                            <span className={styles.infoValue}>{item.helper || "Not Assigned"}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.infoItem}>
                                                                        <div className={styles.infoIcon}>
                                                                            <FaTruck />
                                                                        </div>
                                                                        <div className={styles.infoContent}>
                                                                            <span className={styles.infoLabel}>Vehicle</span>
                                                                            <span className={styles.infoValue}>{item.vehicle || "Not Assigned"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={styles.noRecord}>
                                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M9 11l3 3L22 4" />
                                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                                        </svg>
                                                        <p>No duty on/off data found on {moment(selectedDate).format('DD-MMM-YYYY')}</p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showImgModal && (
                <ImageModal
                    imageUrl={selectedImage}
                    title={modalTitle}
                    onClose={() => {
                        setShowImgModal(false);
                        setSelectedImage(null);
                        setModalTitle("");
                    }}
                />
            )}
        </div>
    );
};

export default DailyAssignment;