import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from '../../Styles/Penalties/PenaltiesRewardsDetail.module.css';
import * as action from '../../Actions/PenaltiesRewardDetails/PenaltiesDetailsAction';
import EmployeeSelectionModal from './EmployeeModal';
import { savePaneltiesData } from '../../Services/Penalties/PenaltiesService';

const PenaltiesRewardsDetails = (props) => {
    const [employee, setEmployee] = useState('');
    const [entryType, setEntryType] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState('');
    const [rewardTypes, setRewardTypes] = useState([]);
    const [penaltyTypes, setPenaltyTypes] = useState([]);

    useEffect(() => {
        const handleAndroidBack = (event) => {
            if (event.data === 'android_back_pressed') {
                if (isModalOpen) {
                    setIsModalOpen(false);
                } else {
                    props.onBack();
                }
            }
        };

        window.addEventListener('message', handleAndroidBack);
        return () => window.removeEventListener('message', handleAndroidBack);
    }, [props.onBack, isModalOpen]);

    useEffect(() => {
        action.getEmployeesData(setEmployees)
    }, [])

    useEffect(() => {
        if (entryType === 'Penalty') {
            action.getPenaltiesType(setPenaltyTypes);
        } else if (entryType === 'Reward') {
            action.getRewardTypes(setRewardTypes);
        }
    }, [entryType])

    const onHandleChange = (name, value) => {
        action.handleChange(
            name,
            value,
            setEmployee,
            setEntryType,
            setAmount,
            setCategory,
            setReason,
            entryType,
            setErrors
        );
    };

    const handleSave = async () => {
        action.handleSavePenaltiesData(
            props,
            employeeId,
            entryType,
            amount,
            category,
            reason,
            setErrors,
            handleClear
        );
    };

    const handleEmployeeSelect = (selectedEmployee) => {
        setEmployeeId(selectedEmployee.id);
        setEmployee(selectedEmployee.name);
        setErrors(prev => ({ ...prev, employee: '' }));
    };

    const handleClear = () => {
        action.handleClear(
            setEmployee,
            setEntryType,
            setAmount,
            setCategory,
            setReason,
            setErrors
        );
    };

    return (
        <div className={styles.penaltiesRewardsContainer}>
            <div className={styles.prHeader}>
                <button className={styles.prBackButton} onClick={() => { props.onBack(); handleClear(); }}>
                    <ArrowLeft size={24} color="white" />
                </button>
                <h1 className={styles.prTitle}>Penalty/Rewards Details</h1>
            </div>

            <div className={styles.prForm}>
                <div className={styles.prFieldGroup}>
                    <input
                        type="text"
                        value={employee}
                        placeholder="Select Employee Name"
                        className={styles.prInput}
                        style={{ cursor: 'pointer' }}
                        readOnly
                        onClick={() => setIsModalOpen(true)}
                        onBlur={() => action.validateField('employee', employee, entryType, setErrors)}
                    />
                    {errors.employee && <p className={styles.errorText}>{errors.employee}</p>}
                </div>

                <div className={styles.prFieldGroup}>
                    <label className={styles.prLabel}>
                        Entry type
                    </label>
                    <div className={styles.prSelectWrapper}>
                        <select
                            value={entryType}
                            onChange={(e) => onHandleChange('entryType', e.target.value)}
                            className={`${styles.prSelect} ${errors.entryType ? styles.inputError : ''}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="" disabled>Select Entry Type</option>
                            <option value="Penalty">Penalty</option>
                            <option value="Reward">Reward</option>
                        </select>
                    </div>
                    {errors.entryType && <p className={styles.errorText}>{errors.entryType}</p>}
                </div>

                {entryType && (
                    <div className={styles.prRowFields}>
                        <div className={styles.prFieldGroupHalf}>
                            <label className={styles.prLabel}>
                                {entryType === 'Penalty' ? 'Penalty Type' : entryType === 'Reward' ? 'Reward Type' : 'Category'}
                            </label>
                            <div className={styles.prSelectWrapper}>
                                <select
                                    value={category}
                                    onChange={(e) => onHandleChange('category', e.target.value)}
                                    className={`${styles.prSelectHalf} ${errors.category ? styles.inputError : ''}`}
                                >
                                    <option value="" disabled>
                                        {entryType === 'Penalty' ? 'Select Penalty Type' : 'Select Reward Type'}
                                    </option>

                                    {entryType === 'Penalty' &&
                                        penaltyTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}

                                    {entryType === 'Reward' &&
                                        rewardTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                </select>

                            </div>
                            {errors.category && <p className={styles.errorText}>{errors.category}</p>}
                        </div>

                        <div className={styles.prFieldGroupHalf}>
                            <label className={styles.prLabel}>Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => onHandleChange('amount', e.target.value)}
                                placeholder="Enter amount"
                                className={`${styles.prInputHalf} ${errors.amount ? styles.inputError : ''}`}
                            />
                            {errors.amount && <p className={styles.errorText}>{errors.amount}</p>}
                        </div>
                    </div>
                )}

                <div className={styles.prFieldGroup}>
                    <label className={styles.prLabel}>
                        Reason
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => onHandleChange('reason', e.target.value)}
                        placeholder="Enter Reason"
                        className={`${styles.prTextarea} ${errors.reason ? styles.inputError : ''}`}
                        rows="8"
                    />
                    {errors.reason && <p className={styles.errorText}>{errors.reason}</p>}
                </div>
            </div>

            <button className={styles.prSaveButton} onClick={handleSave}>
                SAVE PENALTY/REWARD
            </button>

            <EmployeeSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectEmployee={handleEmployeeSelect}
                employees={employees}
            />
        </div>
    );
};

export default PenaltiesRewardsDetails;