import { useEffect, useState } from 'react';
import * as service from '../../services/DailyAssignment/DailyAssignmentService';
import { getAllWardsList } from '../../actions/DailyAssignment/DailyAssignmentAction';
import styles from '../../Style/DailyAssignment/DailyAssignment.module.css';
import YearMonthSelector from '../../components/YearMonthSelector/YearMonthSelector';
import dayjs from 'dayjs';
import { Spinner } from 'react-bootstrap';

const DailyAssignment = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wards, setWards] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedWard, setSelectedWard] = useState('');

    useEffect(() => {
        const fetchWards = async () => {
            const wardsList = await getAllWardsList(setWards);
            console.log(wardsList)
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
                        vehicle: item.vehicle || '-',
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DailyAssignment;
