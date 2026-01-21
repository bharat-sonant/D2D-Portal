import React from 'react'
import styles from './EmployeeList.module.css'

const EmployeeList = ({
  employees,
  selectedEmp,
  setSelectedEmp,
  loading,
  onAddEmployee
}) => {
  if (loading) {
    return <div className={styles.loader}>Loading employees...</div>
  }

  if (!employees.length) {
    return (
      <div className={styles.empty}>
        <svg 
          className={styles.emptyIcon}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        <div className={styles.emptyTitle}>No Employees Yet</div>
        <div className={styles.emptyText}>
          Get started by adding your first field employee to the system
        </div>
        {onAddEmployee && (
          <button 
            className={styles.emptyButton}
            onClick={onAddEmployee}
          >
            Add Employee
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.listContainer}>
      {employees.map(emp => (
        <div
          key={emp.id}
          className={`${styles.employeeItem} ${
            selectedEmp?.id === emp.id ? styles.active : ''
          }`}
          onClick={() => setSelectedEmp(emp)}
        >
          <div className={styles.avatar}>
            {emp.employeeName.charAt(0).toUpperCase()}
          </div>

          <div className={styles.info}>
            <div className={styles.name}>
              {emp.employeeName}
            </div>
            <div className={styles.meta}>
              {emp.state} • {emp.vehicleType}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EmployeeList