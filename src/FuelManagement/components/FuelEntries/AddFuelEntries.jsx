import React, { useRef, useState } from "react";
import styles from "./AddFuelEntries.module.css";

const AddFuelEntries = ({ showCanvas, setShowCanvas }) => {
  const [meterPreview, setMeterPreview] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);

  const meterImageRef = useRef(null);
  const slipImageRef = useRef(null);

  const handleSubmit = () => {
    console.log("Form submitted");
    setShowCanvas(false);
  };

  const handleCaptureClick = (inputRef) => {
    inputRef.current?.click();
  };

  const handleImageChange = (event, setPreview) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  if (!showCanvas) return null;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => setShowCanvas(false)}
        >
          ←
        </button>
        <h2 className={styles.title}>Add Fuel Entry</h2>
      </div>

      {/* Page Content */}
      <div className={styles.content}>
        {/* Form Card */}
        <div className={styles.formCard}>
          <div className={styles.formFields}>
            {/* Vehicle */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Vehicle</label>
              <select className={styles.input}>
                <option value="">Select Vehicle</option>
                <option value="vehicle1">Vehicle 1</option>
                <option value="vehicle2">Vehicle 2</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Fuel Type</label>
              <select className={styles.input}>
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
              </select>
            </div>

            {/* Date */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date</label>
              <input type="date" className={styles.input} />
            </div>

            {/* Meter Reading */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Meter Reading</label>
              <input
                type="number"
                placeholder="Enter meter reading"
                className={styles.input}
              />
            </div>

            {/* Fuel Vehicle */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Fuel Vehicle</label>
              <select className={styles.input}>
                <option value="">Select Fuel Vehicle</option>
                <option value="d2d">D2D Vehicle</option>
                <option value="open_depo">Open Depo Vehicle</option>
              </select>
            </div>

            {/* Petrol Pump */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Petrol Pump</label>
              <select className={styles.input}>
                <option value="">Select Petrol Pump</option>
                <option value="pump1">Pump 1</option>
                <option value="pump2">Pump 2</option>
                <option value="pump3">Pump 3</option>
              </select>
            </div>

           <div className={styles.row}>
             {/* Quantity */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Quantity (Liters)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className={styles.input}
              />
            </div>

            {/* Amount */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className={styles.input}
              />
            </div>
           </div>

            {/* Pay Method */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Pay Method</label>
              <select className={styles.input}>
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="fuel_card">Fuel Card</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Meter Reading Image</label>

              {/* Preview Box */}
              <div className={styles.imagePreviewBox}>
                {meterPreview ? (
                  <img
                    src={meterPreview}
                    alt="Meter Reading"
                    className={styles.previewImage}
                  />
                ) : (
                  <span className={styles.placeholderText}>
                    No image selected
                  </span>
                )}
              </div>

              <div className={styles.uploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={meterImageRef}
                  className={styles.fileInput}
                  onChange={(e) => handleImageChange(e, setMeterPreview)}
                />
                <button
                  type="button"
                  onClick={() => handleCaptureClick(meterImageRef)}
                  className={styles.captureButton}
                >
                  <span className={styles.cameraIcon}>📷</span>
                  <span>Capture Meter Reading</span>
                </button>
              </div>
            </div>

            {/* Upload Amount Slip Image */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Amount Slip Image</label>

              {/* Preview Box */}
              <div className={styles.imagePreviewBox}>
                {slipPreview ? (
                  <img
                    src={slipPreview}
                    alt="Amount Slip"
                    className={styles.previewImage}
                  />
                ) : (
                  <span className={styles.placeholderText}>
                    No image selected
                  </span>
                )}
              </div>

              <div className={styles.uploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={slipImageRef}
                  className={styles.fileInput}
                  onChange={(e) => handleImageChange(e, setSlipPreview)}
                />
                <button
                  type="button"
                  onClick={() => handleCaptureClick(slipImageRef)}
                  className={styles.captureButton}
                >
                  <span className={styles.cameraIcon}>📷</span>
                  <span>Capture Amount Slip</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.saveDetailsButton}
            >
              Save Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFuelEntries;
