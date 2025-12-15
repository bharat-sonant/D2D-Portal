import React, { useEffect, useState } from 'react';
import { supabase } from '../../createClient';
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import TaskStyles from '../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css';
import TaskList from '../../components/TaskData/TaskList';
import AddTaskData from '../../components/TaskData/AddTaskData';
import styles from '../../MobileAppPages/Tasks/Styles/TaskDetails/TaskDetails.module.css';
import { LucideSettings } from 'lucide-react';
import TaskDataSettings from './TaskDataSettings';

const TaskData = () => {
  const [taskData, setTaskData] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [openCanvas, setOpenCanvas] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [task, setTask] = useState(false);

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = async () => {
    try {
      const { data, error } = await supabase
        .from('TaskData')
        .select('*');

      if (error) {
        console.error('Error fetching task data:', error);
        setTaskData([]);
        setSelectedId(null);
        setSelected(null);
        return;
      }

      // Case-insensitive alphabetical sort (aA, bB, cC)
      const sortedTaskData = [...(data || [])].sort((a, b) =>
        a.taskName.localeCompare(b.taskName, undefined, { sensitivity: 'base' })
      );

      setTaskData(sortedTaskData || []);

      // Keep previously selected if still present, otherwise pick first
      if (selectedId) {
        const stillExists = sortedTaskData.find((t) => t.id === selectedId);
        if (stillExists) {
          setSelected(stillExists);
        } else if (sortedTaskData.length > 0) {
          setSelectedId(sortedTaskData[0].id);
          setSelected(sortedTaskData[0]);
        } else {
          setSelectedId(null);
          setSelected(null);
        }
      } else {
        if (sortedTaskData.length > 0) {
          setSelectedId(sortedTaskData[0].id);
          setSelected(sortedTaskData[0]);
        } else {
          setSelectedId(null);
          setSelected(null);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleOpenModal = () => {
    setShowCanvas(true);
  };

  const onSelectTask = (item) => {
    setSelectedId(item.id);
    setSelected(item);
  };

  const openOffCanvasModal = () => {
    // If nothing selected, do nothing or show a message
    if (!selected) {
      alert('Please select a task first.');
      return;
    }
    setOpenCanvas(true);
  };

  // Hard delete handler (used by TaskDataSettings)
  const handleDeleteTask = async (task) => {
    if (!task || !task.id) return;

    try {
      // Delete the task (hard delete)
      const { error: delError } = await supabase
        .from('TaskData')
        .delete()
        .eq('id', task.id);

      if (delError) throw delError;

      // refresh list
      await fetchTaskData();

      // if deleted task was selected, clear selection
      if (selectedId === task.id) {
        setSelectedId(null);
        setSelected(null);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. See console for details.');
    }
  };

  return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`} style={{ bottom: '90px' }}>
        <button className={`${GlobalStyles.floatingBtn}`} onClick={openOffCanvasModal}>
          <LucideSettings style={{ position: 'relative', bottom: '3px' }} />
        </button>
      </div>

      <div className={`${GlobalStyles.floatingDiv}`}>
        <button className={`${GlobalStyles.floatingBtn}`} onClick={handleOpenModal}>
          +
        </button>
      </div>

      <div className={`${TaskStyles.employeePage}`}>
        <div className={`${TaskStyles.employeeLeft}`}>
          <TaskList
            taskData={taskData}
            onSelectTask={onSelectTask}
            selectedId={selectedId}
          />
        </div>

        <div className={`${TaskStyles.employeeRight}`}>
          <div className={`row g-0`}>
            <div className={`col-md-5 ${GlobalStyles.pStart} ${GlobalStyles.pMobile}`}>
              <div className={styles.card}>
                <div className={styles.headerRow}>
                  <span className={styles.taskIdBadge}>
                    {selected?.uniqueId || 'N/A'}
                  </span>

                  <h2 className={styles.name}>
                    {selected?.taskName || 'N/A'}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={GlobalStyles.mainSections}>
        <AddTaskData
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
          fetchTaskData={fetchTaskData}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          selectedTask={selected}
          setTask={setTask}
          task={task}
          setSelected={setSelected}
        />
      </div>

      <TaskDataSettings
        openCanvas={openCanvas}
        onHide={() => setOpenCanvas(false)}
        selectedTask={selected}
        refreshTasks={fetchTaskData}
        handleDelete={handleDeleteTask}
        setShowCanvas={setShowCanvas}
        setOpenCanvas={setOpenCanvas}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        setTask={setTask}
        task={task}
      />
    </>
  );
};

export default TaskData;
