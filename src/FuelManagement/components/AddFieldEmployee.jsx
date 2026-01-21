import React, { useState } from 'react';
import styles from './AddFieldEmployee.module.css';

const AddFieldEmployee = ({ showCanvas, setShowCanvas, onAddEmployee }) => {
  const [formData, setFormData] = useState({
    state: '',
    manager: '',
    employeeName: '',
    email: '',
    employeeId: '',
    vehicleType: '',
    average: ''
  });

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const managers = ['Manager 1', 'Manager 2', 'Manager 3', 'Manager 4'];
  const vehicleTypes = ['Two Wheeler', 'Four Wheeler'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = {
      id: Date.now(),
      ...formData
    }
    onAddEmployee(newEmployee)
    setShowCanvas(false);
    clearForm();
  };

  const handleClose = () => {
    setShowCanvas(false);
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      state: '',
      manager: '',
      employeeName: '',
      email: '',
      employeeId: '',
      vehicleType: '',
      average: ''
    });
  }

  if (!showCanvas) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={handleClose} />
      
      <div className={styles.modalContainer}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Add Field Employee</h2>
            <button onClick={handleClose} className={styles.closeButton}>
              <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={styles.modalBody}>
            {/* Row 1: State and Manager */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Select State <span className={styles.required}>*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Choose a state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Select Manager <span className={styles.required}>*</span>
                </label>
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Choose a manager</option>
                  {managers.map(manager => (
                    <option key={manager} value={manager}>{manager}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Employee Name and Email */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Employee Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  required
                  placeholder="Enter employee name"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="employee@example.com"
                  className={styles.input}
                />
              </div>
            </div>

            {/* Row 3: Employee ID and Vehicle Type */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Employee ID <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  placeholder="Enter employee ID"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Vehicle Type <span className={styles.required}>*</span>
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Choose vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Average (full width) */}
            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>
                  Average (km/l) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="average"
                  value={formData.average}
                  onChange={handleChange}
                  required
                  step="0.1"
                  placeholder="Enter fuel average"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={handleClose}
                className={styles.btnCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={styles.btnSubmit}
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFieldEmployee;