import React, { useState } from "react";
import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";
import { FaSpinner } from "react-icons/fa";
import * as TaskAction from "../../Actions/TaskAction/TaskAction";

/* ================= COMPONENT ================= */

const AddTaskData = ({
  showCanvas,
  setShowCanvas,
  fetchTaskData,
  taskTitle,
  setTaskTitle,
  selectedTask,
  setSelectedTask,
  isEditing,
  setIsEditing
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showCanvas) return null;

  const handleSave = () => {
    TaskAction.saveOrUpdateTask({
      taskTitle,
      isEditing,
      selectedTask,
      fetchTaskData,
      setSelectedTask,
      setShowCanvas,
      setIsEditing,
      setTaskTitle,
      setError,
      setLoading
    });
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>Task Data</p>
          <button
            className={styles.closeBtn}
            onClick={() => setShowCanvas(false)}
          >
            <img
              src={images.iconClose}
              className={styles.iconClose}
              alt="close"
            />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>Task Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox} ${
                    error ? styles.errorInput : ""
                  }`}
                  placeholder="Enter task name"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <button
            type="button"
            className={`mt-3 ${styles.btnSave}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.Loginloadercontainer}>
                <FaSpinner className={styles.spinnerLogin} />
                <span className={styles.loaderText}>Please wait...</span>
              </div>
            ) : isEditing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskData;
