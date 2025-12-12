import GlobalStyles from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import styles from '../../Style/Task-Data/TaskDataList.module.css';

const TaskList = (props) => {

    const handleTaskSelect = (item) => {
        props.onSelectTask(item)
    }

    return (
        <div className={`dropdown ${GlobalStyles.dropDown}`}>
            <div
                className={`${GlobalStyles.overlay}`}
                style={{ display: "block" }}
            >
                <ul
                    className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown}`}
                    style={{
                        display: "block",
                    }}
                    aria-labelledby="drop downMenuButton"
                >
                    <div className={`${GlobalStyles.searchGroup}`}>
                        <input
                            className={`${GlobalStyles.inputSearch}`}
                            type="text"
                            placeholder="Search"
                        //   value={searchTerm}
                        //   onChange={handleSearch}
                        />
                    </div>
                    <div className={`${styles.userListTitle}`}>Select Employee</div>
                    <div className={`${styles.userScroll}`}>
                        {props.taskData.length > 0 ? (
                            props.taskData.map((task, i) => (
                                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                                    <div
                                        className={`dropdown-item ${GlobalStyles.dropdownItem}${props.selectedId === task.id
                                            ? GlobalStyles.selectedUser
                                            : ""
                                            } `}
                                        style={{
                                            backgroundColor:
                                                props.selectedId === task.id
                                                    ? "#9acaf1"
                                                    : "transparent",
                                            backgroundColor:
                                                props.selectedId === task.id
                                                    ? "#3fb2f114"
                                                    : "transparent",
                                        }}
                                        onClick={() => handleTaskSelect(task)}
                                    >
                                        <div
                                            className={`${GlobalStyles.userInfo}`}
                                            style={{
                                                color:
                                                    props.selectedId === task.id
                                                        ? "#000000"
                                                        : "#000000",
                                            }}
                                        >
                                            <span className={`${styles.employeeName}`}>
                                                {task.taskName}
                                            </span>
                                            <span>
                                                {task.status === 'inactive' && <span className={styles.redDot}></span>}
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
                </ul>
            </div>
        </div>
    )
}

export default TaskList
