import React from 'react'
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import styles from '../../Styles/TaskList/TaskList.module.css';
import { images } from '../../../../assets/css/imagePath';

const TaskList = (props) => {

  const handleTaskSelect = (task) => {
    props.onSelectTask(task); // send full task object to parent
  };

  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <div
        className={`${GlobalStyles.overlay}`}
        style={{ display: "block" }}
      >
        <ul
          //   ref={dropdownMenuRef}
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown}`}
          style={{
            display: "block",
          }}
          aria-labelledby="drop downMenuButton"
        >
          <div className={`${styles.userListTitle}`}>Select Employee</div>
          <div className={`${styles.userScroll}`}>
            {props.loading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.cityLoaderWrapper}>
                  <div className={styles.cityLoader}></div>
                  <img src={images.wevoisLogo} alt="loader icon" className={styles.centerIcon} />
                </div>

                <div className={styles.loaderText}>Please wait... Loading task data.</div>
              </div>

            ) : props.taskList.length > 0 ? (
              props.taskList.map((task, i) => (
                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.dropdownItem} ${props.selectedTaskId === task.taskId
                      ? GlobalStyles.selectedUser
                      : ""
                      }`}
                    style={{
                      backgroundColor:
                        props.selectedTaskId === task.taskId
                          ? "#9acaf1"
                          : "transparent",
                      backgroundColor:
                        props.selectedTaskId === task.taskId
                          ? "#3fb2f114"
                          : "transparent",
                    }}
                    onClick={() => handleTaskSelect(task)}
                  >
                    <div
                      className={`${GlobalStyles.userInfo}`}
                      style={{
                        color:
                          props.selectedTaskId === task.taskId
                            ? "#000000"
                            : "#000000",
                      }}
                    >
                      <span className={`${styles.employeeName}`}>
                        {task.name}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className={`${styles.noUserData}`}>
                <img
                  src={images.imgComingSoon}
                  className={`img-fluid ${styles.noUserImg}`}
                  title="No User Found"
                  alt="Image"
                />
                No task data found
              </div>
            )}
          </div>
          {/* <div>
            <label
              className={`checkbox-container`}
              style={{ marginTop: "-17px" }}
            >
              <input
                type="checkbox"
                onChange={(e) => handleActiveInactiveUser(e.target.checked)}
              />
              <span className={`checkmark ${styles.checkMark}`}></span>
              <span className="label-text">Show Inactive Employee</span>
            </label>
          </div> */}
        </ul>
      </div>
    </div>
  )
}

export default TaskList