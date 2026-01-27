import React, { useEffect, useRef, useState } from "react";
import GlobalStyles from "../../../assets/css/globleStyles.module.css";
import AddTask from "../../Components/FETasks/AddTask";
import style from "./FETasks.module.css";
import noData from '../../../assets/images/icons/noData.gif';
import {
  getallTasks,
  saveTaskAction,
  updateTaskAction,
} from "../../Actions/FETasks/FETasksAction";
import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
import { Edit } from "lucide-react";
import NoResult from "../../../components/NoResultFound/NoResult";

const FETasks = () => {
  const tableRef = useRef(null);
  const [openCanvas, setOpenCanvas] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState('active')
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
    setStatus(task.status)

    setOpenCanvas(true);
  };

  const handleStatusToggle = async(task) => {
    console.log('task',task)
    const newStatus = task.status === 'active' ? 'inactive' : 'active';

    console.log('newstatus',newStatus)

    setTasks((prev) => 
    prev.map((t) => t.id === task.id ? {...t, status : newStatus} : t));

    try{
      await updateTaskAction(task.id, {status : newStatus});
    }catch(error){
      setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: task.status } : t
      )
    );
  }
};

  return (
    <>
      <div className={GlobalStyles.floatingDiv}>
        <button className={GlobalStyles.floatingBtn} onClick={handleOpenModal}>
          +
        </button>
      </div>

      <div
        ref={tableRef}
        className={`${style.tableContainer}`}>
          <table className={style.table}>
          <thead>
            <tr>
              <th className={style.th1}>S. No</th>
              <th className={style.th2}>Task Name</th>
              <th className={style.th3}>Description</th>
              <th className={style.th4}>Status</th>
              <th className={style.th4}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className={style.loaderCell}>
                  <WevoisLoader title="loading tasks..." />
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="4" className={style.emptyCell}>
                  <NoResult
                    title="No data available"
                    // query={searchTerm}
                    gif={noData}
                    // height="calc(100vh - 280px)"
                  />
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr key={task.id}>
                  <td className={style.th1}>{index + 1}</td>
                  <td className={style.th2}>{task.taskName}</td>
                  <td className={style.th3}>{task.description}</td>
                  <td className={style.th4}>
                    <label className={style.switch}>
                      <input
                        type="checkbox"
                        checked={task.status === 'active'}
                        onChange={() => handleStatusToggle(task)}
                      />
                      <span className={style.slider}></span>
                    </label>
                  </td>
                  <td className={style.th4}>
                    <button
                      className={style.editBtn}
                      onClick={() => handleEdit(task)}
                    >
                      <Edit color="black" size={18}/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
