import GlobalStyles from "./GlobalToggle.module.css";

const Toggle = ({ checked, onChange, disabled = false }) => {
  return (
    <label className={GlobalStyles.switch}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className={GlobalStyles.slider}></span>
    </label>
  );
};

export default Toggle;
