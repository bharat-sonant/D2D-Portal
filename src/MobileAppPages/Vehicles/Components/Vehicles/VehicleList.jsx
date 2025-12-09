import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import { images } from '../../../../assets/css/imagePath';
import styles from '../../Styles/Vehicle/Vehicle.module.css';

const VehicleList = (props) => {

    const handleVehicleSelect = (item) => {
        props.onSelectVehicle(item);
    };

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
                    <div className={`${styles.userListTitle}`}>Select Vehicles</div>
                    <div className={`${styles.userScroll}`}>
                        {props.loading ? (
                            <div className={styles.loaderContainer}>
                                <div className={styles.cityLoaderWrapper}>
                                    <div className={styles.cityLoader}></div>
                                    <img src={images.wevoisLogo} alt="loader icon" className={styles.centerIcon} />
                                </div>

                                <div className={styles.loaderText}>Please wait... Loading vehicle data.</div>
                            </div>

                        ) : props.vehicleList.length > 0 ? (
                            props.vehicleList.map((item, i) => (
                                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                                    <div
                                        className={`dropdown-item ${GlobalStyles.dropdownItem} 
                                        ${props.selectedVehicleId === item.vehicleId ? GlobalStyles.selectedUser : ""}
                                            `}
                                        style={{
                                            backgroundColor:
                                                props.selectedVehicleId === item.vehicleId
                                                    ? "#9acaf1"
                                                    : "transparent",
                                            backgroundColor:
                                                props.selectedVehicleId === item.vehicleId
                                                    ? "#3fb2f114"
                                                    : "transparent",
                                        }}
                                        onClick={() => handleVehicleSelect(item)}
                                    >
                                        <div
                                            className={`${GlobalStyles.userInfo}`}
                                            style={{
                                                color:
                                                    props.selectedVehicleId === item.vehicleId
                                                        ? "#000000"
                                                        : "#000000",
                                            }}
                                        >
                                            <span className={`${styles.employeeName}`}>
                                                {item.name}
                                            </span>
                                            <span>
                                                {item.status === 'inactive' && <span className={styles.redDot}></span>}
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
                                No vehicle data found
                            </div>
                        )}
                    </div>
                </ul>
            </div>
        </div>
    )
}

export default VehicleList