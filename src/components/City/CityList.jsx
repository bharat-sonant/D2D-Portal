import GlobalStyles from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import styles from '../../Style/Task-Data/TaskDataList.module.css';

const CityList = (props) => {



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
                        {props.cityList.length > 0 ? (
                            props.cityList.map((city, i) => (
                                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                                    <div
                                        className={`dropdown-item ${GlobalStyles.dropdownItem}${props.selectedCity.id === city.id
                                            ? GlobalStyles.selectedUser
                                            : ""
                                            } `}
                                        style={{
                                            backgroundColor:
                                               props.selectedCity.id === city.id
                                                    ? "#9acaf1"
                                                    : "transparent",
                                            backgroundColor:
                                                props.selectedCity.id === city.id
                                                    ? "#3fb2f114"
                                                    : "transparent",
                                        }}
                                     onClick={() => props.setSelectedCity(city)}
                                    >
                                        <div
                                            className={`${GlobalStyles.userInfo}`}
                                            style={{
                                                color:
                                                   props.selectedCity.id === city.id
                                                        ? "#000000"
                                                        : "#000000",
                                            }}
                                        >
                                            <span className={`${styles.employeeName}`}>
                                                {city.name}
                                            </span>
                                            <span>
                                                {city.status === 'inactive' && <span className={styles.redDot}></span>}
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

export default CityList
