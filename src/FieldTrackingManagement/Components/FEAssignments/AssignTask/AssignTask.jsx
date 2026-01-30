import { useEffect, useState } from 'react';
import styles from './assignTask.module.css';
import { Trash2, Plus, X } from 'lucide-react'; // Optional: using lucide for clean icons
import { getallTasks } from '../../../Actions/FETasks/FETasksAction';
import WevoisLoader from '../../../../components/Common/Loader/WevoisLoader';
// const defaultTaskList = [
//     { id: 1, name: 'Site Inspection',  },
//     { id: 2, name: 'Equipment Repair',  },
//     { id: 3, name: 'Client Meeting',  }
// ];

const AssignTask = ({ isOpen, onClose, data }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedUnit,setSelectUnit] = useState('minutes');
  const [formData, setFormData] = useState({
    name: '',
    type: 'General',
    time: '',
    description: ''
  });
  const [defaultTaskList, setDefaultTaskList] = useState([]);
  const isFormValid = formData.name && formData.type && formData.time;
  const [taskLoading, setTasksLoading] = useState(false);

  useEffect(()=> {
    getallTasks(setDefaultTaskList, setTasksLoading)
  },[])

  const handleAddTask = () => {
    if (!isFormValid) return;
    setTasks([...tasks, { ...formData, id: Date.now(),unit:selectedUnit }]);
    setFormData({ name: '', type: 'General', time: '', description: '' });
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
                <option value="General">General</option>
                <option value="Urgent">Urgent</option>
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