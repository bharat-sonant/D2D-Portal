import React, { useEffect, useRef, useState } from "react";
import styles from "./AddFuelEntries.module.css";

const AddFuelEntries = ({
  showCanvas,
  setShowCanvas,
  errors,
  setErrors,
  form,
  setForm,
  onAddEntry,
  isEdit,
  editingId,
  setIsEdit,
  setEditingId,
  entries,
  setEntries,
}) => {
  const [meterPreview, setMeterPreview] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);

  const [meterFile, setMeterFile] = useState(null);
  const [slipFile, setSlipFile] = useState(null);

  const meterImageRef = useRef(null);
  const slipImageRef = useRef(null);

  useEffect(() => {
    if (isEdit) {
      const entry = entries.find((e) => e.id === editingId);
      if (entry) {
        setMeterPreview(entry.meterImage || null);
        setSlipPreview(entry.slipImage || null);
      }
    }
  }, [isEdit, editingId, entries]);

  if (!showCanvas) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCaptureClick = (inputRef) => {
    inputRef.current?.click();
  };

  const handleImageChange = (event, setPreview, setFile, errorKey) => {
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setErrors((prev) => ({ ...prev, [errorKey]: "" }));
  };

  const handleSubmit = () => {
    let newErrors = {};

    if (!form.vehicle) newErrors.vehicle = "Vehicle is required";
    if (!form.fuelType) newErrors.fuelType = "Fuel type is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.meterReading)
      newErrors.meterReading = "Meter reading is required";
    if (!form.fuelVehicle) newErrors.fuelVehicle = "Fuel vehicle is required";
    if (!form.petrolPump) newErrors.petrolPump = "Petrol pump is required";
    if (!form.quantity) newErrors.quantity = "Quantity is required";
    if (!form.amount) newErrors.amount = "Amount is required";
    if (!form.payMethod) newErrors.payMethod = "Payment method is required";
    if (!form.remark) newErrors.remark = "Please Enter Remark"
    if (!isEdit && !meterFile) newErrors.meterImage = "Meter image required";
    if (!isEdit && !slipFile) newErrors.slipImage = "Slip image required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (isEdit) {
      setEntries((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
              ...item,
              ...form,
              meterImage: meterPreview || item.meterImage,
              slipImage: slipPreview || item.slipImage,
            }
            : item
        )
      );
      setIsEdit(false);
      setEditingId(null);
    } else {
      onAddEntry({
        id: Date.now(),
        ...form,
        meterImage: meterPreview,
        slipImage: slipPreview,
        createdAt: new Date().toISOString(),
      });
    }
    resetForm();
    setShowCanvas(false);
  };

  const resetForm = () => {
    // Reset text fields
    setForm({
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

    // Reset errors
    setErrors({});

    setMeterPreview(null);
    setSlipPreview(null);

    // Reset image files
    setMeterFile(null);
    setSlipFile(null);

    // Reset file input values (VERY IMPORTANT)
    if (meterImageRef.current) meterImageRef.current.value = "";
    if (slipImageRef.current) slipImageRef.current.value = "";
  };

  const handleback = () => {
    setIsEdit(false);
    setEditingId(false)
    setShowCanvas(false);
    resetForm();
  }


  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={handleback}
        >
          ←
        </button>
        <h2 className={styles.title}>
          {isEdit ? "Edit Fuel Entry" : "Add Fuel Entry"}
        </h2>

      </div>

      <div className={styles.content}>
        <div className={styles.formCard}>
          <div className={styles.formFields}>
            {/* Vehicle */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Vehicle
                {errors.vehicle && (
                  <span className={styles.errorText}> · {errors.vehicle}</span>
                )}
              </label>

              <select
                className={`${styles.input} ${errors.vehicle ? styles.errorInput : ""}`}
                value={form.vehicle}
                onChange={(e) => handleChange("vehicle", e.target.value)}
              >
                <option value="">Select Vehicle</option>
                <option value="vehicle1">Vehicle 1</option>
                <option value="vehicle2">Vehicle 2</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Fuel Type
                {errors.fuelType && (
                  <span className={styles.errorText}> · {errors.fuelType}</span>
                )}
              </label>

              <select
                className={`${styles.input} ${errors.fuelType ? styles.errorInput : ""}`}
                value={form.fuelType}
                onChange={(e) => handleChange("fuelType", e.target.value)}
              >
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
              </select>
            </div>

            <div className={styles.row}>
              {/* Date */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Date
                  {errors.date && (
                    <span className={styles.errorText}> · {errors.date}</span>
                  )}
                </label>

                <input
                  type="date"
                  className={`${styles.input} ${errors.date ? styles.errorInput : ""}`}
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </div>

              {/* Meter Reading */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Meter Reading
                  {errors.meterReading && (
                    <span className={styles.errorText}>
                      {" "}
                      · {errors.meterReading}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  className={`${styles.input} ${errors.meterReading ? styles.errorInput : ""}`}
                  value={form.meterReading}
                  onChange={(e) => handleChange("meterReading", e.target.value)}
                />
              </div>
            </div>

            {/* Fuel Vehicle */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Fuel Vehicle
                {errors.fuelVehicle && (
                  <span className={styles.errorText}>
                    {" "}
                    · {errors.fuelVehicle}
                  </span>
                )}
              </label>

              <select
                className={`${styles.input} ${errors.fuelVehicle ? styles.errorInput : ""}`}
                value={form.fuelVehicle}
                onChange={(e) => handleChange("fuelVehicle", e.target.value)}
              >
                <option value="">Select Fuel Vehicle</option>
                <option value="d2d">D2D Vehicle</option>
                <option value="open_depo">Open Depo Vehicle</option>
              </select>
            </div>

            {/* Petrol Pump */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Petrol Pump
                {errors.petrolPump && (
                  <span className={styles.errorText}>
                    {" "}
                    · {errors.petrolPump}
                  </span>
                )}
              </label>

              <select
                className={`${styles.input} ${errors.petrolPump ? styles.errorInput : ""}`}
                value={form.petrolPump}
                onChange={(e) => handleChange("petrolPump", e.target.value)}
              >
                <option value="">Select Petrol Pump</option>
                <option value="pump1">Pump 1</option>
                <option value="pump2">Pump 2</option>
                <option value="pump3">Pump 3</option>
              </select>
            </div>

            {/* Quantity & Amount */}
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Quantity (Liters)
                  {errors.quantity && (
                    <span className={styles.errorText}>
                      {" "}
                      · {errors.quantity}
                    </span>
                  )}
                </label>

                <input
                  type="number"
                  className={`${styles.input} ${errors.quantity ? styles.errorInput : ""}`}
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Amount (₹)
                  {errors.amount && (
                    <span className={styles.errorText}> · {errors.amount}</span>
                  )}
                </label>

                <input
                  type="number"
                  className={`${styles.input} ${errors.amount ? styles.errorInput : ""}`}
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                />
              </div>
            </div>

            {/* Pay Method */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Pay Method
                {errors.payMethod && (
                  <span className={styles.errorText}>
                    {" "}
                    · {errors.payMethod}
                  </span>
                )}
              </label>

              <select
                className={`${styles.input} ${errors.payMethod ? styles.errorInput : ""}`}
                value={form.payMethod}
                onChange={(e) => handleChange("payMethod", e.target.value)}
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="fuel_card">Fuel Card</option>
              </select>
            </div>

            {/* Meter Reading */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Remark
                {errors.remark && (
                  <span className={styles.errorText}>
                    {" "}
                    · {errors.remark}
                  </span>
                )}
              </label>

              <textarea
                type="text"
                className={`${styles.input} ${errors.remark ? styles.errorInput : ""}`}
                value={form.remark}
                onChange={(e) => handleChange("remark", e.target.value)}
              />
            </div>

            {/* Meter Image */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Meter Reading Image
                {errors.meterImage && (
                  <span className={styles.errorText}>
                    {" "}
                    · {errors.meterImage}
                  </span>
                )}
              </label>

              <div
                className={styles.imagePreviewBox}
                onClick={() => handleCaptureClick(meterImageRef)}
              >
                {meterPreview ? (
                  <img src={meterPreview} className={styles.previewImage} />
                ) : (
                  <span className={styles.placeholderText}>
                    Upload Meter Image
                  </span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={meterImageRef}
                className={styles.fileInput}
                onChange={(e) =>
                  handleImageChange(
                    e,
                    setMeterPreview,
                    setMeterFile,
                    "meterImage",
                  )
                }
              />

              {/* Slip Image */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Amount Slip Image
                  {errors.slipImage && (
                    <span className={styles.errorText}>
                      {" "}
                      · {errors.slipImage}
                    </span>
                  )}
                </label>

                <div
                  className={styles.imagePreviewBox}
                  onClick={() => handleCaptureClick(slipImageRef)}
                >
                  {slipPreview ? (
                    <img src={slipPreview} className={styles.previewImage} />
                  ) : (
                    <span className={styles.placeholderText}>
                      Upload Slip Image
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={slipImageRef}
                  className={styles.fileInput}
                  onChange={(e) =>
                    handleImageChange(
                      e,
                      setSlipPreview,
                      setSlipFile,
                      "slipImage",
                    )
                  }
                />
              </div>

              {/* Save */}
              <button className={styles.saveDetailsButton} onClick={handleSubmit}>
                {isEdit ? "Update Entry" : "Save Details"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFuelEntries;
