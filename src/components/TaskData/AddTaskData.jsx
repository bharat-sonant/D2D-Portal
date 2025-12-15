import { images } from '../../assets/css/imagePath';
import styles from '../../assets/css/modal.module.css';
import { useState } from "react";
import { supabase } from '../../createClient';

const AddTaskData = ({
  showCanvas,
  setShowCanvas,
  fetchTaskData,
  taskTitle,
  setTaskTitle,
  selectedTask,
  setTask,
  task,
  setSelected
}) => {

  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);

  if (!showCanvas) return null;

  // ===============================
  // DUPLICATE TASK NAME CHECK
  // ===============================
  const checkDuplicateTask = async (name) => {
    let query = supabase
      .from("TaskData")
      .select("id")
      .ilike("taskName", name.trim());

    // ✏️ Edit case → ignore current task
    if (selectedTask) {
      query = query.neq("id", selectedTask.id);
    }

    const { data } = await query;
    return data && data.length > 0;
  };

  // ===============================
  // UNIQUE ID CHECK
  // ===============================
  const checkTaskId = async (id) => {
    const { data } = await supabase
      .from("TaskData")
      .select("uniqueId")
      .eq("uniqueId", id)
      .maybeSingle();

    return data !== null;
  };

  // ===============================
  // UNIQUE ID GENERATOR
  // ===============================
  const generateTaskId = async () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const generateId = () => {
      let id = "";
      for (let i = 0; i < 3; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
      }
      for (let i = 0; i < 3; i++) {
        id += numbers[Math.floor(Math.random() * numbers.length)];
      }
      return id;
    };

    while (true) {
      const id = generateId();
      const exists = await checkTaskId(id);
      if (!exists) return id;
    }
  };

  // ===============================
  // SAVE / UPDATE TASK
  // ===============================
  const handleSave = async () => {
    if (!taskTitle.trim()) {
      setError("Task name is required");
      return;
    }

    try {
      setLoader(true);
      setError('');

      // ❌ DUPLICATE NAME CHECK
      const isDuplicate = await checkDuplicateTask(taskTitle);
      if (isDuplicate) {
        setError("Task with this name already exists");
        setLoader(false);
        return;
      }

      // ================= EDIT TASK =================
      if (selectedTask) {

        if (taskTitle.trim() === selectedTask.taskName.trim()) {
          setError("No changes detected");
          setLoader(false);
          return;
        }

        const { error } = await supabase
          .from("TaskData")
          .update({
            taskName: taskTitle,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedTask.id);

        if (error) throw error;

        await supabase.from("TaskHistory").insert([{
          created_by: "Ansh",
          created_at: new Date().toISOString(),
          oldvalue: JSON.stringify({ taskName: selectedTask.taskName }),
          newValue: JSON.stringify({ taskName: taskTitle }),
          uniqueId: selectedTask.uniqueId,
          action: "Task Edited"
        }]);
      }

      // ================= ADD TASK =================
      else {
        const uniqueId = await generateTaskId();

        const { error } = await supabase.from("TaskData").insert([{
          taskName: taskTitle,
          uniqueId,
          created_by: "Ansh",
          created_at: new Date().toISOString()
        }]);

        if (error) throw error;

        await supabase.from("TaskHistory").insert([{
          created_by: "Ansh",
          created_at: new Date().toISOString(),
          oldvalue: null,
          newValue: JSON.stringify({ taskName: taskTitle }),
          uniqueId,
          action: "Task Created"
        }]);
      }

      // ================= COMMON =================
      fetchTaskData();
      setTaskTitle("");
      setShowCanvas(false);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>

        <div className={styles.actionBtn}>
          <p className={styles.headerText}>
            {task ? "Edit Task" : "Add Task"}
          </p>

          <button
            className={styles.closeBtn}
            onClick={() => {
              setError('');
              setShowCanvas(false);
              setTask(false);
            }}
          >
            <img
              src={images.iconClose}
              className={styles.iconClose}
              alt="close"
            />
          </button>
        </div>

        {/* 🔴 ERROR MESSAGE */}
        {error && (
          <div style={{ color: "red", fontSize: 13, margin: "8px 16px" }}>
            {error}
          </div>
        )}

        <div className={styles.modalBody}>
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>Task Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox} ${error ? "is-invalid" : ""}`}
                  placeholder="Enter task name"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loader) handleSave();
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`mt-3 ${styles.btnSave}`}
            onClick={handleSave}
            disabled={loader}
          >
            {loader
              ? "Please wait..."
              : task
                ? "Update Task"
                : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskData;
