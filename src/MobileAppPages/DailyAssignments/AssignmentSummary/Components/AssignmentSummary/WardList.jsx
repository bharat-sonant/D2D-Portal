import styles from '../../Styles/AssignmentSummary/WardList.module.css';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WardList = (props) => {
    const navigate = useNavigate();

    const goToDutyOn = (wardName) => {
        navigate(`/duty-on?task=${encodeURIComponent(wardName)}`);
    };

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

                        <span className={styles.arrowBox} onClick={() => goToDutyOn(ward)}>
                            <ArrowRight />
                        </span>
                    </div>
                ))
            )}

        </div>
    );
};

export default WardList;
