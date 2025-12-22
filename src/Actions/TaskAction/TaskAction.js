import * as TaskService from "../../services/TaskDataServices/TaskDataServices";
import { setAlertMessage } from "../../common/common";

// const city = localStorage.getItem("city");

/* ================= SAVE / UPDATE ================= */

export const saveOrUpdateTask = async ({
  taskTitle,
  isEditing,
  selectedTask,
  fetchTaskData,
  setSelectedTask,
  setShowCanvas,
  setIsEditing,
  setTaskTitle,
  setError,
  setLoading,
  taskData
}) => {
  const trimmedTitle = taskTitle.trim();
  if (!trimmedTitle) {
    setError("Task name is required.");
    return;
  }

  // --- DUPLICATE CHECK ---
  if (taskData && Array.isArray(taskData)) {
    const normalize = (str) => str ? str.trim().toLowerCase() : "";
    const newName = normalize(trimmedTitle);

    let isDuplicate = false;

    if (isEditing && selectedTask) {
      // Update mode: check duplicates excluding current task
      isDuplicate = taskData.some(t =>
        normalize(t.taskName) === newName && t.id !== selectedTask.id
      );
    } else {
      // Add mode: check duplicates in entire list
      isDuplicate = taskData.some(t => normalize(t.taskName) === newName);
    }

    if (isDuplicate) {
      setError("Task name already exists.");
      return;
    }
  }

  setLoading(true);
  setError("");

  let taskRes;

  /* ---------- UPDATE ---------- */
  if (isEditing) {
    taskRes = await TaskService.updateTaskData(selectedTask.id, {
      taskName: trimmedTitle
    });

    if (taskRes.status === "error") {
      setError(taskRes.message);
      setLoading(false);
      return;
    }

    // ---------- HISTORY COMMENTED ----------
    // await TaskService.saveTaskHistory({
    //   taskId: taskRes.data.id,
    //   uniqueId: taskRes.data.uniqueId,
    //   city_id: city,
    //   action: "Updated",
    //   oldvalue: selectedTask.taskName,
    //   newValue: taskRes.data.taskName,
    //   created_by: "Ansh",
    //   created_at: new Date().toISOString()
    // });

    setAlertMessage("success", "Task updated successfully!");
  }

  /* ---------- CREATE ---------- */
  else {
    const uniqueId = await TaskService.generateUniqueTaskId();

    taskRes = await TaskService.saveTaskData({
      taskName: trimmedTitle,
      city_id: 1,
      created_by: "Ansh",
      created_at: new Date().toISOString(),
      uniqueId,
    });

    if (taskRes.status === "error") {
      setError(taskRes.message);
      setLoading(false);
      return;
    }

    // ---------- HISTORY COMMENTED ----------
    // await TaskService.saveTaskHistory({
    //   taskId: taskRes.data.id,
    //   uniqueId: taskRes.data.uniqueId,
    //   city_id: city,
    //   action: "Created",
    //   oldvalue: null,
    //   newValue: taskRes.data.taskName,
    //   created_by: "Ansh",
    //   created_at: new Date().toISOString()
    // });

    setAlertMessage("success", "Task added successfully!");
  }

  /* ---------- FINAL UI UPDATE ---------- */
  fetchTaskData();
  setSelectedTask(taskRes.data);
  setTaskTitle("");
  setIsEditing(false);
  setTimeout(() => setShowCanvas(false), 500);
  setLoading(false);
};

/* ================= STATUS TOGGLE ================= */

export const toggleTaskStatus = async (
  task,
  toggle,
  refreshTasks,
  setToggle
) => {
  const newStatus = toggle ? "inactive" : "active";

  // ---------- HISTORY COMMENTED ----------
  // const oldStatus = toggle ? "active" : "inactive";
  // await TaskService.saveTaskHistory({
  //   taskId: task.id,
  //   uniqueId: task.uniqueId,
  //   action: "Status Changed",
  //   oldvalue: oldStatus,
  //   newValue: newStatus,
  //   status: newStatus,
  //   created_by: "Ansh",
  //   created_at: new Date().toISOString()
  // });

  const statusRes = await TaskService.updateTaskStatus(task.id, newStatus);

  if (statusRes.status === "error") {
    setAlertMessage("error", statusRes.message);
    return;
  }

  setToggle(!toggle);
  refreshTasks();
  setAlertMessage("success", `Task marked as ${newStatus}`);
};

/* ================= FETCH TASKS ================= */

export const fetchTaskData = async (setTaskList, setLoading) => {
  setLoading(true);

  const res = await TaskService.getTaskData();

  if (res.status === "success") {
    setTaskList(res.data || []);
  } else {
    setTaskList([]);
    setAlertMessage("error", res.message);
  }

  setLoading(false);
};

/* ================= DELETE TASK ================= */

export const deleteTask = async (taskId, refreshTasks) => {
  const res = await TaskService.deleteTaskData(taskId);

  if (res.status === "success") {
    setAlertMessage("success", "Task deleted successfully!");
    refreshTasks();
  } else {
    setAlertMessage("error", res.message);
  }
};
