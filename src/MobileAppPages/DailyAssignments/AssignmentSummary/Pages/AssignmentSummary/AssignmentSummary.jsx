import React from 'react'
import styles from '../../Styles/AssignmentSummary/AssignmentSummary.module.css'
import { ArrowLeft } from 'lucide-react'
import AssignmentSummaryBox from '../../Components/AssignmentSummary/AssignmentSummaryBox'

const AssignmentSummary = () => {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mobileView}>
                <div className={styles.header}>
                    <button
                        className={styles.backButton}
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