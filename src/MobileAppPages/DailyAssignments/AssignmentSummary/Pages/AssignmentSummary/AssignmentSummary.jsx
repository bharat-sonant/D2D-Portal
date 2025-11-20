import { useEffect } from 'react'
import styles from '../../Styles/AssignmentSummary/AssignmentSummary.module.css'
import { ArrowLeft } from 'lucide-react'
import AssignmentSummaryBox from '../../Components/AssignmentSummary/AssignmentSummaryBox'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCityFirebaseConfig } from '../../../../../configurations/cityDBConfig';
import { connectFirebase } from '../../../../../firebase/firebaseService';

const AssignmentSummary = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city") || "DevTest";
    const navigate = useNavigate();

    useEffect(() => {
        if (city) {
            localStorage.setItem("city", city);

            let config = getCityFirebaseConfig(city);
            connectFirebase(config, city);
        } else {
            localStorage.setItem("city", "DevTest");
        }
    }, [city]);

    const handleBack = () => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (
            isAndroid &&
            window.AndroidApp &&
            typeof window.AndroidApp.closeWebView === "function"
        ) {
            window.AndroidApp.closeWebView();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mobileView}>
                <div className={styles.header}>
                    <button
                        className={styles.backButton}
                        onClick={handleBack}
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <h1 className={styles.title}>Assignment Summary</h1>
                </div>
                <AssignmentSummaryBox />
            </div>
        </div>
    )
}

export default AssignmentSummary