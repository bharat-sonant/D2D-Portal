import React, { useState } from 'react';
import { supabase } from '../../createClient';
import { images } from '../../assets/css/imagePath';
import styles from '../../assets/css/modal.module.css';
import { FaSpinner } from 'react-icons/fa';
import { setAlertMessage } from '../../common/common';

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

  // Generate unique 6-character ID
  const generateUniqueId = async () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const generateId = () => {
      let id = '';
      for (let i = 0; i < 3; i++) id += letters[Math.floor(Math.random() * letters.length)];
      for (let i = 0; i < 3; i++) id += numbers[Math.floor(Math.random() * numbers.length)];
      return id;
    };

    while (true) {
      const newId = generateId();
      const { data } = await supabase.from('TaskData').select('uniqueId').eq('uniqueId', newId).maybeSingle();
      if (!data) return newId;
    }
  };

  // Save history function
  const saveHistory = async ({ oldValue = null, newValue, uniqueId, action }) => {
    try {
      const { error } = await supabase.from('TaskHistory').insert([
        {
          created_by: 'Ansh',
          created_at: new Date().toISOString(),
          oldvalue: oldValue ? JSON.stringify(oldValue) : null,
          newValue: newValue ? JSON.stringify(newValue) : null,
          uniqueId,
          action
        }
      ]);
      if (error) console.error('Error saving history:', error);
    } catch (err) {
      console.error('Unexpected error saving history:', err);
    }
  };

  const handleSave = async () => {
    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      setError('Task name is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check for duplicate task name
      const { data: existingTask } = await supabase
        .from('TaskData')
        .select('id, uniqueId')
        .eq('taskName', trimmedTitle)
        .maybeSingle();

      if (existingTask && (!isEditing || existingTask.uniqueId !== selectedTask?.uniqueId)) {
        setError('Task name already exists.');
        setLoading(false);
        return;
      }

      let uniqueId = selectedTask?.uniqueId || await generateUniqueId();
      let taskData = null;

      if (isEditing) {
        // Update task
        const { data: updatedData, error: updateError } = await supabase
          .from('TaskData')
          .update({ taskName: trimmedTitle })
          .eq('uniqueId', selectedTask.uniqueId)
          .select()
          .single();

        if (updateError) throw updateError;
        taskData = updatedData;

        await saveHistory({
          oldValue: { taskName: selectedTask.taskName },
          newValue: { taskName: trimmedTitle },
          uniqueId: selectedTask.uniqueId,
          action: 'edit'
        });

        setAlertMessage('success', 'Task updated successfully!');
      } else {
        // Insert new task
        const { data: insertedData, error: insertError } = await supabase
          .from('TaskData')
          .insert([{ taskName: trimmedTitle, uniqueId, created_by: 'Ansh', created_at: new Date().toISOString() }])
          .select()
          .single();

        if (insertError) throw insertError;
        taskData = insertedData;

        await saveHistory({
          oldValue: null,
          newValue: { taskName: trimmedTitle },
          uniqueId,
          action: 'add'
        });

        setAlertMessage('success', 'Task added successfully!');
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

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>Task Data</p>
          <button className={styles.closeBtn} onClick={() => setShowCanvas(false)}>
            <img src={images.iconClose} className={styles.iconClose} alt="close" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>Task Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox} ${error ? styles.errorInput : ''}`}
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

          {error && <div className={styles.errorMessage}>{error}</div>}

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
