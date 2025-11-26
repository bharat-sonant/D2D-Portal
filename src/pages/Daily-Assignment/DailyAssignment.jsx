import styles from '../../Style/DailyAssignment/DailyAssignment.module.css';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as service from '../../services/DailyAssignment/DailyAssignmentService';
import * as wardService from '../../services/WardsServices/WardsService';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { connectFirebase } from '../../firebase/firebaseService';
import { getCityFirebaseConfig } from '../../configurations/cityDBConfig';
import { useLocation } from 'react-router-dom';

const DailyAssignment = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [wards, setWards] = useState([]);
    const [zoneData, setZoneData] = useState([]);
    const [loading, setLoading] = useState(true);
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
                    const res = await service.getOrPushDailyAssignmentData(ward, formattedDate);
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


    return (
        <div className={styles.container}>
            <div className={styles.dateRow}>
                <button className={styles.navButton} onClick={handlePrevDay}>
                    <FaChevronLeft />
                </button>

                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd-MM-yyyy"
                    className={styles.datePicker}
                    calendarClassName={styles.customCalendar}
                />

                <button className={styles.navButton} onClick={handleNextDay}>
                    <FaChevronRight />
                </button>
            </div>

            {loading ? (
                <div
                    style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginTop: '240px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Spinner size={50} />
                    <p style={{ marginTop: '8px' }}>Please wait... Processing your data.</p>
                </div>

            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>S.No.</th>
                            <th style={{ width: '180px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Zone</th>
                            <th style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>Duty On/Off Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wards.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                    No wards available
                                </td>
                            </tr>
                        ) : (
                            wards.map((ward, index) => {
                                const zone = zoneData.find(z => z?.wardName === ward);
                                const dutyData = zone?.data;
                                console.log(dutyData)
                                return (
                                    <tr key={ward}>
                                        <td>{index + 1}</td>
                                        <td>{ward}</td>
                                        <td>
                                            {dutyData?.dutyImgList?.length > 0 ? (
                                                <div className={styles.cardContainer}>
                                                    {dutyData.dutyImgList.map((item, idx) => (
                                                        <div key={idx} className={styles.dutyCard}>
                                                            <div className={styles.imageRow}>
                                                                {item.dutyInImages?.length > 0 && (
                                                                    <>
                                                                        {item.dutyInImages.map((imgUrl, i) => (
                                                                            <img key={`in-${i}`} src={imgUrl} className={styles.dutyImage} alt="Duty In" />
                                                                        ))}
                                                                    </>
                                                                )}

                                                                {item.dutyInMeterImages?.length > 0 && (
                                                                    <>
                                                                        {item.dutyInMeterImages.map((imgUrl, i) => (
                                                                            <img key={`in-meter-${i}`} src={imgUrl} className={styles.dutyImage} alt="In Meter" />
                                                                        ))}
                                                                    </>
                                                                )}

                                                                {item.dutyOutImages?.length > 0 && (
                                                                    <>
                                                                        {item.dutyOutImages.map((imgUrl, i) => (
                                                                            <img key={`out-${i}`} src={imgUrl} className={styles.dutyImage} alt="Duty Out" />
                                                                        ))}
                                                                    </>
                                                                )}

                                                                {item.dutyOutMeterImages?.length > 0 && (
                                                                    <>
                                                                        {item.dutyOutMeterImages.map((imgUrl, i) => (
                                                                            <img key={`out-meter-${i}`} src={imgUrl} className={styles.dutyImage} alt="Out Meter" />
                                                                        ))}
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className={styles.dutyInfo}>
                                                                <p><strong>Driver:</strong> {item.driver || "---"}</p>
                                                                <p><strong>Helper:</strong> {item.helper || "---"}</p>
                                                                <p><strong>Vehicle:</strong> {item.vehicle || "---"}</p>
                                                                <p><strong>In Time:</strong> {item.dutyInTime || "---"}</p>
                                                                <p><strong>Out Time:</strong> {item.dutyOutTime || "---"}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center', fontStyle: 'italic' }}>No records</div>
                                            )}

                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>

                </table>
            )}
        </div>
    );
};

export default DailyAssignment;
