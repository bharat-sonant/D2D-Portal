import React from 'react'
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import styles from '../../Styles/TaskList/TaskList.module.css';

const TaskList = () => {
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
                        display: "block", position: 'absolute', top: '60px'
                    }}
                    aria-labelledby="drop downMenuButton"
                >
                    <div className={`${styles.userListTitle}`}>Select Employee</div>
                    <div className={`${styles.userScroll}`}>
                        {/* {loading ? (
                <div className={styles.loaderContainer}>
                  <PulseLoader color="#3fb2f1" size={11} />
                  <div className={`${globleStyles.loaderText}`}>
                    Loading employee, Please wait
                  </div>
                </div>
              ) : props.filteredUsers.length > 0 ? (
                props.filteredUsers.map((user, i) => (
                  <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                    <div
                      className={`dropdown-item ${GlobalStyles.dropdownItem} ${
                        selectedSeparatedUser === user.empCode
                          ? GlobalStyles.selectedUser
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedSeparatedUser === user.empCode
                            ? "#9acaf1"
                            : "transparent",
                        backgroundColor:
                          selectedSeparatedUser === user.empCode
                            ? "#3fb2f114"
                            : "transparent",
                      }}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div
                        className={`${GlobalStyles.userInfo}`}
                        style={{
                          color:
                            selectedSeparatedUser === user.empCode
                              ? "#000000"
                              : "#000000",
                        }}
                      >
                        <span className={`${styles.employeeName}`}>
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className={`${styles.noUserData}`}>
                  <img
                    src={images.noUser}
                    className={`img-fluid ${styles.noUserImg}`}
                    title="No User Found"
                    alt="Image"
                  />
                  No employee found
                </div>
              )} */}
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