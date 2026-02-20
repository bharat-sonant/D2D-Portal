import D2DMonitoringSidebar from './D2DMonitoringTopbar';
import styles from '../../assets/css/D2DMonitoring/MonitoringLayout/MonitoringLayout.module.css';

const D2DMonitoringLayout = ({ children }) => {
  return (
    <div className="app-container">
      <main className={styles.mainLayout}>
        <D2DMonitoringSidebar />
        <div className={styles.mainContent}>{children}</div>
      </main>
    </div>
  );
}

export default D2DMonitoringLayout
