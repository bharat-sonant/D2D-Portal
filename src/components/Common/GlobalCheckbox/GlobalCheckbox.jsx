import styles from "./GlobalCheckbox.module.css";

const GlobalCheckbox = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  align = "left", // "left" | "right"
  fullWidth = false,
  className = "",
}) => {
  return (
    <label
      htmlFor={id}
      className={`${styles.checkboxWrapper} 
      ${align === "right" ? styles.rightAlign : ""}
      ${fullWidth ? styles.fullWidth : ""}
      ${className}`}
    >
      {align === "left" && (
        <>
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxName}>{label}</span>
        </>
      )}

      {align === "right" && (
        <>
          <span className={styles.checkboxName}>{label}</span>
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          <span className={styles.customCheckbox}></span>
        </>
      )}
    </label>
  );
};

export default GlobalCheckbox;
