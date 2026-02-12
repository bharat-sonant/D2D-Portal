// import React, { useState } from 'react';
// import AddFuelEntries from '../../components/FuelEntries/AddFuelEntries';
// import styles from './FuelEntries.module.css';
// import CustomDatePicker from '../../../components/CustomDatePicker/CustomDatePicker';
// import dayjs from 'dayjs';
// import { Edit, Image } from 'lucide-react';

// const FuelEntries = () => {
//   const [isEdit, setIsEdit] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [searchVehicle, setSearchVehicle] = useState("");
//    const [form, setForm] = useState({
//       vehicle: "",
//       fuelType: "",
//       date: "",
//       meterReading: "",
//       fuelVehicle: "",
//       petrolPump: "",
//       quantity: "",
//       amount: "",
//       payMethod: "",
//       remark: ""
//     });
//     const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
//   const [showCanvas, setShowCanvas] = useState(false);
//   const [entries, setEntries] = useState([]);
//   const [errors, setErrors] = useState({
//     vehicle: "",
//     fuelType: "",
//     date: "",
//     meterReading: "",
//     fuelVehicle: "",
//     petrolPump: "",
//     quantity: "",
//     amount: "",
//     payMethod: "",
//     meterImage: "",
//     slipImage: "",
//     remark: ""
//   });

//   const handleAddEntry = (newEntry) => {
//   setEntries((prev) => [newEntry, ...prev]);
// };

// const filteredEntries = entries.filter((entry) => {
//   const matchVehicle = entry.vehicle
//     .toLowerCase()
//     .includes(searchVehicle.toLowerCase());

//   // const matchDate = date ? entry.date === date : true;

//   return matchVehicle;
// });

//   const handleEdit = (entry) => {
//   setForm({
//     vehicle: entry.vehicle,
//     fuelType: entry.fuelType,
//     date: entry.date,
//     meterReading: entry.meterReading,
//     fuelVehicle: entry.fuelVehicle,
//     petrolPump: entry.petrolPump,
//     quantity: entry.quantity,
//     amount: entry.amount,
//     payMethod: entry.payMethod,
//     remark: entry.remark || "",
//   });

//   setIsEdit(true);
//   setEditingId(entry.id);
//   setShowCanvas(true);
// };

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <h1 className={styles.title}>Fuel Entries</h1>
//         <button
//           onClick={() => setShowCanvas(true)}
//           className={styles.addButton}
//         >
//           +
//         </button>
//       </div>

//       <div className={styles.filterBar}>
//         <CustomDatePicker value={date} onChange={setDate}/>
//         <input
//           type="text"
//           placeholder="Search by vehicle"
//           className={styles.searchInput}
//           value={searchVehicle}
//           onChange={(e) => setSearchVehicle(e.target.value)}
//         />

//       </div>

//       {/* Content Area */}
//      <div className={styles.content}>
//       {filteredEntries?.length === 0 ? (
//         <div className={styles.emptyState}>
//           <p>No fuel entries yet</p>
//           <p className={styles.emptyStateSubtext}>
//             Tap the + button to add your first entry
//           </p>
//         </div>
//       ) : (
//         <div className={styles.list}>
//           {filteredEntries.map((entry) => (
//           <div key={entry.id} className={styles.card}>
//             {/* Top row */}
//             <div className={styles.cardTop}>
//               <div>
//                 <div className={styles.vehicleName}>{entry.vehicle}</div>
//                 <div className={styles.entryDate}>{entry.date}</div>
//               </div>

//               <div className={styles.amount}>₹{entry.amount}</div>
//               <Image size={20}/>
//               <Edit size={20} onClick={() => handleEdit(entry)} />

//             </div>

//             {/* Middle grid */}
//             <div className={styles.cardGrid}>
//               <div>
//                 <span className={styles.label}>Meter</span>
//                 <span className={styles.value}>{entry.meterReading}</span>
//               </div>

