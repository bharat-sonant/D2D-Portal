import React, { useState, useMemo } from 'react';
import GlobalStyles from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import styles from '../../Style/Task-Data/TaskDataList.module.css';

const TaskList = ({ taskData = [], selectedId, onSelectTask }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Search + Sort (Active first, Inactive last)
  const filteredAndSortedTasks = useMemo(() => {
    return [...taskData]
      // 🔍 Search filter
      .filter(task =>
        task.taskName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      // 🔃 Sort: active first, inactive last
      .sort((a, b) => {
        if (a.status === 'inactive' && b.status !== 'inactive') return 1;
        if (a.status !== 'inactive' && b.status === 'inactive') return -1;
        return 0;
      });
  }, [taskData, searchTerm]);

  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <div className={GlobalStyles.overlay} style={{ display: "block" }}>
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown}`}
          style={{ display: "block" }}
          aria-labelledby="dropDownMenuButton"
        >
          {/* 🔍 Search box */}
          <div className={GlobalStyles.searchGroup}>
            <input
              className={GlobalStyles.inputSearch}
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.userListTitle}>Select Employee</div>

          <div className={styles.userScroll}>
            {filteredAndSortedTasks.length > 0 ? (
              filteredAndSortedTasks.map((task, idx) => {
                const isSelected = selectedId === task.uniqueId;

                return (
                  <li className={GlobalStyles.dropdownLi} key={idx}>
                    <div
                      className={`dropdown-item ${GlobalStyles.dropdownItem} ${
                        isSelected ? GlobalStyles.selectedUser : ''
                      }`}
                      style={{
                        backgroundColor: isSelected ? '#3fb2f114' : 'transparent'
                      }}
                      onClick={() => onSelectTask(task)}
                    >
                      <div
                        className={GlobalStyles.userInfo}
                        style={{ color: '#000000' }}
                      >
                        <span className={styles.employeeName}>
                          {task.taskName}
                        </span>

                        {/* 🔴 Red dot for inactive task */}
                        {task.status === 'inactive' && (
                          <span className={styles.redDot}></span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <div className={styles.noUserData}>
                <img
                  src={images.imgComingSoon}
                  className={`img-fluid ${styles.noUserImg}`}
                  title="No User Found"
                  alt="No User Found"
                />
                No task data found
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
