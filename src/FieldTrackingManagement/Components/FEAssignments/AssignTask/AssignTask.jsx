import { useEffect, useState } from 'react';
import styles from './assignTask.module.css';
import { Trash2, Plus, X } from 'lucide-react'; // Optional: using lucide for clean icons
import { getallTasks } from '../../../Actions/FETasks/FETasksAction';
import { assignTaskAction } from '../../../Actions/FEAssignTasks/FEAssignTasks';

const AssignTask = ({ isOpen, onClose, data }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedUnit,setSelectUnit] = useState('minutes');
  const [formData, setFormData] = useState({
    name: '',
    type: 'GENERAL',
    time: '',
    description: ''
  });
  const [defaultTaskList, setDefaultTaskList] = useState([]);
  const isFormValid = formData.name && formData.type && formData.time;
  const [taskLoading, setTasksLoading] = useState(false);

  useEffect(()=> {
    getallTasks(setDefaultTaskList, setTasksLoading)
  },[])

  const getTimeInMinutes = () => {
    const time = Number(formData.time);

    if (selectedUnit === 'hours') {
      return time * 60;
    }

    return time; // already minutes
  };


  const handleAddTask = async() => {
    if (!isFormValid) return;
    const estimationInMinutes = getTimeInMinutes();

    const payload ={
      task_name: formData.name,
      task_type: formData.type,
      estimation: estimationInMinutes,
      assigned_by: "d12395bf-aad8-4f3b-9716-fe6a6831b484",
      task_id: 12,
      employee_code: "101",
      ...(formData.description && {
        description: formData.description.trim(),
      }),
    }

    await assignTaskAction(payload);
    setTasks([
    ...tasks,
    {
      ...formData,
      id: Date.now(),
      unit: selectedUnit,
      time: estimationInMinutes, // store normalized value
    },
  ]);
    setFormData({ name: '', type: 'GENERAL', time: '', description: '' });
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const hasTasks = defaultTaskList && defaultTaskList?.length > 0;

  return (
    <div className={`${styles.drawerOverlay} ${isOpen ? styles.open : ""}`}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h3>Assign Tasks</h3>
            <p>
              Executive: <strong>{data?.name || "Select Executive"}</strong>
            </p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>
        {/* Section 1: Task Creation */}
        <section className={styles.creationSection}>
          <div className={styles.formGroup}>
            <label>Task</label>
            <select
              value={formData.name}
              disabled={taskLoading}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            >
              {taskLoading ? (
                <option value="">Loading tasks...</option>
              ) : (
                <>
                  <option value="">
                    {hasTasks ? "Select Task" : "No tasks available"}
                  </option>

                  {hasTasks &&
                    defaultTaskList?.map((task) => (
                      <option key={task.id} value={task.taskName}>
                        {task.taskName}
                      </option>
                    ))}
                </>
              )}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Task Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="GENERAL">General</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
           <div className={styles.formGroup}>
              <label>Est. Time</label>
              <div className={styles.timeInputGroup}>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.time}
                  min={0}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
                <div className={styles.timeUnitToggle}>
                  <button
                    className={`${styles.unitBtn} ${selectedUnit === 'minutes' ? styles.active : ''}`}
                    onClick={() => setSelectUnit('minutes')}
                  >
                    Minutes
                  </button>
                  <button
                    className={`${styles.unitBtn} ${selectedUnit === 'hours' ? styles.active : ''}`}
                    onClick={() => setSelectUnit('hours')}
                  >
                    Hours
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description (Optional)</label>
            <textarea
              rows="3"
              placeholder="Enter details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            className={styles.addBtn}
            onClick={handleAddTask}
            disabled={!isFormValid}
          >
            <Plus size={18} /> Assign Task
          </button>
        </section>

        {/* Section 2: Added Task List */}
        <section className={styles.listSection}>
          <h4>Assigned Tasks ({tasks.length})</h4>
          <div className={`${styles.taskList} mt-2`}>
            {tasks.length === 0 ? (
              <div className={styles.emptyState}>No tasks added yet</div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskInfo}>
                    <div className={styles.taskHeader}>
                      <span className={styles.taskTitle}>{task.name}</span>
                      <span
                        className={`${styles.badge} ${styles[task.type.toLowerCase()]}`}
                      >
                        {task.type}
                      </span>
                    </div>
                    <p className={styles.taskMeta}>{task.time} mins</p>
                    {task.description && (
                      <p className={styles.taskDesc}>{task.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className={styles.removeBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssignTask;