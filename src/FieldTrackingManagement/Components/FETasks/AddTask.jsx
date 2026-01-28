import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import modalStyles from "../../../assets/css/popup.module.css";
import { ClipboardList, ReceiptText, X } from "lucide-react";

const AddTask = ({
  taskName,
  setTaskName,
  description,
  setDescription,
  setOpenCanvas,
  isEdit,
  setIsEdit,
  setEditIndex,
  onSave,
}) => {
  const [taskError, setTaskError] = useState("");
  const [desError, setDesError] = useState("");
  const taskNameRef = useRef(null);

  useEffect(() => {
    taskNameRef.current?.focus();
  }, []);

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
      description,
    });
    resetForm();
  };

  const resetForm = () => {
    setEditIndex(null);
    setIsEdit(false);
    setTaskName("");
    setDescription("");
    setOpenCanvas(false);
  };

  return (
    <div className={modalStyles.overlay} aria-modal="true" role="dialog">
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.headerLeft}>
            <div className={modalStyles.iconWrapper}>
              <ClipboardList className="map-icon" />
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>
                {isEdit ? "Update Task" : "Add New Task"}
              </h2>
            </div>
          </div>
          <button className={modalStyles.closeBtn} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // 🚫 prevent page reload
            handleSave(); // ✅ save/update
          }}
        >
          <div className={`${modalStyles.modalBody}`}>
            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Task Name</label>
              <div className={modalStyles.inputWrapper}>
                <div className={modalStyles.inputIcon}>
                  <ClipboardList size={18} />
                </div>
                <input
                  className={modalStyles.input}
                  ref={taskNameRef}
                  type="text"
                  placeholder="Enter task name"
                  value={taskName}
                  onChange={(e) => {
                    setTaskName(e.target.value);
                    setTaskError("");
                  }}
                />
              </div>
              {taskError && <ErrorMessage message={taskError} />}
            </div>

            <div className={modalStyles.inputGroup}>
              <label className={modalStyles.label}>Description</label>
              <div className={`${modalStyles.inputWrapper} ${modalStyles.textareaWrapper}`}>
                <div className={modalStyles.inputIcon}>
                  <ReceiptText size={18} />
                </div>
                <textarea
                  className={modalStyles.input}
                  placeholder="Enter task description"
                  rows={5}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setDesError("");
                  }}
                />
              </div>
              {desError && <ErrorMessage message={desError} />}
            </div>
          </div>

          <div className={modalStyles.modalFooter}>
            {/* <button className={styles.cancelBtn} onClick={handleClose}>
            Cancel
          </button> */}
            <button className={modalStyles.submitBtn} onClick={handleSave}>
              {isEdit ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
