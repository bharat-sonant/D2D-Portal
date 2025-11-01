import React, { useEffect, useState } from "react";
import styles from "../../assets/css/Dashboard/DashboardTask.module.css";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import { getEmployeeThoseHaveTaskPageAccess, getLoggedInUserTaskRealtime } from "../../services/Dashboard/dashboardServices";
import { useNavigate } from "react-router-dom";
import { images } from "../../assets/css/imagePath";
import { PulseLoader } from "react-spinners";
import { TechEmployeeFilter } from "./TechEmployeeFilter";

const DashboardTask = () => {
  const Company = localStorage.getItem("company");
  // const empCode = localStorage.getItem("empCode");
  const navigate = useNavigate();
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empCode, setEmpCode] = useState(localStorage.getItem("empCode"))
  const isOwner = localStorage.getItem('isOwner')
  const editTaskData = (task) => {
    const prefix = task.parentTaskId.split("-")[0];
    let followDevelopmentCycle = task.followDevelopmentCycle === null ? true:task.followDevelopmentCycle
    navigate(`/taskdetails`, {
      state: {
        taskId: task.parentTaskId,
        project: task.projectId,
        prefix: prefix,
        mainTaskOwner: task.mainTaskOwner,
        projectManger: task.projectManager || "",
        followsDevelopmentCycle:followDevelopmentCycle,
        allEmployees: [],
      },
    });
  };

  const statusOptions = [
    { id: 0, name: "Draft" },
    { id: 1, name: "Open" },
    { id: 2, name: "In-Progress" },
    { id: 3, name: "Pause" },
    { id: 4, name: "Done" },
    { id: 5, name: "In-Review" },
    { id: 6, name: "Reopen" },
    { id: 7, name: "Completed" },
    { id: 8, name: "To Be Assigned" },
    { id: 9, name: "Ready To Test" },
    { id: 10, name: "To Be Reviewed" },
    { id: 11, name: "Review Done" }
  ];


  useEffect(() => {
    if (!Company || !empCode) return;
    const unsubscribe = getLoggedInUserTaskRealtime(Company, empCode, (res) => {
      setLoading(false)
      if (res.status === 'success') {
        setTaskList(res.data)

      } else {
        setTaskList([])
        console.error(res.message);
      }
    });

    // Cleanup: unsubscribe listener when component unmounts
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [Company, empCode]);

  return (
    <div className={styles.toDoCard}>
      <div className={styles.CardHeader}>
        {/* <img src={images.iconTask} className={`${styles.iconTask}`} title="To do task" alt="icon" /> */}
        To Do Task
        {isOwner === 'Yes' && (
          <TechEmployeeFilter setEmpCode={setEmpCode} />
        )}

      </div>
      <div style={{height:'calc(100vh - 150px)',overflow:'auto'}}>
        {loading ? (
          // ✅ Show loader when loading is true
          <div className={styles.noTaskCard}>
            <PulseLoader color="#3fb2f1" size={11} />
            <div className={GlobalStyles.loaderText}>
              Loading Task, Please wait
            </div>
          </div>
        ) : taskList.length > 0 ? (
          // ✅ Show task list if data is available
          <div className={` ${styles.allTask}`}>
            {taskList.map((task, index) => {
              const selectedStatus = statusOptions.find(
                (status) =>
                  Number(status.id) ===
                  Number(task.status ?? task.mainTaskStatus)
              );

              return (
                <div className={`${styles.taskBox}`} key={index}>
                  <div
                    className={`${styles.mainTask}`}
                    onClick={() => editTaskData(task)}
                  >
                    <div
                      className={`${styles.mainTaskRow} ${task.subtasks?.length === 0
                          ? styles.noSubtaskPadding
                          : ""
                        }`}
                    >
                      <div className={`${styles.mainTaskLeft}`}>
                        <span className={`${styles.sNumber}`}>
                          {index + 1}.
                        </span>
                        <span className={`${styles.taskMainTitle}`}>
                          {task.mainTaskTitle}
                          {task.subtasks?.length > 0 && (
                            <span className={`${styles.subtaskCount}`}>
                              {task.subtasks.length}
                              <img
                                src={images.iconSubTask}
                                className={styles.iconSubTask}
                                title="Sub Task"
                                alt="icon"
                              />

                            </span>
                          )}
                        </span>
                      </div>
                      <div className={`${styles.mainTaskRight}`}>
                        <span
                          // className={`${getStatusBgClass(
                          //   selectedStatus?.name
                          // )}`}
                        >
                          {selectedStatus?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.subtasks.map((sub, subIndex) => {
                    const subStatus = statusOptions.find(
                      (status) => Number(status.id) === Number(sub.status)
                    );
                    return (
                      <div
                        className={`${styles.subTask} ${subIndex === task.subtasks.length - 1
                            ? styles.lastTR
                            : ""
                          }`}
                      >
                        <div className={`${styles.subTaskRow}`}
                          key={subIndex}
                          onClick={() => editTaskData(sub)}>
                          <div className={`${styles.mainTaskLeft}`}>
                            <span className={`${styles.taskSubTitle}`}>
                              ↳ {sub.subTaskTitle}
                            </span>
                          </div>
                          <div className={`${styles.mainTaskRight}`}>
                            <span className={getStatusBgClass(subStatus?.name)}>
                              {subStatus?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          // ✅ Show "no task" message if list is empty
          <div className={styles.noTaskCard}>
            <img
              src={images.imgTask}
              className={`${styles.noTask}`}
              title="No task"
              alt="Icon"
            />
            <h4 className={`${styles.noTaskTitle}`}>Today, no task assigned</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTask;