//               <div>
//                 <span className={styles.label}>Fuel</span>
//                 <span className={styles.value}>{entry.fuelType}</span>
//               </div>

//               <div>
//                 <span className={styles.label}>Qty</span>
//                 <span className={styles.value}>{entry.quantity} L</span>
//               </div>

//               <div>
//                 <span className={styles.label}>Fuel Vehicle</span>
//                 <span className={styles.value}>{entry.fuelVehicle}</span>
//               </div>

//               <div>
//                 <span className={styles.label}>Pump</span>
//                 <span className={styles.value}>{entry.petrolPump}</span>
//               </div>

//               <div>
//                 <span className={styles.label}>Pay</span>
//                 <span className={styles.value}>{entry.payMethod}</span>
//               </div>
//             </div>
//           </div>
//           ))}
//         </div>
//       )}
//     </div>


//       {/* Add Fuel Entries Modal */}
//       <AddFuelEntries
//         showCanvas={showCanvas}
//         setShowCanvas={setShowCanvas}
//         errors={errors}
//         setErrors={setErrors}
//         form={form}
//         setForm={setForm}
//         onAddEntry={handleAddEntry}
//         isEdit={isEdit}
//   editingId={editingId}
//   setIsEdit={setIsEdit}
//   setEditingId={setEditingId}
//   entries={entries}
//   setEntries={setEntries}
//       />
//     </div>
//   );
// };

// export default FuelEntries;








import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

const companies = ["TATA", "Mahindra", "Leyland"];

const companyTargets = {
  TATA: 12,
  Mahindra: 10,
  Leyland: 8,
};

const vehicles = Array.from({ length: 40 }, (_, i) => {
  const km = Math.floor(Math.random() * 120) + 60;
  const liters = Math.floor(Math.random() * 15) + 10;
  const amount = liters * 90;
  const company = companies[i % companies.length];

  return {
    id: i + 1,
    vehicle: `${company}-AT-${String(i + 1).padStart(4, "0")}`,
    company,
    km,
    liters,
    amount,
  };
});

const enrichedVehicles = vehicles.map((v) => {
  const average = v.km / v.liters;
  return {
    ...v,
    average,
    costPerKm: v.amount / v.km,
  };
});

const totalKM = vehicles.reduce((acc, v) => acc + v.km, 0);
const totalLiters = vehicles.reduce((acc, v) => acc + v.liters, 0);
const totalAmount = vehicles.reduce((acc, v) => acc + v.amount, 0);
const fleetAvg = totalKM / totalLiters;
const costPerKmFleet = totalAmount / totalKM;

const belowTarget = enrichedVehicles.filter((v) => v.average < 6);
const bestVehicle = enrichedVehicles.reduce((a, b) =>
  a.average > b.average ? a : b
);
const worstVehicle = enrichedVehicles.reduce((a, b) =>
  a.average < b.average ? a : b
);

const lastMonthAvg = 5.4;
const improvement = (((fleetAvg - lastMonthAvg) / lastMonthAvg) * 100).toFixed(1);

// COMPANY ANALYTICS
const companyStats = Object.values(
  enrichedVehicles.reduce((acc, v) => {
    if (!acc[v.company]) {
      acc[v.company] = {
        company: v.company,
        totalKM: 0,
        totalLiters: 0,
        totalFuelCost: 0,
      };
    }

    acc[v.company].totalKM += v.km;
    acc[v.company].totalLiters += v.liters;
    acc[v.company].totalFuelCost += v.amount;

    return acc;
  }, {})
).map((c) => {
  const targetAvg = companyTargets[c.company];
  const actualAvg = c.totalKM / c.totalLiters;
  const expectedKM = c.totalLiters * targetAvg;
  const kmLoss = expectedKM - c.totalKM;
  const costPerKmCompany = c.totalFuelCost / c.totalKM;

  return {
    ...c,
    targetAvg,
    actualAvg,
    expectedKM,
    kmLoss,
    fuelLoss: kmLoss * costPerKmCompany,
    efficiency: ((c.totalKM / expectedKM) * 100).toFixed(0),
  };
});

