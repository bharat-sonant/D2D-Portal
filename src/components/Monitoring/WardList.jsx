import React, { useEffect, useState } from 'react'
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import styles from '../../Style/Task-Data/TaskDataList.module.css';
import { images } from '../../assets/css/imagePath';
import { debounce } from 'lodash';
import { filterWardAction } from '../../Actions/Monitoring/WardAction';
import WevoisLoader from '../Common/Loader/WevoisLoader';

const WardList = (props) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredWardList, setFilteredWardList] = useState(props?.wardList || []);

    useEffect(() => {
        setFilteredWardList(filterWardAction(props?.wardList, searchTerm, props?.setSelectedWard, props?.selectedWard))
    }, [props?.wardList, searchTerm]);


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
                    
                    <div className={`${styles.userListTitle}`}>Select Ward</div>
                    <div className={`${styles.userScroll}`} style={{marginTop:'10px'}}>
                        {props.loading ? (
                            <WevoisLoader title="Loading ward data..." />
                        ) : filteredWardList?.length > 0 ? (
                            filteredWardList?.map((ward) => (
                                <li className={`${GlobalStyles.dropdownLi}`} key={ward.id}>
                                    <div
                                        className={`dropdown-item ${GlobalStyles.dropdownItem}`}
                                        style={{
                                            backgroundColor:
                                                props?.selectedWard?.id === ward.id
                                                    ? "#9acaf1"
                                                    : "transparent",
                                            backgroundColor:
                                                props?.selectedWard?.id === ward.id

                                                    ? "#3fb2f114"
                                                    : "transparent",
                                        }}
                                        onClick={() => props?.setSelectedWard(ward)}
                                    >
                                        <div
                                            className={`${GlobalStyles.userInfo}`}
                                            style={{
                                                color:
                                                    props?.selectedWard?.id === ward.id
                                                        ? "#000000"
                                                        : "#000000",
                                            }}
                                        >
                                            <span className={`${styles.employeeName}`}>
                                                {ward.name}
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
                                Ward not found
                            </div>
                        )}
                    </div>
                </ul>
            </div>
        </div>
    )
}

export default WardList
