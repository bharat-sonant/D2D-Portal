import { useEffect, useState } from 'react';
import * as service from '../../services/DailyAssignment/DailyAssignmentService';
import { getAllWardsList } from '../../actions/DailyAssignment/DailyAssignmentAction';
import styles from '../../Style/DailyAssignment/DailyAssignment.module.css';
import YearMonthSelector from '../../components/YearMonthSelector/YearMonthSelector';
import dayjs from 'dayjs';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { Eye } from 'react-bootstrap-icons'; // npm install react-bootstrap-icons

const DailyAssignment = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wards, setWards] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedWard, setSelectedWard] = useState('');
    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewType, setPreviewType] = useState('on'); // "on" or "off"

    useEffect(() => {
        const fetchWards = async () => {
            const wardsList = await getAllWardsList(setWards);
            if (wardsList && wardsList.length > 0) {
                setSelectedWard(wardsList[0]);
            }
        };
        fetchWards();
    }, []);

    useEffect(() => {
        if (!selectedWard || !selectedYear || !selectedMonth) return;

        const fetchDutyData = async () => {
            setLoading(true);
            try {
                const dateString = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
                const response = await service.getDutyOnOffList(selectedWard, dateString);

                if (response?.status?.toLowerCase() === 'success') {
                    const records = response.data?.dutyImgList || [];
                    const formatted = records.map(item => ({
                        zone: response.data.zoneNo || selectedWard,
                        year: selectedYear,
                        month: selectedMonth,
                        date: item.date,
                        dutyInTime: item.dutyInTime,
                        dutyOutTime: item.dutyOutTime,
                        workPercentage: item.workPercentageRemark,
                        driver: item.driver || '-',
                        helper: item.helper || '-',
                        vehicle: item.vehicle || '-'
                    }));
                    setFilteredData(formatted);
                } else {
                    setFilteredData([]);
                }
            } catch (error) {
                console.error('Error fetching duty data:', error);
                setFilteredData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDutyData();
    }, [selectedWard, selectedYear, selectedMonth]);

    const handleFilterChange = ({ year, month, ward }) => {
        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedWard(
            typeof ward === 'object'
                ? ward.zoneNo || ward.id || ward.name || ''
                : ward
        );
    };

    const formatMultiline = (value) => {
        if (!value || value === '-') return '-';
        const parts = value.split(',').map((v) => v.trim());
        return parts.map((v, i) => (
            <div key={i}>
                {i + 1}) {v}
            </div>
        ));
    };

    const formatTimeWithAMPM = (timeString) => {
        if (!timeString || timeString === '-') return '-';
        const [hour, minute] = timeString.split(':');
        let h = parseInt(hour, 10);
        const m = minute || '00';
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    };

    // 🔍 Fetch and show Duty On or Off images
    const getImages = async (zone, date, type) => {
        setLoading(true);
        const response = await service.getDutyOnOffImagesByDate(zone, date);
        setLoading(false);

        console.log('📸 Image Response:', response);

        if (response?.status?.toLowerCase() === 'success' && response.data) {
            setPreviewData(response.data);
            setPreviewType(type);
            setShowPreview(true);
        } else {
            alert('No images found for this date.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Daily Assignment</h2>

            <YearMonthSelector
                wards={wards}
                onChange={handleFilterChange}
                defaultYear={selectedYear}
                defaultMonth={selectedMonth}
                defaultWard={selectedWard}
            />

            {loading ? (
                <div className={styles.loading}>
                    <Spinner
                        animation="border"
                        role="status"
                        style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}
                    />
                    <div className={styles.loadingText}>Please wait...</div>
                </div>
            ) : filteredData.length === 0 ? (
                <div className={styles.noData}>No records found for the selected filters.</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                <th>Duty In Time</th>
                                <th>Duty Out Time</th>
                                <th>Work %</th>
                                <th>Driver</th>
                                <th>Helper</th>
                                <th>Vehicle</th>
                                <th>Duty On Images</th>
                                <th>Duty Off Images</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{dayjs(item.date).format('DD MMM YYYY')}</td>
                                    <td>{formatTimeWithAMPM(item.dutyInTime)}</td>
                                    <td>{formatTimeWithAMPM(item.dutyOutTime)}</td>
                                    <td>{item.workPercentage || '-'}</td>
                                    <td>{formatMultiline(item.driver)}</td>
                                    <td>{formatMultiline(item.helper)}</td>
                                    <td>{formatMultiline(item.vehicle)}</td>
                                    <td
                                        style={{ cursor: 'pointer', color: '#007bff' }}
                                        onClick={() => getImages(item.zone, item.date, 'on')}
                                    >
                                        <Eye size={20} />
                                    </td>
                                    <td
                                        style={{ cursor: 'pointer', color: '#dc3545' }}
                                        onClick={() => getImages(item.zone, item.date, 'off')}
                                    >
                                        <Eye size={20} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 🖼️ Modal for image preview */}
            <Modal
                show={showPreview}
                onHide={() => setShowPreview(false)}
                size="xl"
                centered
                scrollable
                style={{width:'100%'}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {previewType === 'on' ? 'Duty On Images' : 'Duty Off Images'} ({previewData?.date})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {previewData ? (
                        <>
                            {previewType === 'on' ? (
                                <>
                                    <h5>Duty On Images</h5>
                                    <div className={styles.imageGrid}>
                                        {previewData.dutyInImages?.map((img, idx) => (
                                            <>
                                            {console.log(img)}
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Duty On ${idx + 1}`}
                                                className={styles.previewImage}
                                            />
                                            </>
                                        ))}
                                    </div>

                                    <h5>Duty On Meter Images</h5>
                                    <div className={styles.imageGrid}>
                                        {previewData.dutyInMeterImages?.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Duty On Meter ${idx + 1}`}
                                                className={styles.previewImage}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h5>Duty Off Images</h5>
                                    <div className={styles.imageGrid}>
                                        {previewData.dutyOutImages?.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Duty Off ${idx + 1}`}
                                                className={styles.previewImage}
                                            />
                                        ))}
                                    </div>

                                    <h5>Duty Off Meter Images</h5>
                                    <div className={styles.imageGrid}>
                                        {previewData.dutyOutMeterImages?.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Duty Off Meter ${idx + 1}`}
                                                className={styles.previewImage}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <p>No images available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPreview(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DailyAssignment;