const fleetExpectedKM = companyStats.reduce(
  (acc, c) => acc + c.expectedKM,
  0
);

const fleetKmLoss = fleetExpectedKM - totalKM;
const fleetFuelLossRupees = fleetKmLoss * costPerKmFleet;

export default function FuelEntries() {
  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        <h2 className="fw-bold mb-1">Fleet Intelligence Dashboard</h2>
        <p className="text-muted mb-4">
          Real-time performance, efficiency & financial impact overview
        </p>

        {/* CRITICAL KPI ROW */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">Total Fuel Filled</small>
                <h3 className="fw-bold">{totalLiters.toFixed(0)} L</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">Total Running KM</small>
                <h3 className="fw-bold">{totalKM.toFixed(0)}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">Total Fuel Amount</small>
                <h3 className="fw-bold">₹{totalAmount.toFixed(0)}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">Fleet Avg</small>
                <h3 className="fw-bold">{fleetAvg.toFixed(2)} km/l</h3>
                <small>
                  Last Month: {lastMonthAvg} | {improvement}%
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <small className="text-muted">Expected Fleet KM</small>
                <h3 className="fw-bold">{fleetExpectedKM.toFixed(0)}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm bg-danger text-white h-100">
              <div className="card-body">
                <small>Total KM Loss</small>
                <h3>{fleetKmLoss.toFixed(0)}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm bg-dark text-white h-100">
              <div className="card-body">
                <small>Total Fuel Loss</small>
                <h3>₹{fleetFuelLossRupees.toFixed(0)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* PERFORMANCE SNAPSHOT */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <small className="text-muted">Vehicles Below 6 km/l</small>
                <h4 className="text-danger fw-bold">
                  {belowTarget.length}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <small className="text-muted">Worst Performer</small>
                <h6>{worstVehicle.vehicle}</h6>
                <strong className="text-danger">
                  {worstVehicle.average.toFixed(2)} km/l
                </strong>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <small className="text-muted">Best Performer</small>
                <h6>{bestVehicle.vehicle}</h6>
                <strong className="text-success">
                  {bestVehicle.average.toFixed(2)} km/l
                </strong>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <small className="text-muted">Cost Per KM</small>
                <h4 className="fw-bold">
                  ₹{costPerKmFleet.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* COMPANY TABLE */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Company Performance</h5>
            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Company</th>
                    <th>Fuel</th>
                    <th>KM</th>
                    <th>Target</th>
                    <th>Actual</th>
                    <th>Expected KM</th>
                    <th>KM Loss</th>
                    <th>₹ Loss</th>
                    <th>Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {companyStats.map((c) => (
                    <tr key={c.company}>
                      <td className="fw-semibold">{c.company}</td>
                      <td>{c.totalLiters}</td>
                      <td>{c.totalKM}</td>
                      <td>{c.targetAvg}</td>
                      <td>
                        <span
                          className={`badge ${
                            c.actualAvg < c.targetAvg
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {c.actualAvg.toFixed(2)}
                        </span>
                      </td>
                      <td>{c.expectedKM.toFixed(0)}</td>
                      <td className="text-danger">
                        {c.kmLoss.toFixed(0)}
                      </td>
                      <td className="text-danger fw-bold">
                        ₹{c.fuelLoss.toFixed(0)}
                      </td>
                      <td>
                        <strong
                          className={
                            c.efficiency < 80
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          {c.efficiency}%
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Vehicle Mileage Distribution</h5>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={enrichedVehicles}>
                <XAxis dataKey="vehicle" hide />
                <YAxis />
                <Tooltip formatter={(value) => value.toFixed(2)} />
                <ReferenceLine y={6} stroke="red" strokeDasharray="3 3" />
                <ReferenceLine y={10} stroke="green" strokeDasharray="3 3" />
                <Bar dataKey="average">
                  {enrichedVehicles.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.average < 6 ? "#dc3545" : "#198754"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
