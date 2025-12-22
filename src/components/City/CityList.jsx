import React, { useEffect } from "react";
import { useState } from 'react';
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import styles from '../../Style/Task-Data/TaskDataList.module.css';
import { debounce } from "lodash";
import { filterCityAction } from "../../Actions/City/cityAction";

const CityList = (props) => {
    const [searchTerm,setSearchTerm] = useState('');
    const [filteredCityList,setFilteredCityList] = useState(props?.cityList||[]);
    
    useEffect(()=>{
        setFilteredCityList(filterCityAction(props?.cityList,searchTerm,props?.setSelectedCity,props?.selectedCity))
    },[props?.cityList,searchTerm]);
    const handleSearch = debounce((e) => {setSearchTerm(e.target.value)}, 300);

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
                          onChange={handleSearch}
                        />
                    </div>
                    <div className={`${styles.userListTitle}`}>Select Employee</div>
                    <div className={`${styles.userScroll}`}>
                        {filteredCityList?.length > 0 ? (
                            filteredCityList?.map((city, i) => (
                                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                                    <div
                                        className={`dropdown-item ${GlobalStyles.dropdownItem}${props?.selectedCity?.id === city?.id
                                            ? GlobalStyles.selectedUser
                                            : ""
                                            } `}
                                        style={{
                                            backgroundColor:
                                               props?.selectedCity?.id === city.id
                                                    ? "#9acaf1"
                                                    : "transparent",
                                            backgroundColor:
                                                props?.selectedCity?.id === city.id
                                                    ? "#3fb2f114"
                                                    : "transparent",
                                        }}
                                     onClick={() => props?.setSelectedCity(city)}
                                    >
                                        <div
                                            className={`${GlobalStyles.userInfo}`}
                                            style={{
                                                color:
                                                   props?.selectedCity?.id === city.id
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
                                City not found
                            </div>
                        )}
                    </div>
                </ul>
            </div>
        </div>
    )
}

export default React.memo(CityList);
