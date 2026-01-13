import { useState, useRef, useEffect } from "react";
import styles from "./GlobalDropdown.module.css";

const GlobalDropdown = ({
  value,
  labelMap = {},
  options = [],
  onChange,
  placeholder = "Select",
  disabled = false,
  fullWidth = true,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = labelMap[value] || placeholder;

  return (
    <div className={styles.gd_wrapper} ref={ref}>
      <button
        className={`${styles.gd_button} ${fullWidth ? styles.gd_full : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        disabled={disabled}
      >
        {displayLabel}
      </button>

      {open && (
        <ul className={styles.gd_menu}>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                className={`${styles.gd_item} ${
                  value === opt.value ? styles.gd_active : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
             {(opt.rightIcon || opt.rightElement) && (
  <span className={styles.gd_right}>
    {opt.rightIcon || opt.rightElement}
  </span>
)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GlobalDropdown;
