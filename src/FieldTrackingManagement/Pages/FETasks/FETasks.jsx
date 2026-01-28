import React, { useEffect, useRef, useState } from "react";
import GlobalStyles from "../../../assets/css/globalStyles.module.css";
import AddTask from "../../Components/FETasks/AddTask";
import style from "./FETasks.module.css";
import noData from "../../../assets/images/icons/noData.gif";
import {
  getallTasks,
  saveTaskAction,
  updateTaskAction,
} from "../../Actions/FETasks/FETasksAction";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import { Edit2 } from "lucide-react";
import NoResult from "../../../components/NoResultFound/NoResult";
import GlobalAlertModal from "../../../components/GlobalAlertModal/GlobalAlertModal";
import Toggle from "../../../components/Common/GlobalToggle/Toggle";
const FETasks = () => {
  const tableRef = useRef(null);
  const [openCanvas, setOpenCanvas] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    getallTasks(setTasks, setLoading);
  }, []);

  const handleOpenModal = () => {
    setOpenCanvas(true);
  };

  const normalizeTask = (task) => ({
    id: task.id,
    taskName: task.taskName ?? task.task_name,
    description: task.description,
    status: task.status,
  });

  const handleSaveTask = async (taskData) => {
    if (isEdit) {
      // optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editTaskId ? { ...task, ...taskData } : task,
        ),
      );

      try {
        const updated = await updateTaskAction(editTaskId, taskData);
        const updatedTask = normalizeTask(updated);

        setTasks((prev) =>
          prev.map((task) => (task.id === editTaskId ? updatedTask : task)),
        );
      } catch {
        // optional rollback (if needed)
      }

      setEditTaskId(null);
      setIsEdit(false);
      return;
    }

    // =====================
    // ADD TASK (OPTIMISTIC)
    // =====================
    const tempId = Date.now();

    const tempTask = {
      id: tempId,
      ...taskData,
    };

    setTasks((prev) => [...prev, tempTask]);

    try {
      const created = await saveTaskAction(taskData);
      const createdTask = normalizeTask(created);

      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? createdTask : task)),
      );
    } catch {
      // rollback
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
    }

    setEditTaskId(null);
    setIsEdit(false);
  };

  const handleEdit = (task) => {
    setIsEdit(true);
    setEditTaskId(task.id);

    setTaskName(task.taskName);
    setDescription(task.description);
    setStatus(task.status);

    setOpenCanvas(true);
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "active" ? "inactive" : "active";

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
    );

    try {
      await updateTaskAction(task.id, { status: newStatus });
    } catch (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)),
      );
    }
  };
  console.log("takss", tasks);
  return (
    <>
      {/* Background */}
      <div className={GlobalStyles.background}>
        <div className={`${GlobalStyles.gradientOrb} ${GlobalStyles.orb1}`} />
        <div className={`${GlobalStyles.gradientOrb} ${GlobalStyles.orb2}`} />
        <div className={`${GlobalStyles.gradientOrb} ${GlobalStyles.orb3}`} />
        <div className={GlobalStyles.gridOverlay} />
      </div>

      {/* Particles */}
      <div className={GlobalStyles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={GlobalStyles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      <div className={style.FETaskContainer}>
        <div className={style.FETaskHeader}>
          <div className={style.pageTitle}>
            <span>📝</span>
            Task Management</div>
          <button className={GlobalStyles.btnTheme} onClick={handleOpenModal}>
            + Add New Task
          </button>
        </div>

        <div ref={tableRef} className={`${style.tableContainer}`}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className={style.th1}>S. No</th>
                <th className={style.th2}>Task Name</th>
                <th className={style.th3}>Description</th>
                <th className={`text-end ${style.th4}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <td colSpan="5" className={style.loaderCell}>
                  <WevoisLoader
                    height="calc(100vh - 225px)"
                    title="loading tasks..."
                  />
                </td>
              ) : tasks.length === 0 ? (
                <td colSpan="5" className={style.emptyCell}>
                  <NoResult
                    title="No data available"
                    // query={searchTerm}
                    gif={noData}
                    height="calc(100vh - 225px)"
                  />
                </td>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className={style.th1}>
                      <div
                        className={`${style.snNumber}`}
                        onClick={() => handleEdit(task)}
                      >
                        <span>{index + 1}</span>
                        <Edit2 className={style.editIcon} size={16} />
                      </div>
                    </td>
                    <td className={style.th2}>{task.taskName}</td>
                    <td className={style.th3}>{task.description}</td>
                    <td className={`text-end ${style.th4}`}>
                      <Toggle
                        checked={task.status === "active"}
                        onChange={() => {
                          setSelectedTask(task);
                          setIsAlertOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openCanvas && (
        <AddTask
          taskName={taskName}
          setTaskName={setTaskName}
          description={description}
          setDescription={setDescription}
          setOpenCanvas={setOpenCanvas}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setEditIndex={setEditTaskId}
          onSave={handleSaveTask}
        />
      )}

      <GlobalAlertModal
        show={isAlertOpen}
        title="Confirmation Status Update"
        message={`Do you really want to ${
          selectedTask?.status === "active" ? "deactivate" : "activate"
        } this task?`}
        buttonText={
          selectedTask?.status === "active" ? "Deactivate" : "Yes, Activate"
        }
        iconType={selectedTask?.status === "active" ? "warning" : "success"}
        warningText="This task will be deactivated for all users"
        successText="This task will be activated for all users"
        onCancel={() => {
          setIsAlertOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={() => {
          handleStatusToggle(selectedTask);
          setIsAlertOpen(false);
          setSelectedTask(null);
        }}
      />
    </>
  );
};

export default FETasks;
