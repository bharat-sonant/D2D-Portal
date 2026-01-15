import styles from "./GlobalSpinnerLoader.module.css";

const GlobalSpinnerLoader = ({ className = "" }) => {
  return <div className={`${styles.loader} ${className}`}></div>;
};

export default GlobalSpinnerLoader;
