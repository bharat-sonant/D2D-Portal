import { useState } from "react";
import style from "../../../Style/Reports_Style/DailyFuelReport/DailyFuelReport.module.css";
import { FaChevronLeft, FaChevronRight, FaFileExcel } from "react-icons/fa";

const DailyFuelReport = () => {
    const [date] = useState("2025-12-02");

    const summary = {
        cng: 0,
        petrol: 0,
        dieselQty: 324.0,
        totalFuel: 324.0,
        fuelAmount: 29519.64,
        kmRunning: 1828.413,
        vendorPumpFuel: 324.0,
        reimbursedFuel: 0,
        vendorAmount: 29519.64,
        reimbursedAmount: 0,
    };

    const rows = [
        {
            sr: 17,
            vehicle: "LEY-AT-4618",
            fuelType: "Diesel",
            qty: 9,
            amount: "819.99",
            ward: "56A",
            km: "29.476",
            gpsKm: "24.891",
            driver: "Suniya MP (1218)",
        },
        {
            sr: 18,
            vehicle: "LEY-AT-4620",
            fuelType: "Diesel",
            qty: 5,
            amount: "455.55",
            ward: "21",
            km: "28.920",
            gpsKm: "20.680",
            driver: "Pawan MP (1479)",
        },
        {
            sr: 19,
            vehicle: "LEY-AT-7152",
            fuelType: "Diesel",
            qty: 10,
            amount: "911.10",
            ward: "10 / WetWaste-Beed-Trolly / WetWaste-14",
            km: "4.367",
            gpsKm: "25.457",
            driver: "Manish Kumar (511)",
        },
        {
            sr: 20,
            vehicle: "LEY-AT-7153",
            fuelType: "Diesel",
            qty: 5,
            amount: "455.55",
            ward: "53",
            km: "54.396",
            gpsKm: "41.595",
            driver: "Kamal Kumar (534)",
        },
    ];

    return (
        <div className={style.container}>

            {/* ---------- ROW 1: TITLE LEFT + SUMMARY RIGHT ---------- */}
            <div className={style.topHeader}>

                <h2 className={style.title}>Daily Fuel Report [02 Dec 2025]</h2>

                <div className={style.summaryInline}>
                    <div className={style.cardSmall}>0.00<br />CNG</div>
                    <div className={style.cardSmall}>0.00<br />Petrol</div>
                    <div className={style.cardSmall}>{summary.dieselQty}<br />Diesel Qty</div>
                    <div className={style.cardSmall}>{summary.totalFuel}<br />Total Fuel</div>
                    <div className={style.cardSmall}>{summary.fuelAmount}<br />Fuel Amount</div>
                    <div className={style.cardSmall}>{summary.kmRunning}<br />KM Running</div>

                    <button className={style.excelBtn}>
                        <FaFileExcel /> Export to Excel
                    </button>
                </div>

            </div>

            {/* ---------- ROW 2: DATE LEFT + 4 CARDS RIGHT ---------- */}
            <div className={style.summaryRow2}>

                <div className={style.leftDate}>
                    <button className={style.dateBtn}><FaChevronLeft /></button>
                    <div className={style.dateDisplay}>02-Dec-2025</div>
                    <button className={style.dateBtn}><FaChevronRight /></button>
                </div>
                <div className={style.rightDetails}>
                    <div className={style.cardSmall}>{summary.vendorPumpFuel}<br />Vendor Pump Fuel</div>
                    <div className={style.cardSmall}>{summary.reimbursedFuel}<br />Reimbursed Fuel</div>
                    <div className={style.cardSmall}>{summary.vendorAmount}<br />Vendor Amount</div>
                    <div className={style.cardSmall}>{summary.reimbursedAmount}<br />Reimbursed Amount</div>

                </div>

            </div>

            {/* ---------- TABLE ---------- */}
            <div className={style.tableWrapper}>
                <table className={style.table}>

                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Vehicle Number</th>
                            <th>Fuel Type</th>
                            <th>Fuel Qty</th>
                            <th>Fuel Amount</th>
                            <th>Ward No.</th>
                            <th>KM</th>
                            <th>GPS KM</th>
                            <th>Driver Name</th>
                            <th>Reimbursement</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i}>
                                <td>{r.sr}</td>
                                <td>{r.vehicle}</td>
                                <td>{r.fuelType}</td>
                                <td>{r.qty}</td>
                                <td>{r.amount}</td>
                                <td>{r.ward}</td>
                                <td>{r.km}</td>
                                <td>{r.gpsKm}</td>
                                <td>{r.driver}</td>
                                <td>
                                    <button className={style.reimburseBtn}>Reimburse Diesel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default DailyFuelReport;
