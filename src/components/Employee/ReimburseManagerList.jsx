import styles from '../../Style/Attendance/AttendanceApprover.module.css';
import { setAlertMessage } from '../../common/common';
import { grantAsExpenseReimburseManager } from '../../services/Employee/ExpenseManagerService';

const ReimburseManagerList = (props) => {

    const handleCheckboxChange = (empCode, name) => {
        let company = localStorage.getItem('company');
        const currentSelection = props.selectedRow || [];

        const isSelected = currentSelection.indexOf(empCode) !== -1;

        if (!isSelected && currentSelection.length >= 5) {
            setAlertMessage('error', 'Limit reached: Only 5 managers can be assigned to reimbursement.');
            return;
        }

        const updatedSelectedRows = isSelected
            ? currentSelection.filter(code => code !== empCode)
            : [...currentSelection, empCode];

        props.setSelectedRow(updatedSelectedRows);

        grantAsExpenseReimburseManager(
            company,
            [props.selectedPeopledata.employeeCode],
            updatedSelectedRows
        ).then((resp) => {
            if (resp === 'success') {
                if (!isSelected) {
                    setAlertMessage('success', `🎉 ${name} is now responsible for approving ${props.selectedPeopledata.name}'s expense reimbursements!`);
                } else {
                    setAlertMessage('success', `❌ ${name} is no longer responsible for approving ${props.selectedPeopledata.name}'s expense reimbursements!`);
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
                                        checked={(props.selectedRow || []).indexOf(item.empCode) !== -1}
                                        onChange={() => handleCheckboxChange(item.empCode, item.name)}
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

export default ReimburseManagerList;
