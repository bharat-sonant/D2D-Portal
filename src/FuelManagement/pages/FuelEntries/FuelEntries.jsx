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

const vehicles = Array.from({ length: 40 }, (_, i) => {
  const km = Math.floor(Math.random() * 120) + 60;
  const liters = Math.floor(Math.random() * 15) + 10;
  const amount = liters * 90;
  return {
    id: i + 1,
    vehicle: `TATA-AT-${String(i + 1).padStart(4, "0")}`,
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
const bestVehicle = enrichedVehicles.reduce((a, b) => (a.average > b.average ? a : b));
const worstVehicle = enrichedVehicles.reduce((a, b) => (a.average < b.average ? a : b));

const runningVehicles = vehicles.filter((v) => v.km > 0).length;
const utilization = ((runningVehicles / vehicles.length) * 100).toFixed(0);

const lastMonthAvg = 5.4; // mock comparison
const improvement = (((fleetAvg - lastMonthAvg) / lastMonthAvg) * 100).toFixed(1);

export default function Dashboard() {
  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <h1 className="fw-bold mb-4">Fleet Performance Command Center</h1>

      {/* Top Insight Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body">
              <p className="text-muted">Fleet Avg (km/l)</p>
              <h4 className="fw-bold">{fleetAvg.toFixed(2)}</h4>
              <small>
                Last Month: {lastMonthAvg} | {improvement}% change
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 bg-danger text-white">
            <div className="card-body">
              <p>Vehicles Below 6 km/l</p>
              <h4>{belowTarget.length}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body">
              <p className="text-muted">Worst Performer</p>
              <h6>{worstVehicle.vehicle}</h6>
              <strong>{worstVehicle.average.toFixed(2)} km/l</strong>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body">
              <p className="text-muted">Best Performer</p>
              <h6>{bestVehicle.vehicle}</h6>
              <strong className="text-success">
                {bestVehicle.average.toFixed(2)} km/l
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body">
              <p>Total KM</p>
              <h5>{totalKM}</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body">
              <p>Total Fuel (L)</p>
              <h5>{totalLiters}</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body">
              <p>Total Fuel Cost</p>
              <h5>₹{totalAmount}</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0">
            <div className="card-body">
              <p>Cost Per KM</p>
              <h5>₹{costPerKmFleet.toFixed(2)}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Utilization */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <p>Fleet Utilization</p>
              <h4>{utilization}%</h4>
              <small>
                Running: {runningVehicles} / {vehicles.length}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-3">Mileage Comparison</h5>
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
  );
}
