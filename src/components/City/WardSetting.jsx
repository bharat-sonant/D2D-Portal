import { useEffect, useState } from "react";
import WardMapCanvas from "./WardMapCanvas";
import { updateWardRealTimeStatusAction } from "../../Actions/City/cityAction";
import styles from "./WardSetting.module.css";
import { MapPinned, Disc3, ChevronRight } from "lucide-react";
import GlobalOffcanvas from "../Common/globalOffcanvas/globalOffcanvas";

export default function WardSetting(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [openCanvas, setOpenCanvas] = useState(false);

  useEffect(() => {
    if (!props?.selectedWard) {
      setIsEnabled(false);
      return;
    }

    if (props.selectedWard.show_realtime === "Yes") {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [props.selectedWard]);

  const handleToggleSwitch = () => {
    setIsEnabled(!isEnabled);
    updateWardRealTimeStatusAction(
      props.selectedWard.id,
      props.selectedWard.show_realtime,
      props.setWardList,
      setIsEnabled,
    );
  };

  return (
    <>
      <div className={styles.toggleCard}>
        <h2 className={` ${styles.headingLabel}`}>Ward Setting</h2>

        <div className={styles.toggleRow}>
          <div className={styles.toggleLeft}>
            <div className={styles.toggleIcon}>
              <Disc3 />
            </div>
            <p className={`mb-0 ${styles.textLabel}`}>Show in Realtime</p>
          </div>

          <button
            className={`${styles.toggleSwitch} ${
              isEnabled ? styles.active : ""
            }`}
            onClick={handleToggleSwitch}
          >
            <span className={styles.toggleSlider}></span>
          </button>
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleLeft}>
            <div className={styles.toggleIcon}>
              <MapPinned />
            </div>
            <p className={styles.textLabel}>Ward Maps</p>
          </div>

<button
  onClick={() => props.openWardMap(props.selectedWard.id)}
  className={styles.addBtn}
>
  <ChevronRight size={14} />
</button>
        </div>
      </div>


    </>
  );
}
