import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from '../../Styles/Penalties/PenaltiesRewardsDetail.module.css';

const PenaltiesRewardsDetails = ({ onBack }) => {
    const [employee, setEmployee] = useState('');
    const [entryType, setEntryType] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        const handleAndroidBack = (event) => {
            if (event.data === 'android_back_pressed') {
                onBack();
            }
        };
        window.addEventListener('message', handleAndroidBack);
        return () => window.removeEventListener('message', handleAndroidBack);
    }, [onBack]);


    const handleSave = () => {
        if (!employee || !entryType || !reason) {
            alert('Please fill all fields before saving.');
            return;
        }
        console.log('Saved:', { employee, entryType, amount, category, reason });
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
                <input
                    type="text"
                    value={employee}
                    placeholder="Select Employee Name"
                    className={styles.prInput}
                    style={{ cursor: 'pointer' }}
                    readOnly
                    onClick={() => console.log("Open employee selector modal")}
                />

                <div className={styles.prSelectWrapper}>
                    <select
                        value={entryType}
                        onChange={(e) => setEntryType(e.target.value)}
                        className={styles.prSelect}
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="">Select Entry Type</option>
                        <option value="Penalty">Penalty</option>
                        <option value="Reward">Reward</option>
                    </select>
                </div>

                {entryType && (
                    <div className={styles.prRowFields}>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            className={styles.prInputHalf}
                        />
                        <div className={styles.prSelectWrapper}>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={styles.prSelectHalf}
                            >
                                <option value="">Select Category</option>
                                <option value="Late Arrival">Late Arrival</option>
                                <option value="Early Departure">Early Departure</option>
                                <option value="Misconduct">Misconduct</option>
                                <option value="Performance">Performance</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                )}

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter Reason"
                    className={styles.prTextarea}
                    rows="8"
                />
            </div>

            <button className={styles.prSaveButton} onClick={handleSave}>
                SAVE PENALTY/REWARD
            </button>
        </div>
    );
};

export default PenaltiesRewardsDetails;
