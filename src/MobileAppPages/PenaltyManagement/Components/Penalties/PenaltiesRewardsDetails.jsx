import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from '../../Styles/Penalties/PenaltiesRewardsDetail.module.css';
import * as action from '../../Actions/PenaltiesRewardDetails/PenaltiesDetailsAction';

const PenaltiesRewardsDetails = ({ onBack }) => {
    const [employee, setEmployee] = useState('');
    const [entryType, setEntryType] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // ✅ Listen for Android back press events
        const handleAndroidBack = (event) => {
            if (event.data === 'android_back_pressed') {
                onBack();
            }
        };

        window.addEventListener('message', handleAndroidBack);
        return () => window.removeEventListener('message', handleAndroidBack);
    }, [onBack]);

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

    const handleSave = () => {
        const fields = { employee, entryType, amount, category, reason };
        Object.entries(fields).forEach(([key, value]) => action.validateField(key, value, entryType, setErrors));

    };

    return (
        <div className={styles.penaltiesRewardsContainer}>
            <div className={styles.prHeader}>
                <button className={styles.prBackButton} onClick={onBack}>
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
                        onClick={() => console.log("Open employee selector modal")}
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
                                    <option value="" disabled>Select Category</option>
                                    <option value="Late Arrival">Late Arrival</option>
                                    <option value="Early Departure">Early Departure</option>
                                    <option value="Misconduct">Misconduct</option>
                                    <option value="Performance">Performance</option>
                                    <option value="Other">Other</option>
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
        </div>
    );
};

export default PenaltiesRewardsDetails;
