import { useEffect, useState } from 'react';
import { getExpensesRecord } from '../../actions/Expense/AddExpenseAction';
import styless from "../../assets/css/Expenses/ExpenseReimburseDetails.module.css";
import styles from "../../assets/css/Branch/BranchList.module.css";
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import dayjs from 'dayjs';
import { PulseLoader } from 'react-spinners';
import { images } from '../../assets/css/imagePath';

const ExpensesRecord = (props) => {
    const [listLoader, setListLoader] = useState(true);

    useEffect(() => {
        if (!props.trigger) {
            props.setTrigger(prev => !prev);
        }
    }, []);

    useEffect(() => {
        if (!props.selectedYear || !props.selectedMonth) return;
        getExpensesRecord(
            props.selectedYear,
            props.selectedMonth,
            props.setData,
            props.setTotalAmount,
            props.setShowData,
            props.setTrigger,
            props.selectedEmployee,
            props.employeeView,
            props.ownerPanel,
            setListLoader
        );
    }, [props.selectedYear, props.selectedMonth, props.trigger, props.employeeView, props.selectedEmployee, props.ownerPanel]);

    const handleClick = (data) => {
        if (props.showData?.expenseId !== data.expenseId) {
            props.setShowData(data);
        }
    };

    const filteredExpenses = props.searchQuery ? props.data.filter(item => item.status.toLowerCase().startsWith(props.searchQuery.toLowerCase())) : props.data;

    useEffect(() => {
        if (!props.data || props.data.length === 0) return;

        const isSelectedStillValid = props.data.some(
            (item) => item.expenseId === props.showData?.expenseId
        );

        if (!props.showData || !isSelectedStillValid) {
            props.setShowData(props.data[0]);
        }
    }, [props.data, props.ownerPanel]);

    return (
        <>
            {listLoader ? (
                <div
                    className={styles.loaderContainer}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                    }}
                >
                    <PulseLoader color="#3fb2f1" size={11} />
                    <div className={`${GlobalStyles.loaderText}`} style={{ marginTop: '10px' }}>
                        Loading, Please wait
                    </div>
                </div>
            ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => {
                    const isSelected = props.showData?.expenseId === expense.expenseId;
                    return (
                        <div
                            key={expense.expenseId}
                            className={`dropdown-item ${styless.boxList} ${isSelected ? GlobalStyles.selectedUser : ""}`}
                            style={{
                                backgroundColor: isSelected ? "#3fb2f114" : "",
                                cursor: 'pointer',
                                padding: '10px',
                            }}
                            onClick={() => handleClick(expense)}
                        >
                            <div className={styless.boxRight}>
                                <div className={styless.branchEdit}>
                                    <div className={styless.addressLineLeft}>
                                        <p className={styless.LineAdd}>{`${expense.title} Expense report`}</p>
                                    </div>
                                    <div className={styless.statusText}>
                                        <span className={`${styless.statusBadge} 
                                                          ${expense.status === 'Drafted' ? styless.drafted : ""}
                                                          ${expense.status === 'Approved' ? styless.approved : ""} 
                                                          ${expense.status === 'Reimbursed' ? styless.reimbursed : ''} 
                                                          ${expense.status === 'Rejected' ? styless.rejected : ''} 
                                                          ${expense.status === 'Pending Approval' ? styless.pendingApproval : ''}
                                                          ${expense.status === 'Under Review' ? styless.underReview : ''}`}
                                        >
                                            {expense.status}
                                        </span>
                                    </div>
                                </div>

                                <div className={styless.dCity}>
                                    <div className={styless.cityAmount}>
                                        <img
                                            src={images.iconRupee}
                                            className={`${styless.iconRupee}`}
                                        /> {` ${parseFloat(expense?.amount) % 1 === 0
                                            ? parseInt(expense?.amount)
                                            : parseFloat(expense?.amount).toFixed(2)
                                            }`}
                                    </div>
                                    <div className={styless.addressLine}>
                                        {dayjs(expense._at).format('DD MMM YYYY')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className={` ${styles.iconnotData} `}>
                    <img src={images.noUser} className={styles.iconNo} />
                    <p className={styles.textNo}>No history available</p>
                </div>
            )}
        </>
    );
};

export default ExpensesRecord;
