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

  const result = await sbs.updateData("TaskData", taskId, taskDetail);

  if (result.success) {
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

  const result = await sbs.updateData("TaskData", taskId, { status });

  if (result.success) return { status: "success", message: "Task status updated successfully", data: result.data };
  else return { status: "error", message: result.error };
};

export const deleteTaskData = async (taskId) => {
  if (!taskId) return { status: "error", message: "Task id is required" };

  const result = await sbs.deleteData("TaskData", taskId);

  if (result.success) return { status: "success", message: "Task deleted successfully", data: result.data };
  else return { status: "error", message: result.error };
};
