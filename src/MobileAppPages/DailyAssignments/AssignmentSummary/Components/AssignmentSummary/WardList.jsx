import styles from '../../Styles/AssignmentSummary/WardList.module.css';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkTaskStatus } from '../../Action/AssignmentSummary/AssignmentSummaryAction';
import { useState } from 'react';

const WardList = (props) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const goToDutyOn = (wardName) => {
        navigate(`/duty-on?task=${encodeURIComponent(wardName)}`);
    };

    const goToDutyOff = (wardName) => {
        navigate(`/duty-off?task=${encodeURIComponent(wardName)}`)
    }

    const handleRouting = async(ward) => {
        setLoading(true);
        const result = await checkTaskStatus(ward);
        setLoading(false);
        if(result.data === "Assigned"){
            goToDutyOff(ward)
        }else{
            goToDutyOn(ward)
        }
    }
    return (
        <div className={styles.listContainer}>
            {loading && (
                <div className={styles.overlayLoader}>
                    <div className={styles.spinner}></div>
                    <p>Checking task...</p>
                </div>
            )}



            {props.loading ? (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                    <span>Loading wards...</span>
                </div>
            ) : (
                props.wards.map((ward, index) => (
                    <div
                        key={index}
                        className={styles.wardRow}
                    >
                        <span className={styles.wardName}>{ward}</span>

                        <span className={styles.arrowBox} onClick={()=>handleRouting(ward)}>
                            <ArrowRight />
                        </span>
                    </div>
                ))
            )}

        </div>
    );
};

export default WardList;
