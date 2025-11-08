import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import styles from '../../Styles/Penalties/EmployeeModal.module.css';

const EmployeeSelectionModal = ({ isOpen, onClose, onSelectEmployee, employees }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const sortedEmployees = [...employees].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const filteredEmployees = sortedEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toString().includes(searchQuery)
    );

    const handleEmployeeSelect = (employee) => {
        onSelectEmployee(employee);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <button className={styles.backButton} onClick={onClose}>
                        <ArrowLeft size={24} color="white" />
                    </button>
                    <h2 className={styles.modalTitle}>Select Employee</h2>
                </div>

                {/* Search Input */}
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Enter Name here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                {/* Employee List */}
                <div className={styles.employeeList}>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                            <div
                                key={employee.id}
                                className={styles.employeeItem}
                                onClick={() => handleEmployeeSelect(employee)}
                            >
                                {employee.name} ({employee.id})
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>No employees found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeSelectionModal;
