import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import styles from '../../Styles/Penalties/EmployeeModal.module.css';

const EmployeeSelectionModal = ({ isOpen, onClose, onSelectEmployee }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Sample employee list - replace with your actual data
    const employees = [
        { id: 101, name: "BHARAT SHEKHAR VASHISTHA" },
        { id: 102, name: "WEVOIS QA" },
        { id: 103, name: "PRADEEP KUMAR GOYAL" },
        { id: 104, name: "DRIVER 1 - BHARAT" },
        { id: 105, name: "HELPER 1 - BHARAT" },
        { id: 106, name: "PRADEEP - DRIVER" },
        { id: 107, name: "PRADEEP - HELPER" },
        { id: 108, name: "HARENDRA-DRIVER" },
        { id: 109, name: "HARENDRA-HELPER" },
        { id: 111, name: "KHUSHWANT SHARMA-DRIVER" },
        { id: 112, name: "KHUSHWANT SHARMA -HELPER" },
        { id: 113, name: "ROHIT - DRIVER" },
        { id: 114, name: "PRATAP - HELPER" },
        { id: 115, name: "FIELD EXECUTIVE 1" }
    ];

    // Filter employees based on search query
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toString().includes(searchQuery)
    );

    const handleEmployeeSelect = (employee) => {
        onSelectEmployee(`${employee.name} (${employee.id})`);
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