import { useState, useRef, useEffect } from 'react';
import { Filter, CalendarDays } from 'lucide-react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

import styles from './TaskMonitoring.module.css';
import dayjs from 'dayjs';

const TaskMonitoring = () => {
  const [selectedDate, setSelectedDate] = useState(new Date('2026-01-21'));
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const menuRef = useRef(null);
  const datePickerRef = useRef(null);

  const historyData = [
    { sno: 1, task: "Network Maintenance - Zone A", status: "Approved" },
    { sno: 2, task: "Regular Site Audit", status: "Pending" },
    { sno: 3, task: "Equipment Checkup", status: "Pending" },
    { sno: 4, task: "Fiber Inspection", status: "Not Approved" },
    { sno: 5, task: "System Security Patch", status: "Approved" },
    { sno: 6, task: "Power Backup Testing", status: "Pending" },
    { sno: 7, task: "Antenna Alignment", status: "Approved" },
    { sno: 8, task: "Battery Bank Refill", status: "Not Approved" },
    { sno: 9, task: "Generator Service", status: "Approved" },
    { sno: 10, task: "AC Maintenance", status: "Pending" },
  ];

  // Filter data based on selected status
  const filteredData = selectedStatus === 'all'
    ? historyData
    : historyData.filter(item => item.status === selectedStatus);



  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setOpenDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.monitoringWrapper}>
      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterRow}>
          {/* Date Picker */}
          <div className={styles.dateFilterGroup}>
            <label className={styles.filterLabel}>Date</label>
            <div className={styles.datePickerWrapper} ref={datePickerRef}>
              <div
                className={styles.customDateDisplay}
                onClick={() => setOpenDatePicker(true)}
              >
                <CalendarDays size={16} />
                <span>{dayjs(selectedDate).format('DD MMM YYYY')}</span>
              </div>

              <div className={styles.datePickerContainer}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={selectedDate}
                    open={openDatePicker}
                    onOpen={() => setOpenDatePicker(true)}
                    onClose={() => setOpenDatePicker(false)}
                    onChange={(newDate) => {
                      if (newDate) {
                        setSelectedDate(newDate);
                        setOpenDatePicker(false);
                      }
                    }}
                    enableAccessibleFieldDOMStructure={false}
                    disableMaskedInput
                    inputFormat="dd/MM/yyyy"
                    slots={{
                      textField: (params) => (
                        <TextField
                          {...params}
                          style={{ display: 'none' }}
                        />
                      ),
                    }}
                    slotProps={{
                      popper: {
                        anchorEl: datePickerRef.current,
                        modifiers: [
                          {
                            name: 'offset',
                            options: { offset: [0, 8] },
                          },
                        ],
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
          {/* Status Filter */}
          <div className={styles.statusFilterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <div className={styles.statusMenuWrapper} ref={menuRef}>
              <button
                className={styles.statusMenuBtn}
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                title="Click to filter by status"
              >
                <Filter size={16} />
              </button>

              {showStatusMenu && (
                <div className={styles.statusDropdown}>
                  <button
                    className={`${styles.statusOption} ${selectedStatus === 'all' ? styles.statusOptionActive : ''}`}
                    onClick={() => {
                      setSelectedStatus('all');
                      setShowStatusMenu(false);
                    }}
                  >
                    All
                  </button>
                  <button
                    className={`${styles.statusOption} ${selectedStatus === 'Approved' ? styles.statusOptionActive : ''}`}
                    onClick={() => {
                      setSelectedStatus('Approved');
                      setShowStatusMenu(false);
                    }}
                  >
                    ✓ Approved
                  </button>
                  <button
                    className={`${styles.statusOption} ${selectedStatus === 'Pending' ? styles.statusOptionActive : ''}`}
                    onClick={() => {
                      setSelectedStatus('Pending');
                      setShowStatusMenu(false);
                    }}
                  >
                    ⏳ Pending
                  </button>
                  <button
                    className={`${styles.statusOption} ${selectedStatus === 'Not Approved' ? styles.statusOptionActive : ''}`}
                    onClick={() => {
                      setSelectedStatus('Not Approved');
                      setShowStatusMenu(false);
                    }}
                  >
                    ✕ Not Approved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className={styles.taskListContainer}>
        {filteredData.length > 0 ? (
          <>
            <div className={styles.taskListHeader}>
              <span className={styles.headerTask}>Task </span>
              <span className={styles.headerStatus}>Status</span>
            </div>

            <div className={styles.taskListScroll}>
              {filteredData.map((item) => (
                <div key={item.sno} className={styles.taskItem}>
                  <div className={styles.taskItemContent}>
                    <div className={styles.taskItemNumber}>
                      <span>#{item.sno}</span>
                    </div>
                    <div className={styles.taskItemDetails}>
                      <p className={styles.taskItemTitle}>{item.task}</p>
                    </div>
                  </div>
                  <div className={styles.taskItemStatusWrapper}>
                    <span className={`${styles.statusLabel} ${styles[item.status.toLowerCase().replace(' ', '')]}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>No tasks found for selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskMonitoring;