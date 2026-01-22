import React, { useState } from "react";
import styles from "./FuelReport.module.css";
import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import dayjs from "dayjs";
import FuelReimbursement from "../../components/FuelReport/FuelReimbursement";

const FuelReport = () => {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"))
  const tableData = [
    {
      vehicle: "861128067333192",
      fuelType: "Diesel",
      qty: "45",
      meter: "123456",
      amount: "4050",
      ward: "12",
      km: "120",
      gpsKm: "118",
      driver: "Ramesh",
      reimb: "No",
    },
    {
      vehicle: "ATUAL-1111",
      fuelType: "Petrol",
      qty: "30",
      meter: "223344",
      amount: "3300",
      ward: "8",
      km: "95",
      gpsKm: "92",
      driver: "Suresh",
      reimb: "Yes",
    },
    {
      vehicle: "ATUAL-2525",
      fuelType: "CNG",
      qty: "18",
      meter: "556677",
      amount: "1800",
      ward: "4",
      km: "70",
      gpsKm: "68",
      driver: "Mahesh",
      reimb: "No",
    },
    {
      vehicle: "EV-8528",
      fuelType: "Diesel",
      qty: "50",
      meter: "778899",
      amount: "4600",
      ward: "10",
      km: "140",
      gpsKm: "138",
      driver: "Naresh",
      reimb: "Yes",
    },
    {
      vehicle: "LEY-AT-1048",
      fuelType: "Petrol",
      qty: "28",
      meter: "998877",
      amount: "3000",
      ward: "6",
      km: "88",
      gpsKm: "85",
      driver: "Dinesh",
      reimb: "No",
    },
  ];
  const [showReimbursePopup, setShowReimbursePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleReimburseClick = (row) => {
    setSelectedRow(row);
    setShowReimbursePopup(true);
  };

  return (
    <div className={styles.page}>
      {/* ===== HEADER 1 ===== */}
      <div className={styles.headerTop}>
        <h2 className={styles.title}>
          Daily Fuel Report [{`${date}`}]
        </h2>

        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <strong>0.00</strong>
            <span>CNG</span>
          </div>
          <div className={styles.summaryItem}>
            <strong>0.00</strong>
            <span>Petrol</span>
          </div>
          <div className={styles.summaryItem}>
            <strong>0.00</strong>
            <span>Diesel Qty</span>
          </div>
          <div className={styles.summaryItem}>
            <strong>0.00</strong>
            <span>Total Fuel</span>
          </div>
          <div className={styles.summaryItem}>
            <strong>0.00</strong>
            <span>Fuel Amount</span>
          </div>
          <div className={styles.summaryItem}>
            <strong>0.0000</strong>
            <span>KM Running</span>
          </div>

          <button className={styles.exportBtn}>Export to Excel</button>
        </div>
      </div>

      {/* ===== HEADER 2 ===== */}
      <div className={styles.headerBottom}>
        <CustomDatePicker value={date} onChange={setDate}/>

        <div className={styles.rightStats}>
          <div>
            <strong>0.00</strong>
            <span>Vendor Pump Fuel</span>
          </div>
          <div>
            <strong>0.00</strong>
            <span>Reimbursed Fuel</span>
          </div>
          <div>
            <strong>0.00</strong>
            <span>Vendor Amount</span>
          </div>
          <div>
            <strong>0.00</strong>
            <span>Reimbursed Amount</span>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Vehicle Number</th>
              <th>Fuel Type</th>
              <th>Fuel Qty</th>
              <th>Meter Reading</th>
              <th>Fuel Amount</th>
              <th>Ward No.</th>
              <th>KM</th>
              <th>GPS KM</th>
              <th>Driver Name</th>
              <th>Reimbursement</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{row.vehicle}</td>
                <td>{row.fuelType}</td>
                <td>{row.qty}</td>
                <td>{row.meter}</td>
                <td>{row.amount}</td>
                <td>{row.ward}</td>
                <td>{row.km}</td>
                <td>{row.gpsKm}</td>
                <td>{row.driver}</td>
                <td>
                  <button
                    className={styles.reimburseBtn}
                    onClick={() => handleReimburseClick(row)}
                  >
                    Reimburse Fuel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showReimbursePopup && (
        <FuelReimbursement
          open={showReimbursePopup}
          onClose={() => setShowReimbursePopup(false)}
          data={selectedRow}
        />
      )}

    </div>
  );
};

export default FuelReport;
