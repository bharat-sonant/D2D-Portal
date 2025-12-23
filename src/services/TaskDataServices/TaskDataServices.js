// import { supabase } from "../../createClient";

// /* ================= UNIQUE ID ================= */

// const generateRandomId = () => {
//   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const numbers = "0123456789";

//   let id = "";
//   for (let i = 0; i < 3; i++)
//     id += letters[Math.floor(Math.random() * letters.length)];
//   for (let i = 0; i < 3; i++)
//     id += numbers[Math.floor(Math.random() * numbers.length)];

//   return id;
// };

// export const generateUniqueTaskId = async () => {
//   while (true) {
//     const newId = generateRandomId();
//     const { data } = await supabase
//       .from("TaskData")
//       .select("id")
//       .eq("uniqueId", newId)
//       .maybeSingle();

//     if (!data) return newId;
//   }
// };

// /* ================= TASK CRUD ================= */

// export const checkDuplicateTaskName = async (taskName) => {
//   const { data } = await supabase
//     .from("TaskData")
//     .select("id")
//     .eq("taskName", taskName)
//     .maybeSingle();

//   return data;
// };

// export const createTask = async (payload) => {
//   const { data, error } = await supabase
//     .from("TaskData")
//     .insert([payload])
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// };

// export const updateTask = async (id, payload) => {
//   const { data, error } = await supabase
//     .from("TaskData")
//     .update(payload)
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// };

// export const deleteTask = async (id) => {
//   const { error } = await supabase
//     .from("TaskData")
//     .delete()
//     .eq("id", id);

//   if (error) throw error;
// };

// export const updateTaskStatus = async (id, status) => {
//   const { error } = await supabase
//     .from("TaskData")
//     .update({ status })
//     .eq("id", id);

//   if (error) throw error;
// };

// /* ================= HISTORY ================= */

// export const saveTaskHistory = async (historyPayload) => {
//   const { error } = await supabase
//     .from("TaskHistory")
//     .insert([historyPayload]);

//   if (error) throw error;
// };

// export const getTaskHistory = async (uniqueId) => {
//   const { data, error } = await supabase
//     .from("TaskHistory")
//     .select("*")
//     .eq("uniqueId", uniqueId)
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data;
// };




import { supabase } from "../../createClient";
import * as sbs from "../supabaseServices";

/* ================= UNIQUE ID ================= */

const generateRandomId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let id = "";
  for (let i = 0; i < 3; i++) id += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 3; i++) id += numbers[Math.floor(Math.random() * numbers.length)];

  return id;
};

export const generateUniqueTaskId = async () => {
  while (true) {
    const newId = generateRandomId();

    const { data, error } = await supabase
      .from("TaskData")
      .select("id")
      .eq("uniqueId", newId)
      .maybeSingle();

    if (!data) return newId;
  }
};

/* ================= TASK CRUD ================= */

export const saveTaskData = async (taskDetail) => {
  const result = await sbs.saveData("TaskData", taskDetail);

  if (result.success) {
    await saveTaskHistory({
      taskId: result.data.id,
      uniqueId: result.data.uniqueId,
      action: "Created",
      newValue: result.data.taskName,
      created_by: taskDetail.created_by || "Ansh", // Fallback to "Ansh"
      created_at: new Date().toISOString(),
      status: result.data.status || "active"
    });
    return {
      status: "success",
      message: "Task saved successfully",
      data: result.data
    };
  } else {
    return {
      status: "error",
      message: result.error
    };
  }
};

export const updateTaskData = async (taskId, taskDetail) => {
  if (!taskId) return { status: "error", message: "Task id is required" };

  // Fetch old data for history
  let oldData = null;
  const oldRes = await sbs.getDataByColumnName("TaskData", "id", taskId);
  if (oldRes.success) oldData = oldRes.data;

  const result = await sbs.updateData("TaskData",'id', taskId, taskDetail);

  if (result.success) {
    await saveTaskHistory({
      taskId: result.data.id,
      uniqueId: result.data.uniqueId,
      action: "Updated",
      newValue: result.data.taskName,
      oldvalue: oldData ? oldData.taskName : null,
      created_by: "Ansh",
      created_at: new Date().toISOString(),
      status: result.data.status // Preserve current status
    });
    return { status: "success", message: "Task updated successfully", data: result.data };
  } else {
    return { status: "error", message: result.error };
  }
};

export const getTaskData = async () => {
  const result = await sbs.getData("TaskData");

  if (result.success) {
    const sortedData = [...result.data].sort((a, b) => (a.taskName || "").localeCompare(b.taskName || ""));
    return { status: "success", message: "Task data fetched successfully", data: sortedData };
  } else {
    return { status: "error", message: result.error };
  }
};

export const getTaskById = async (taskId) => {
  if (!taskId) return { status: "error", message: "Task id is required" };

  const result = await sbs.getDataByColumnName("TaskData", "id", taskId);

  if (result.success) return { status: "success", data: result.data };
  else return { status: "error", message: result.error };
};

export const updateTaskStatus = async (taskId, status) => {
  if (!taskId) return { status: "error", message: "Task id is required" };

  // Fetch old data for history
  let oldData = null;
  const oldRes = await sbs.getDataByColumnName("TaskData", "id", taskId);
  if (oldRes.success) oldData = oldRes.data;

  const result = await sbs.updateData("TaskData",'id',taskId, { status });

  if (result.success) {
    await saveTaskHistory({
      taskId: result.data.id,
      uniqueId: result.data.uniqueId,
      action: "Status Changed",
      newValue: result.data.status,
      oldvalue: oldData ? oldData.status : null,
      created_by: "Ansh",
      created_at: new Date().toISOString(),
      status: result.data.status
    });
    return { status: "success", message: "Task status updated successfully", data: result.data };
  } else {
    return { status: "error", message: result.error };
  }
};

export const deleteTaskData = async (taskId) => {
  if (!taskId) return { status: "error", message: "Task id is required" };

  const result = await sbs.deleteData("TaskData", taskId);

  if (result.success) return { status: "success", message: "Task deleted successfully", data: result.data };
  else return { status: "error", message: result.error };
};

export const saveTaskHistory = async (historyPayload) => {
  const result = await sbs.saveData("TaskHistory", historyPayload);

  if (result.success) {
    return { status: "success", message: "History saved successfully", data: result.data };
  } else {
    return { status: "error", message: result.error };
  }
};

export const getTaskHistory = async (uniqueId) => {
  if (!uniqueId) return { status: "error", message: "UniqueId is required" };

  const { data, error } = await supabase
    .from("TaskHistory")
    .select("*")
    .eq("uniqueId", uniqueId)
    .order("created_at", { ascending: false });

  if (error) {
    return { status: "error", message: error.message };
  } else {
    return { status: "success", data };
  }
};
