export const getDateTimeDetails = () => {
  const now = new Date();
  const year = now.getFullYear();
  const monthName = now.toLocaleString("default", { month: "long" });
  const date = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${year} ${time}`;

  return { now, year, monthName, date, time, formattedDate };
};