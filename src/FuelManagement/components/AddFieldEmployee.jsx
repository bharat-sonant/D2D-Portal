import React, { useState } from 'react';
import styles from './AddFieldEmployee.module.css';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const AddFieldEmployee = ({ showCanvas, setShowCanvas, onAddEmployee, errors, setErrors }) => {
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

    setErrors(prev => ({
    ...prev,
    [name]: ""
  }));
  };

  const validate = () => {
  let newErrors = {};

  if (!formData.state) {
    newErrors.state = "State is required";
  }

  if (!formData.manager) {
    newErrors.manager = "Manager is required";
  }

  if (!formData.employeeName.trim()) {
    newErrors.employeeName = "Employee name is required";
  } else if (!/^[A-Za-z\s]+$/.test(formData.employeeName)) {
    newErrors.employeeName = "Name should contain only letters";
  }

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email address";
  }

  if (!formData.employeeId.trim()) {
    newErrors.employeeId = "Employee ID is required";
  }

  if (!formData.vehicleType) {
    newErrors.vehicleType = "Vehicle type is required";
  }

  if (!formData.average) {
    newErrors.average = "Average is required";
  } else if (Number(formData.average) <= 0) {
    newErrors.average = "Average must be greater than 0";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

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
                 {errors.state && (
                <ErrorMessage message={errors.state}/>
              )}
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
                 {errors.manager && (
                <ErrorMessage message={errors.manager}/>
              )}
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
                 {errors.employeeName && (
                <ErrorMessage message={errors.employeeName}/>
              )}
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
                {errors.email && (
                <ErrorMessage message={errors.email}/>
              )}
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
                />{errors.employeeId && (
                <ErrorMessage message={errors.employeeId}/>
              )}
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
                {errors.vehicleType && (
                <ErrorMessage message={errors.vehicleType}/>
              )}
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
                {errors.average && (
                <ErrorMessage message={errors.average}/>
              )}
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