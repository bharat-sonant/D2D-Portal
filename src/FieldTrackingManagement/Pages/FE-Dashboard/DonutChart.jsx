// import styles from "./DonutChart.module.css";
//
// const DonutChart = ({ data, total }) => {
//   const radius = 60;
//   const circumference = 2 * Math.PI * radius;
//   let currentOffset = 0;
//
//   return (
//     <div className={styles.donutChart}>
//       <svg
//         className={styles.donutSvg}
//         width="140"
//         height="140"
//         viewBox="0 0 140 140"
//       >
//         {data.map((item, index) => {
//           const percentage = item.value / total;
//           const dash = circumference * percentage;
//
//           const circle = (
//             <circle
//               key={index}
//               cx="70"
//               cy="70"
//               r={radius}
//               fill="none"
//               stroke={item.color}
//               strokeWidth="20"
//               strokeDasharray={`${dash} ${circumference}`}
//               strokeDashoffset={-currentOffset * circumference}
//             />
//           );
//
//           currentOffset += percentage;
//           return circle;
//         })}
//       </svg>
//
//       <div className={styles.donutCenter}>
//         <div className={styles.donutNumber}>{total}</div>
//         <div className={styles.donutLabel}>Total</div>
//       </div>
//       
//     </div>
//   );
// };
//
// export default DonutChart;
