import { images } from '../../assets/css/imagePath';
import styles from '../../assets/css/modal.module.css';

import { useState } from "react";
import { supabase } from '../../createClient';

const AddTaskData = ({ showCanvas, setShowCanvas, fetchTaskData }) => {
  const [taskTitle, setTaskTitle] = useState("");

  if (!showCanvas) return null;

  // ✅ Function to check if ID exists in Supabase
  const checkTaskId = async (id) => {
    const { data, error } = await supabase
      .from("TaskData")
      .select("uniqueId")
      .eq("uniqueId", id)
      .maybeSingle();

    if (error) {
      console.error("Error checking ID:", error);
      return true; // block insertion if error
    }

    return data !== null; // true = exists
  };

  // ✅ Your logic to generate unique ID
  const generateTaskId = async () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const generateId = () => {
      let id = "";
      for (let i = 0; i < 3; i++)
        id += letters[Math.floor(Math.random() * letters.length)];
      for (let i = 0; i < 3; i++)
        id += numbers[Math.floor(Math.random() * numbers.length)];
      return id;
    };

    while (true) {
      const newId = generateId();
      const exists = await checkTaskId(newId);
      if (!exists) return newId;
    }
  };

  // ================================
  // SAVE TASK
  // ================================
  const handleSave = async () => {
    if (!taskTitle.trim()) {
      alert("Please enter task name");
      return;
    }

    try {
      // ✅ Generate unique 6-digit ID
      const uniqueId = await generateTaskId();

      // Insert into Supabase
      const { data, error } = await supabase
        .from("TaskData")
        .insert([
          {
            taskName: taskTitle,
            uniqueId: uniqueId,   // ⬅️ Added unique ID here
            created_by: "Ansh",
            created_at: new Date().toISOString()
          }

        ]);
      fetchTaskData()

      if (error) throw error;

      setTaskTitle("");
      setShowCanvas(false);
    } catch (err) {
      console.error("Supabase Error:", err.message);
    }
  };

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
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
