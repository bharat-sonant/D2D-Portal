import styles from "./NoResult.module.css";

const NoResult = ({
  title = "No Results Found",
  query = "",
  icon: Icon, 
  height
}) => {
  return (
    <div className={styles.noResult} style={{ minHeight: height }}>
      {Icon && <Icon size={42} />}

      <h5>{title}</h5>

      {query && (
        <p>
          No results for <strong>“{query}”</strong>
        </p>
      )}
    </div>
  );
};

export default NoResult;
