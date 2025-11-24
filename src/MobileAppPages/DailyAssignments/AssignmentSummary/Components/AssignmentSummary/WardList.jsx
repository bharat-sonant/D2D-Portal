import styles from '../../Styles/AssignmentSummary/WardList.module.css';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkTaskStatus } from '../../Action/AssignmentSummary/AssignmentSummaryAction';

const WardList = (props) => {
    const navigate = useNavigate();

    const goToDutyOn = (wardName) => {
        navigate(`/duty-on?task=${encodeURIComponent(wardName)}`);
    };

    const goToDutyOff = (wardName) => {
        navigate(`/duty-off?task=${encodeURIComponent(wardName)}`)
    }

    const handleRouting = async(ward) => {
        const result = await checkTaskStatus(ward);
        if(result.data === "Assigned"){
            goToDutyOff(ward)
        }else{
            goToDutyOn(ward)
        }
    }
    return (
        <div className={styles.listContainer}>

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
