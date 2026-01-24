import React, { useState } from 'react'
import styles from './AddTask.module.css'
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import modalStyles from '../../../assets/css/popup.module.css'
import { ClipboardList, X } from 'lucide-react';

const AddTask = ({taskName, setTaskName, description, setDescription, setOpenCanvas, isEdit,setIsEdit,setEditIndex, onSave}) => {
  
  const [taskError, setTaskError] = useState("");
  const [desError, setDesError] = useState("");

  const handleClose = () => {
    setOpenCanvas(false);
    resetForm();
  };

const validate = () => {
  let isValid = true;

  if (!taskName.trim()) {
    setTaskError("Task name is required");
    isValid = false;
  } else {
    setTaskError("");
  }

  if (!description.trim()) {
    setDesError("Description is required");
    isValid = false;
  } else {
    setDesError("");
  }

  return isValid;
};

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      taskName,
      description
    });
    resetForm();
  }

  const resetForm = () => {
    setEditIndex(null)
    setIsEdit(false);
    setTaskName("");
    setDescription("");
    setOpenCanvas(false);
  }

  return (
    <div className={modalStyles.overlay} aria-modal="true" role="dialog">
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.iconWrapper}>
              <ClipboardList className="map-icon" /> 
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>
                {isEdit ? 'Update Task' : 'Add New Task'}
              </h2>
            </div>
          <button className={modalStyles.closeBtn} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label>Task Name</label>
            <input
              type="text"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value)
                setTaskError("")
              }}
            />
            {taskError && ( 
              <ErrorMessage message={taskError}/>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Enter task description"
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setDesError("");
              }}
            />
            {desError && (
            <ErrorMessage message={desError}/>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            {isEdit ? 'Update Task' : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTask
