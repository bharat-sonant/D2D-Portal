import React, { useState } from 'react';
import { supabase } from '../../createClient';
import { images } from '../../assets/css/imagePath';
import styles from '../../assets/css/modal.module.css';
import { FaSpinner } from 'react-icons/fa';
import { setAlertMessage } from '../../common/common';

/* ================= UNIQUE ID GENERATOR ================= */

const generateTaskId = async (checkTaskId) => {
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

const city = localStorage.getItem('city');


const checkTaskIdExists = async (uniqueId) => {
  const { data } = await supabase
    .from('TaskData')
    .select('id')
    .eq('uniqueId', uniqueId)
    .maybeSingle();

  return !!data;
};

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showCanvas) return null;

  const handleSave = async () => {
    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      setError('Task name is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      /* ===== Duplicate Task Name Check ===== */

      const { data: existingTask } = await supabase
        .from('TaskData')
        .select('id')
        .eq('taskName', trimmedTitle)
        .maybeSingle();

      if (existingTask && (!isEditing || existingTask.id !== selectedTask?.id)) {
        setError('Task name already exists.');
        setLoading(false);
        return;
      }

      let taskData = null;

      if (isEditing) {
        /* ================= UPDATE TASK ================= */

        const { data: updatedData, error: updateError } = await supabase
          .from('TaskData')
          .update({ taskName: trimmedTitle })
          .eq('id', selectedTask.id)
          .select()
          .single();

        if (updateError) throw updateError;
        taskData = updatedData;

        setAlertMessage('success', 'Task updated successfully!');

        /* ===== Save Update History (with uniqueId) ===== */

        await supabase.from('TaskHistory').insert([{
          taskId: taskData.id,
          uniqueId: taskData.uniqueId,
            cityId: city,
          action: 'Updated',
          oldvalue: selectedTask.taskName,
          newValue: taskData.taskName,
          created_by: 'Ansh',
          created_at: new Date().toISOString()
        }]);

      } else {
        /* ================= CREATE NEW TASK ================= */

        const uniqueId = await generateTaskId(checkTaskIdExists);

        const { data: insertedData, error: insertError } = await supabase
          .from('TaskData')
          .insert([{
            taskName: trimmedTitle,
            uniqueId: uniqueId,
              cityId: city,
            created_by: 'Ansh',
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        taskData = insertedData;

        setAlertMessage('success', 'Task added successfully!');

        /* ===== Save Create History (with uniqueId) ===== */

        await supabase.from('TaskHistory').insert([{
          taskId: taskData.id,
          uniqueId: taskData.uniqueId,
            cityId: city,
          action: 'Created',
          oldvalue: null,
          newValue: taskData.taskName,
          created_by: 'Ansh',
          created_at: new Date().toISOString()
        }]);
      }

      fetchTaskData();
      if (taskData) setSelectedTask(taskData);

      setTaskTitle('');
      setIsEditing(false);
      setTimeout(() => setShowCanvas(false), 500);

    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
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
                    error ? styles.errorInput : ''
                  }`}
                  placeholder="Enter task name"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    if (error) setError('');
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
            ) : isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskData;
