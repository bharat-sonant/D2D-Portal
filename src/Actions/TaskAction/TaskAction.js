import * as TaskDataServise from "../../services/TaskDataServise/TaskDataServise";
import { setAlertMessage } from "../../common/common";

const city = localStorage.getItem("city");

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
  setLoading
}) => {
  const trimmedTitle = taskTitle.trim();
  if (!trimmedTitle) {
    setError("Task name is required.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const duplicate = await TaskDataServise.checkDuplicateTaskName(trimmedTitle);
    if (duplicate && (!isEditing || duplicate.id !== selectedTask?.id)) {
      setError("Task name already exists.");
      setLoading(false);
      return;
    }

    let taskData;

    if (isEditing) {
      taskData = await TaskDataServise.updateTask(selectedTask.id, {
        taskName: trimmedTitle
      });

      await TaskDataServise.saveTaskHistory({
        taskId: taskData.id,
        uniqueId: taskData.uniqueId,
        city_id: city,
        action: "Updated",
        oldvalue: selectedTask.taskName,
        newValue: taskData.taskName,
        created_by: "Ansh",
        created_at: new Date().toISOString()
      });

      setAlertMessage("success", "Task updated successfully!");
    } else {
      const uniqueId = await TaskDataServise.generateUniqueTaskId();

      taskData = await TaskDataServise.createTask({
        taskName: trimmedTitle,
        uniqueId,
        city_id: city,
        created_by: "Ansh",
        created_at: new Date().toISOString()
      });

      await TaskDataServise.saveTaskHistory({
        taskId: taskData.id,
        uniqueId,
        city_id: city,
        action: "Created",
        oldvalue: null,
        newValue: taskData.taskName,
        created_by: "Ansh",
        created_at: new Date().toISOString()
      });

      setAlertMessage("success", "Task added successfully!");
    }

    fetchTaskData();
    setSelectedTask(taskData);
    setTaskTitle("");
    setIsEditing(false);
    setTimeout(() => setShowCanvas(false), 500);

  } catch (err) {
    console.error(err);
    setError("Failed to save task. Please try again.");
  } finally {
    setLoading(false);
  }
};

/* ================= STATUS TOGGLE ================= */

export const toggleTaskStatus = async (
  task,
  toggle,
  refreshTasks,
  setToggle
) => {
  const newStatus = toggle ? "inactive" : "active";
  const oldStatus = toggle ? "active" : "inactive";

  try {
    await TaskDataServise.saveTaskHistory({
      taskId: task.id,
      uniqueId: task.uniqueId,
      action: "Status Changed",
      oldvalue: oldStatus,
      newValue: newStatus,
      status: newStatus,
      created_by: "Ansh",
      created_at: new Date().toISOString()
    });

    await TaskDataServise.updateTaskStatus(task.id, newStatus);

    setToggle(!toggle);
    refreshTasks();
    setAlertMessage("success", `Task marked as ${newStatus}`);
  } catch (err) {
    console.error(err);
    setAlertMessage("error", "Failed to update task status");
  }
};

/* ================= HISTORY ================= */

export const fetchTaskHistory = async (
  uniqueId,
  setTaskHistory,
  setLoadingHistory
) => {
  setLoadingHistory(true);
  try {
    const history = await TaskDataServise.getTaskHistory(uniqueId);
    setTaskHistory(history || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingHistory(false);
  }
};
