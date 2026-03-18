import React from "react";
import StateItem from "../StateItem";
import styles from "./PerformanceGrid.module.css";

const PerformanceGrid = ({ data }) => {
  const items = [
    { label: "Total Halt", value: data.halt.total, color: "var(--textDanger)" },
    { label: "Curr Halt", value: data.halt.current, color: "var(--textSuccess)" },
    { label: "Curr Line", value: data.lines.current, color: "var(--themeColor)" },
  ];
  return (
    <div className={styles.wardSummaryStats}>
      <StateItem items={items} />
    </div>
  );
};

export default PerformanceGrid;
