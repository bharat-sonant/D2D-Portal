import GlobalStyles from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import styles from '../../Style/Task-Data/TaskDataList.module.css';

const UserList = (props) => {

    // const handleTaskSelect = (item) => {
    //     props.onSelectTask(item)
    // }

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
                        {props.users.length > 0 ? (
                            props.users.map((user, i) => (
                                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                                    <div
                                        className={`dropdown-item ${GlobalStyles.dropdownItem}${props.selectedUser.id === user.id
                                            ? GlobalStyles.selectedUser
                                            : ""
                                            } `}
                                        style={{
                                            backgroundColor:
                                               props.selectedUser.id === user.id
                                                    ? "#9acaf1"
                                                    : "transparent",
                                            backgroundColor:
                                                props.selectedUser.id === user.id
                                                    ? "#3fb2f114"
                                                    : "transparent",
                                        }}
                                     onClick={() => props.setSelectedUser(user)}
                                    >
                                        <div
                                            className={`${GlobalStyles.userInfo}`}
                                            style={{
                                                color:
                                                   props.selectedUser.id === user.id
                                                        ? "#000000"
                                                        : "#000000",
                                            }}
                                        >
                                            <span className={`${styles.employeeName}`}>
                                                {user.name}
                                            </span>
                                            <span>
                                                {user.status === 'inactive' && <span className={styles.redDot}></span>}
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

export default UserList
