import { LucideSettings } from "lucide-react";
import styles from "./SettingsBtn.module.css";

const SettingsBtn = (props) => {
  return (
    <div onClick={props?.click} title="City Settings">
      <button className={`${styles.btnSetting}`}>
        <LucideSettings className={styles.iconSetting} />
      </button>
    </div>
  );
};

export default SettingsBtn;
