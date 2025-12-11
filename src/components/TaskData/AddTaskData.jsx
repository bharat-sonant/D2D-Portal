import { images } from '../../assets/css/imagePath';
import styles from '../../assets/css/modal.module.css';

import { useState } from "react";
import { supabase } from '../../createClient';

const AddTaskData = ({ showCanvas, setShowCanvas }) => {
  const [taskTitle, setTaskTitle] = useState("");

  if (!showCanvas) return null;

  const handleSave = async () => {
    if (!taskTitle.trim()) {
      alert("Please enter task name");
      return;
    }

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from("TaskData")
        .insert([
          {
            taskName: taskTitle,
            created_by: "Ansh",
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

    //   alert("Task saved successfully!");
      setTaskTitle("");
      setShowCanvas(false);
    } catch (err) {
      console.error("Supabase Error:", err.message);
    //   alert("Failed to save task. Please try again.");
    }
  };

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>Task Data</p>
          <button
            className={styles.closeBtn}
            onClick={() => setShowCanvas(false)}
            aria-label="Close"
          >
            <img
              src={images.iconClose}
              className={styles.iconClose}
              title="Close"
              alt="close"
            />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>Task Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter task name"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            className={`mt-3 ${styles.btnSave}`}
            onClick={handleSave}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddTaskData;
