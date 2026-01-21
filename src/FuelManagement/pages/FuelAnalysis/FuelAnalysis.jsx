import React, { useState } from 'react';
import {
  Car, Calendar, User, DollarSign, Gauge,
  CheckCircle, XCircle, ChevronDown
} from 'lucide-react';
import styles from './FuelAnalysis.module.css';
import CustomDatePicker from '../../../components/CustomDatePicker/CustomDatePicker';

const FuelAnalysis = () => {
  const [analysisStatus, setAnalysisStatus] = useState('ok');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('LEY-AT-4618');
  const [alreadyApproved, setAlreadyApproved] = useState(false)
  const entries = ['Entry 1', 'Entry 2', 'Entry 3'];
  const [selectedEntry, setSelectedEntry] = useState(entries[0]);
  const [date, setDate] = useState(null);


  const vehicles = ['LEY-AT-4611', 'LEY-AT-4618', 'TATA-AT-5511'];

  const vehicleDetails = {
    vehicleNo: 'LEY-AT-4618',
    fuelType: '9 L - Diesel',
    amount: '819.99',
    odometer: '62892',
    driver: 'Dinesh',
    date: '21 Jan 2026'
  };

  const handleApproveReject = () => {
  if (analysisStatus === 'not-ok' && !rejectionReason.trim()) {
    alert('Please enter rejection reason');
    return;
  }

  setAlreadyApproved(true);
};


  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
  <h1 className={styles.headerTitle}>Vehicle Fuel Analysis</h1>

  <div className={styles.headerControls}>
    {/* Date Picker */}
    <div className={styles.controlBox}>
        <CustomDatePicker value={date}/>
    </div>
    {/* Entry Selector */}
    <div className={styles.controlBox}>
      <div className={styles.selectWrapper}>
        <select
          value={selectedEntry}
          onChange={(e) => {
            setSelectedEntry(e.target.value);
            setAlreadyApproved(false);
            setAnalysisStatus('ok');
            setRejectionReason('');
          }}
          className={styles.select}
        >
          {entries.map(entry => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <ChevronDown size={14} />
      </div>
    </div>
  </div>
</div>


        <div className={styles.content}>
          <div className={styles.wrapper}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Vehicle Details</h2>
              <div className={styles.grid3}>
                <div className={styles.infoRow}><Car size={18} />{vehicleDetails.vehicleNo}</div>
                <div className={styles.infoRow}><Gauge size={18} />{vehicleDetails.fuelType}</div>
                <div className={styles.infoRow}><DollarSign size={18} />₹ {vehicleDetails.amount}</div>
                <div className={styles.infoRow}><Gauge size={18} />{vehicleDetails.odometer}</div>
                <div className={styles.infoRow}><User size={18} />{vehicleDetails.driver}</div>
                <div className={styles.infoRow}><Calendar size={18} />{vehicleDetails.date}</div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Analysis Status</h2>
              <div className={styles.statusRow}>
                <label className={styles.radio}>
                  <input type="radio" disabled={alreadyApproved} checked={analysisStatus === 'ok'} onChange={() => setAnalysisStatus('ok')} />
                  OK
                </label>
                <label className={styles.radio}>
                  <input type="radio" disabled={alreadyApproved} checked={analysisStatus === 'not-ok'} onChange={() => setAnalysisStatus('not-ok')} />
                  Not OK
                </label>
              </div>

              {analysisStatus === 'not-ok' && (
                <textarea
                  className={styles.textarea}
                  placeholder="Rejection reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              )}
            </div>

            <div className={styles.imageGrid}>
              <div className={styles.imageBox}>
                <h3 className={styles.imageTitle}>Slip Image</h3>
                <div className={styles.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500" className={styles.image} />
                </div>
              </div>

              <div className={styles.imageBox}>
                <h3 className={styles.imageTitle}>Meter Image</h3>
                <div className={`${styles.imageWrapper} ${styles.imageDark}`}>
                  <img src="https://images.unsplash.com/photo-1609883704992-762a9bb5e3af?w=500" className={styles.image} />
                </div>
              </div>
            </div>

            {alreadyApproved && (
              <div className={styles.card}>
                <p className={styles.submitted}>Kamal Kumar Meena</p>
                <p className={styles.subDate}>21 Jan 2026 01:50 PM</p>
              </div>
            )}


            {!alreadyApproved && (
  <div className={styles.actions}>
    <button
      className={`${styles.btn} ${styles.btnReset}`}
      onClick={() => {
        setAnalysisStatus('ok');
        setRejectionReason('');
      }}
    >
      Reset
    </button>

    <button
      onClick={handleApproveReject}
      className={`${styles.btn} ${
        analysisStatus === 'ok'
          ? styles.btnApprove
          : styles.btnReject
      }`}
    >
      {analysisStatus === 'ok' ? <CheckCircle /> : <XCircle />}
      {analysisStatus === 'ok' ? 'Approve' : 'Reject'}
    </button>
  </div>
)}

          </div>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div style={{ padding: 16 }}>
          <h3 className={styles.sidebarTitle}>Vehicles</h3>
          {vehicles.map(v => (
            <button
              key={v}
              className={`${styles.vehicleBtn} ${selectedVehicle === v ? styles.vehicleActive : ''}`}
              onClick={() => setSelectedVehicle(v)}
            >
              <Car size={18} /> {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FuelAnalysis;
