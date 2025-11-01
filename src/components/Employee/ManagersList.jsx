import React, { useEffect, useState } from 'react';
import styles from '../../Style/Attendance/AttendanceApprover.module.css';
import { getManagersList } from '../../actions/Employee/AttendanceApproverAction';
import { grantAsAttendanecManager } from '../../services/Attendance/AttendanceApprovalService';
import { setAlertMessage } from '../../common/common';

const ManagersList = (props) => {
    
    const handleCheckboxChange = (empCode, name) => {
        let company = localStorage.getItem('company');
        const newEmpCode = props.selectedRow === empCode ? "" : empCode;
    
        props.setSelectedRow(prev => (prev === empCode ? null : empCode));
        
        grantAsAttendanecManager(company, props.selectedPeopledata.employeeCode, newEmpCode).then((resp) => {
            if (resp === 'success') {
                if (newEmpCode) {
                    setAlertMessage('success', `🎉 Congratulations! ${name} is now the Attendance Approver of ${props.selectedPeopledata.name}!`);
                } else {
                    setAlertMessage('success', `❌ ${name} is no longer the Attendance Approver of ${props.selectedPeopledata.name}.`);
                }
            }
        });
    };
    

    return (
        <div className={styles.sideWindow}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.managerData.length > 0 && props.managerData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={props.selectedRow === item.empCode}
                                        onChange={() => handleCheckboxChange(item.empCode,item.name)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagersList;
