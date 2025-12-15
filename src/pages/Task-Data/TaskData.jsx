import React, { useEffect, useState } from 'react';
import { supabase } from '../../createClient';
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import TaskStyles from '../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css';
import styles from '../../MobileAppPages/Tasks/Styles/TaskDetails/TaskDetails.module.css';
import { LucideSettings } from 'lucide-react';
import TaskList from '../../components/TaskData/TaskList';
import AddTaskData from '../../components/TaskData/AddTaskData';
import TaskDataSettings from './TaskDataSettings';

const TaskData = () => {
  const [taskData, setTaskData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsCanvas, setShowSettingsCanvas] = useState(false);

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = async () => {
    try {
      const { data, error } = await supabase.from('TaskData').select('*');
      if (error) throw error;

      const sorted = (data || []).sort((a, b) =>
        a.taskName.localeCompare(b.taskName, undefined, { sensitivity: 'base' })
      );

      setTaskData(sorted);

      // Ensure selected task exists
      if (!selectedTask || !sorted.find(t => t.id === selectedTask.id)) {
        setSelectedTask(sorted[0] || null);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTaskData([]);
      setSelectedTask(null);
    }
  };

  const openAddModalHandler = () => {
    setTaskTitle('');
    setIsEditing(false);
    setShowAddModal(true);
  };

  const openSettingsHandler = () => {
    if (!selectedTask) return alert('Please select a task first.');
    setShowSettingsCanvas(true);
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  const handleDeleteTask = async (task) => {
    if (!task?.id) return;

    try {
      const { error } = await supabase.from('TaskData').delete().eq('id', task.id);
      if (error) throw error;

      await fetchTaskData();

      if (selectedTask?.id === task.id) setSelectedTask(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete task. Check console.');
    }
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className={`${GlobalStyles.floatingDiv}`} style={{ bottom: '90px' }}>
        <button className={`${GlobalStyles.floatingBtn}`} onClick={openSettingsHandler}>
          <LucideSettings style={{ position: 'relative', bottom: '3px' }} />
        </button>
      </div>

      <div className={`${GlobalStyles.floatingDiv}`}>
        <button className={`${GlobalStyles.floatingBtn}`} onClick={openAddModalHandler}>
          +
        </button>
      </div>

      {/* Task List & Details */}
      <div className={`${TaskStyles.employeePage}`}>
        <div className={`${TaskStyles.employeeLeft}`}>
          <TaskList
            taskData={taskData}
            onSelectTask={handleSelectTask}
            selectedId={selectedTask?.id}
          />
        </div>

        <div className={`${TaskStyles.employeeRight}`}>
          <div className="row g-0">
            <div className={`col-md-5 ${GlobalStyles.pStart} ${GlobalStyles.pMobile}`}>
              <div className={styles.card}>
                <div className={styles.headerRow}>
                  <span className={styles.taskIdBadge}>{selectedTask?.uniqueId ?? 'N/A'}</span>
                  <h2 className={styles.name}>{selectedTask?.taskName ?? 'N/A'}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskData
        showCanvas={showAddModal}
        setShowCanvas={setShowAddModal}
        fetchTaskData={fetchTaskData}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/* Task Settings Canvas */}
      <TaskDataSettings
        openCanvas={showSettingsCanvas}
        onHide={() => setShowSettingsCanvas(false)}
        selectedTask={selectedTask}
        refreshTasks={fetchTaskData}
        handleDelete={handleDeleteTask}
        setShowCanvas={setShowAddModal}
        setOpenCanvas={setShowSettingsCanvas}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </>
  );
};

export default TaskData;
