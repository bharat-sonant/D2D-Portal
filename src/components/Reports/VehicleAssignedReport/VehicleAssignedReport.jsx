import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaFileExcel } from "react-icons/fa";
import style from "../../../Style/Reports_Style/VehicleAssignedReport/VehicleAssignedReport.module.css";

const VehicleAssignedReport = () => {

  const [date, setDate] = useState("2025-12-09");

  const rows = [
    { sr: 1, vehicle: "COMP-0000", driver: "SATISH (C) - 1234567890" },
    { sr: 2, vehicle: "LEY-AT-4388", driver: "AKAILESH PARGI MP - 9171212633" },
    { sr: 3, vehicle: "LEY-AT-4611", driver: "LALCHAND - 8769420726" },
    { sr: 4, vehicle: "LEY-AT-4612", driver: "DINESH KUMAR DHAKA - 9785303137" },
    { sr: 5, vehicle: "LEY-AT-4618", driver: "SUNIYA MP - 9630333466" },
    { sr: 6, vehicle: "LEY-AT-7153", driver: "AAZAD - 9057374098" },
    { sr: 7, vehicle: "LEY-AT-7154", driver: "MO SHARIF - 9784542280" },
    { sr: 8, vehicle: "LEY-AT-7157", driver: "PAWAN MP - 8770014973" },
    { sr: 9, vehicle: "LEY-AT-7174", driver: "SANWAR LAL - 8875907595" },
    { sr: 10, vehicle: "LODER-7705", driver: "RAKESH CHOUDARY - 9667475134" },
    { sr: 11, vehicle: "MAH-AT-2566", driver: "SANTOSH - 9098376391" },
    { sr: 12, vehicle: "MAH-AT-5929", driver: "BHARAT VENDOR - 6367844357" },
    { sr: 13, vehicle: "MAH-AT-9555", driver: "GULSAN VENDOR - 9511318459" },
    { sr: 14, vehicle: "TATA-AT-0653", driver: "SANDEEP KUMAR - 6350286213" },
  ];

  return (
    <div className={style.container}>

      {/* -------- TOP BAR -------- */}
      <div className={style.topBar}>

        <button className={style.navBtn}><FaChevronLeft /></button>

        <input
          type="date"
          className={style.dateInput}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className={style.navBtn}><FaChevronRight /></button>

        <button className={style.exportBtn}>
          <FaFileExcel /> Export
        </button>
      </div>

      {/* -------- TABLE -------- */}
      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>S No.</th>
              <th>Vehicle</th>
              <th>Driver</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.sr}</td>
                <td>{row.vehicle}</td>
                <td>{row.driver}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default VehicleAssignedReport;
