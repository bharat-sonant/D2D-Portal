import React from 'react'
import { toggleAssignment } from '../../Action/DailyAssignment/DailyAssignment';
import style from '../../Style/Settings.module.css';

const DailyAssignmentToggle = (props) => {
    return (
        <div className={style.card}>
            {/* <h3 className={style.cardTitle}>Daily Assignment Via</h3> */}
            <div className={style.toggleWrapper}>
                <label className={style.toggleLabel}>DailyAssignment Via Web</label>
                <div className={`${style.toggleSwitch} ${props.isAssignmentOn ? style.on : style.off}`} onClick={() => toggleAssignment(props)}>
                    <div className={style.toggleCircle}>{props.isAssignmentOn ? "ON" : "OFF"}</div>
                </div>
            </div>
        </div>
    )
}

export default DailyAssignmentToggle