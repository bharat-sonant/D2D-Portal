import React, { useEffect, useState } from "react";
import GlobalStyles from "../../../assets/css/globleStyles.module.css";
import AddTask from "../../Components/FETasks/AddTask";
import style from "./FETasks.module.css";
import notFoundImage from "../../../assets/images/userNotFound.png";
import {
  getallTasks,
  saveTaskAction,
  updateTaskAction,
} from "../../Actions/FETasks/FETasksAction";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";

const FETasks = () => {
  const [openCanvas, setOpenCanvas] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setOpenCanvas(true);
  };

  return (
    <>
      <div className={GlobalStyles.floatingDiv}>
        <button className={GlobalStyles.floatingBtn} onClick={handleOpenModal}>
          +
        </button>
      </div>

      {/* Tasks Table */}
      <div className={style.container}>
        <div className={style.tableWrapper}>
          <table className={style.table}>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Task Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className={style.loaderCell}>
                  <WevoisLoader title="loading tasks" />
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="4" className={style.emptyCell}>
                  <div className={style.emptyContent}>
                    <img src={notFoundImage} alt="No tasks" />
                    <p>No tasks added yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td className={style.actionCol}>
                    <button
                      className={style.editBtn}
                      onClick={() => handleEdit(task)}
                    >
                      Update
                    </button>
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
    </>
  );
};

export default FETasks;
