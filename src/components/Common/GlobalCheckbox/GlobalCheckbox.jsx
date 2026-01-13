import styles from "./GlobalCheckbox.module.css";

const GlobalCheckbox = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label className={styles.checkboxWrapper}>
      <span className={styles.checkboxName}>{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />

      <span className={styles.customCheckbox}></span>
    </label>
  );
};

export default GlobalCheckbox;
