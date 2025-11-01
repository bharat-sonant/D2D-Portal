import React, { useState } from 'react';
import Styles from "../../../src/assets/css/modal.module.css";
import Style from '../../Style/LoginAs/LoginAs.module.css';
import globleStyle from '../../assets/css/globleStyles.module.css';
import { MdLogin } from "react-icons/md";

import { images } from '../../assets/css/imagePath';
import { encryptValue } from '../../common/common';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { PulseLoader } from 'react-spinners';

const LoginAsModal = (props) => {
    const companyCode = localStorage.getItem('companyCode');
    const [searchTerm, setSearchTerm] = useState("");
    const [btnLoader, setBtnLoader] = useState(false);
    const empCode = localStorage.getItem('empCode');

    const handleSearch = debounce((e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchTerm(keyword);

        const filtered = props.employeeArray.filter(user =>
            user.name?.toLowerCase().includes(keyword) ||
            user.empCode?.toLowerCase().includes(keyword)
        );

        props.setFilteredUsers(filtered);
    }, 300);



    const handleLogin = (item) => {
        setBtnLoader(true)
        let todayDate = dayjs().format("DD/MM/YYYY");
     
    }


    return (
        <>
            <div className={Styles.overlay}>
                <div className={Styles.modal}>
                    <div className={`${Styles.actionBtn}`}>
                        <p className={Styles.headerText}>Login As</p>
                        <button
                            className={`${Styles.closeBtn}`}
                            onClick={() => props.setShowLoginAsModal(false)}
                        >
                            <img
                                src={images.iconClose}
                                className={`${Styles.iconClose}`}
                                title="Close"
                                alt=""
                            />
                        </button>
                    </div>
                    <div className={`${Styles.modalBody} ${Style.modalBodyAs} mb-4`}>
                        <div className={`${Style.searchGroup}`}>
                            <input
                                className={`${globleStyle.inputSearch}`}
                                type="text"
                                placeholder="Search"
                                onChange={handleSearch}
                            />
                        </div>
                        <div className={`${Style.userOver}`}>
                            {props.filteredUsers.length === 0 && props.loading ? (
                                <div className={`${Style.noDataView}`}>
                                    <PulseLoader color="#3fb2f1" size={11} />
                                    <div className={`${globleStyle.loaderText}`}>
                                        Loading users, Please wait
                                    </div>
                                </div>

                            ) :
                                props.filteredUsers
                                    .sort((a, b) => {
                                        if (a.isCompany === 'yes' && b.isCompany !== 'yes') return -1;
                                        if (a.isCompany !== 'yes' && b.isCompany === 'yes') return 1;
                                        if (a.empCode === empCode) return -1;
                                        if (b.empCode === empCode) return 1;
                                        return 0;
                                    })
                                    .map(user => (
                                        <div
                                            key={user.empCode}
                                            className={`${Style.LoginUse} `}

                                        >

                                            <div className={`${Style.userAvtar}`}>
                                                {user?.name ? `${user?.name.split('')[0]}` : user.name}
                                            </div>
                                            <div className={Style.userdetail}>
                                                <div className={Style.Owner}>
                                                    <h5>{user.name}</h5>
                                                    {user.isCompany === 'yes' && <p>Owner</p>}
                                                </div>
                                                <div className={Style.userdetail2}>
                                                    {user.empCode === empCode ? (
                                                        <p>Logged In As</p>
                                                    ) : (
                                                        <p></p>
                                                    )}
                                                </div>
                                            </div>

                                            {user?.empCode !== empCode &&
                                                <div className={`${Style.login_icon}`} style={{
                                                    pointerEvents: btnLoader ? 'none' : 'auto',
                                                    opacity: btnLoader ? 0.5 : 1,
                                                    cursor: btnLoader ? 'not-allowed' : 'pointer'
                                                }} >
                                                    <MdLogin style={{ fontSize: '20px' }} onClick={() => handleLogin(user)}
                                                        title={`Login As ${user.name}`} />
                                                </div>}
                                        </div>
                                    ))
                            }
                            {props.filteredUsers.length === 0 && !props.loading && (
                                <div className={`${Style.noDataView}`}>
                                    <img src={images.noUser} alt="No Users" />
                                    <p>No users found</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginAsModal