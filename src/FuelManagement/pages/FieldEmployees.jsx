import React, { useState } from 'react'
import GlobalStyles from '../../assets/css/globleStyles.module.css'
import AddFieldEmployee from '../components/AddFieldEmployee';
import EmployeeList from '../components/EmployeeList';
import styles from './FieldEmployee.module.css'

const FieldEmployees = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [employees, setEmployees] = useState([])
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleOpenModal = () => {
    setShowCanvas(true);
  }

  const handleAddEmployee = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee])
  }

  return (
     <>
        <div className={GlobalStyles.floatingDiv}>
          <button
            className={GlobalStyles.floatingBtn}
            onClick={handleOpenModal}
          >
            +
          </button>
        </div>

         <div className={`${styles.userPage}`}>
        {/* Background */}
        <div className={styles.background}>
          <div className={`${styles.gradientOrb} ${styles.orb1}`} />
          <div className={`${styles.gradientOrb} ${styles.orb2}`} />
          <div className={`${styles.gradientOrb} ${styles.orb3}`} />
          <div className={styles.gridOverlay} />
        </div>

        {/* Particles */}
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        <div className={`${styles.userPageLeft}`}>
          <EmployeeList
            employees={employees}
            selectedEmp={selectedEmp}
            setSelectedEmp={setSelectedEmp}
            loading={loading}
            setEmployees={setEmployees}
          />
        </div>
      </div>

        <AddFieldEmployee
        showCanvas={showCanvas}
        setShowCanvas={setShowCanvas}
        onAddEmployee={handleAddEmployee}
        />
      </>
  )
}

export default FieldEmployees
