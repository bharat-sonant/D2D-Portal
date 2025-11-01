import React, { useEffect, useState } from 'react'
import Styles from '../../assets/css/modal.module.css'
import modalStyles from '../../assets/css/Employee/StatePermissionsPopUP.module.css'
import { images } from "../../assets/css/imagePath";
import { getStatesList } from '../../services/SalesFeedback/SalesFeedbackService';

const StatePermissionsPopUP = (props) => {
    const [AllstatesData, SetAllStatesData] = useState(null);
    const company = localStorage.getItem('company')

    useEffect(() => {
        if (company) {
            getStatesList(company)
                .then((response) => {

                    if (response.status === 'success') {
                        SetAllStatesData(response.data);
                    } else {
                        console.error('Failed to fetch states data:', response.message);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching states data:', error);
                });
        }
    }, [company, props.activePopUp]);

    const handleClosePopUp = () => {
        props.setActivePopUp(false);
    };

    if (!props.activePopUp) {
        return null;
    }

    return (
        <>
            <div className={Styles.overlay}>
                <div className={Styles.modal}>
                    <div className={Styles.actionBtn}>
                        <p className={Styles.headerText}>Add State Permissions</p>
                        <button className={Styles.closeBtn} onClick={handleClosePopUp} >
                            <img
                                src={images.iconClose}
                                className={Styles.iconClose}
                                title="Close"
                                alt="icon"
                            />
                        </button>
                    </div>

                    <div className={Styles.modalBody}>
                        <div className="col-md-12">
                            <div className={Styles.textboxGroup}>

                                {AllstatesData ? (
                                    <ul className={`${modalStyles.stateUL}`}>
                                        {AllstatesData.map((state, index) => (

                                            <li className={`${modalStyles.stateLI}`} key={state.statesId}>{index + 1}.{state.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Loading states...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StatePermissionsPopUP;
