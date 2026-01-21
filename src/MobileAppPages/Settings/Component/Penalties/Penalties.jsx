import styles from "../../Pages/Settings.module.css";
import { togglePenalties } from "../../Action/Penalties/PenaltiesAction";
import { Settings, Shield, Eye, Calendar, Image, Save, ToggleLeft, ToggleRight } from 'lucide-react';

const Penalties = (props) => {
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.toggleWrapper}>
          <div className={`${styles.cardIcon} ${styles.purpleGradient}`}>
            <Shield size={24} />
          </div>
          <label className={styles.toggleLabel}>Penalties Via Web</label>
          <div
            className={`${styles.toggleSwitch} ${
              props.isPenaltiesOn ? styles.on : styles.off
            }`}
            onClick={() => togglePenalties(props)}
          >
            <div className={styles.toggleCircle}>
              {props.isPenaltiesOn ? "ON" : "OFF"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Penalties;
