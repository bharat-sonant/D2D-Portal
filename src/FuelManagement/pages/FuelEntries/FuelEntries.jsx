import React, { useState } from 'react';
import AddFuelEntries from '../../components/FuelEntries/AddFuelEntries';
import styles from './FuelEntries.module.css';
import CustomDatePicker from '../../../components/CustomDatePicker/CustomDatePicker';
import dayjs from 'dayjs';
import { Edit, Image } from 'lucide-react';

const FuelEntries = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchVehicle, setSearchVehicle] = useState("");
   const [form, setForm] = useState({
      vehicle: "",
      fuelType: "",
      date: "",
      meterReading: "",
      fuelVehicle: "",
      petrolPump: "",
      quantity: "",
      amount: "",
      payMethod: "",
      remark: ""
    });
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [showCanvas, setShowCanvas] = useState(false);
  const [entries, setEntries] = useState([]);
  const [errors, setErrors] = useState({
    vehicle: "",
    fuelType: "",
    date: "",
    meterReading: "",
    fuelVehicle: "",
    petrolPump: "",
    quantity: "",
    amount: "",
    payMethod: "",
    meterImage: "",
    slipImage: "",
    remark: ""
  });

  const handleAddEntry = (newEntry) => {
  setEntries((prev) => [newEntry, ...prev]);
};

const filteredEntries = entries.filter((entry) => {
  const matchVehicle = entry.vehicle
    .toLowerCase()
    .includes(searchVehicle.toLowerCase());

  // const matchDate = date ? entry.date === date : true;

  return matchVehicle;
});

  const handleEdit = (entry) => {
  setForm({
    vehicle: entry.vehicle,
    fuelType: entry.fuelType,
    date: entry.date,
    meterReading: entry.meterReading,
    fuelVehicle: entry.fuelVehicle,
    petrolPump: entry.petrolPump,
    quantity: entry.quantity,
    amount: entry.amount,
    payMethod: entry.payMethod,
    remark: entry.remark || "",
  });

  setIsEdit(true);
  setEditingId(entry.id);
  setShowCanvas(true);
};

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Fuel Entries</h1>
        <button
          onClick={() => setShowCanvas(true)}
          className={styles.addButton}
        >
          +
        </button>
      </div>

      <div className={styles.filterBar}>
        <CustomDatePicker value={date} onChange={setDate}/>
        <input
          type="text"
          placeholder="Search by vehicle"
          className={styles.searchInput}
          value={searchVehicle}
          onChange={(e) => setSearchVehicle(e.target.value)}
        />

      </div>

      {/* Content Area */}
     <div className={styles.content}>
      {filteredEntries?.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No fuel entries yet</p>
          <p className={styles.emptyStateSubtext}>
            Tap the + button to add your first entry
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filteredEntries.map((entry) => (
          <div key={entry.id} className={styles.card}>
            {/* Top row */}
            <div className={styles.cardTop}>
              <div>
                <div className={styles.vehicleName}>{entry.vehicle}</div>
                <div className={styles.entryDate}>{entry.date}</div>
              </div>

              <div className={styles.amount}>₹{entry.amount}</div>
              <Image size={20}/>
              <Edit size={20} onClick={() => handleEdit(entry)} />

            </div>

            {/* Middle grid */}
            <div className={styles.cardGrid}>
              <div>
                <span className={styles.label}>Meter</span>
                <span className={styles.value}>{entry.meterReading}</span>
              </div>

              <div>
                <span className={styles.label}>Fuel</span>
                <span className={styles.value}>{entry.fuelType}</span>
              </div>

              <div>
                <span className={styles.label}>Qty</span>
                <span className={styles.value}>{entry.quantity} L</span>
              </div>

              <div>
                <span className={styles.label}>Fuel Vehicle</span>
                <span className={styles.value}>{entry.fuelVehicle}</span>
              </div>

              <div>
                <span className={styles.label}>Pump</span>
                <span className={styles.value}>{entry.petrolPump}</span>
              </div>

              <div>
                <span className={styles.label}>Pay</span>
                <span className={styles.value}>{entry.payMethod}</span>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>


      {/* Add Fuel Entries Modal */}
      <AddFuelEntries
        showCanvas={showCanvas}
        setShowCanvas={setShowCanvas}
        errors={errors}
        setErrors={setErrors}
        form={form}
        setForm={setForm}
        onAddEntry={handleAddEntry}
        isEdit={isEdit}
  editingId={editingId}
  setIsEdit={setIsEdit}
  setEditingId={setEditingId}
  entries={entries}
  setEntries={setEntries}
      />
    </div>
  );
};

export default FuelEntries;
