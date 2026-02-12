import React from 'react';
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import styles from '../../assets/css/City/CityList.module.css';
import { images } from '../../assets/css/imagePath';
import { filterWardAction } from '../../Actions/Monitoring/wardListSectionAction';
import WevoisLoader from '../Common/Loader/WevoisLoader';

const WardList = (props) => {
    const searchTerm = '';
    const filteredWardList = filterWardAction(props?.wardList || [], searchTerm);

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
                        width: "300px"
                    }}
                    aria-labelledby="drop downMenuButton"
                >

                    <div className={`${styles.userListTitle}`}>Select Ward</div>
                    <div className={`${styles.userScroll}`} style={{ marginTop: '10px' }}>
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
                                            cursor: props?.interactionLocked ? "not-allowed" : "pointer",
                                            opacity: props?.interactionLocked ? 0.6 : 1,
                                        }}
                                        onClick={() => {
                                            if (props?.interactionLocked) return;
                                            props?.onWardSelect?.(ward);
                                        }}
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: '8px' }}>
                                                <span className={`${styles.employeeName}`} style={{ whiteSpace: 'normal', wordBreak: 'break-word', flex: 1, color: '#1e293b' }}>
                                                 {ward.display_name}
                                                </span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    color: '#3fb2f1',
                                                    background: '#f0f7ff',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #3fb2f1',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    75%
                                                </span>
                                            </div>
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
    );
};

export default WardList;
