import styles from "./Vehicle.module.css";

// Single vehicle data
const vehicleData = {
  vehicle: "TATA-AT-0001",
  totalFuelFilled: 677,
  totalRunningKM: 4821,
  totalFuelAmount: 60930,
  fleetAvg: 7.12,
  expectedFleetKM: 6842,
  totalKMLoss: 2021,
  totalFuelLoss: 25542,
  companyDecidedAvg: 10,
  costPerKM: 12.64,
};

export default function Vehicle() {
  return (
    <div className={styles.vehicleContainer}>
      {/* Vehicle Number Header */}
      <div className={styles.vehicleHeader}>
        <div className={styles.vehicleNumberCard}>
          <span className={styles.vehicleLabel}>Vehicle Number</span>
          <h2 className={styles.vehicleNumber}>{vehicleData.vehicle}</h2>
        </div>
      </div>

      {/* Dashboard Title */}
      <div className={styles.dashboardHeader}>
        <h2 className={styles.title}>Fleet Intelligence Dashboard</h2>
        <p className={styles.subtitle}>
          Real-time performance, efficiency & financial impact overview
        </p>
      </div>

      {/* CRITICAL KPI ROW */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabel}>Total Fuel Filled</small>
            <h3 className={styles.cardValue}>{vehicleData.totalFuelFilled} L</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabel}>Total Running KM</small>
            <h3 className={styles.cardValue}>{vehicleData.totalRunningKM}</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabel}>Total Fuel Amount</small>
            <h3 className={styles.cardValue}>₹{vehicleData.totalFuelAmount}</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabel}>Fleet Avg</small>
            <h3 className={styles.cardValue}>{vehicleData.fleetAvg} km/l</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabel}>Expected Fleet KM</small>
            <h3 className={styles.cardValue}>{vehicleData.expectedFleetKM}</h3>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.dangerCard}`}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabelWhite}>Total KM Loss</small>
            <h3 className={styles.cardValueWhite}>{vehicleData.totalKMLoss}</h3>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.darkCard}`}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabelWhite}>Total Fuel Loss</small>
            <h3 className={styles.cardValueWhite}>₹{vehicleData.totalFuelLoss}</h3>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabel}>Company Decided Average</small>
            <h3 className={styles.cardValue}>{vehicleData.companyDecidedAvg} km/l</h3>
          </div>
        </div>
      </div>

      {/* PERFORMANCE SNAPSHOT */}
      <div className={styles.performanceGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.cardBody}>
            <small className={styles.cardLabel}>Cost Per KM</small>
            <h4 className={styles.cardValue}>₹{vehicleData.costPerKM}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
