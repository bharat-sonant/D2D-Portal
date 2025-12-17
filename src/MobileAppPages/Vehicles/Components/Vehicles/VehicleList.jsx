import { useEffect, useMemo, useState } from 'react';
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import { images } from '../../../../assets/css/imagePath';
import styles from '../../Styles/Vehicle/Vehicle.module.css';

const VehicleList = (props) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleVehicleSelect = (item) => {
        props.onSelectVehicle(item);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredVehicleList = useMemo(() => {
        if (!searchTerm.trim()) return props.vehicleList;

        return props.vehicleList.filter((item) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, props.vehicleList]);

    useEffect(() => {
        if (!props.loading && filteredVehicleList.length > 0) {

            const alreadySelected = filteredVehicleList.find(
                (t) => t.vehicleId === props.selectedVehicleId
            );

            if (!alreadySelected) {
                props.onSelectVehicle(filteredVehicleList[0]);
            }
        }
    }, [filteredVehicleList, props.loading]);

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
                            placeholder="Search Vehicles"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
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

                        ) : filteredVehicleList.length > 0 ? (
                            filteredVehicleList.map((item, i) => (
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