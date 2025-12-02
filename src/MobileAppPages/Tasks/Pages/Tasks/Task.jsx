import TaskList from "../../Components/Task/TaskList"
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import TaskStyles from '../../Styles/TaskList/TaskList.module.css';
import AddTask from "../../Components/Task/AddTask";
import { useState } from "react";
import TaskDetails from "../../Components/Task/TaskDetails";

const Task = () => {
    const [showCanvas, setShowCanvas] = useState(false);

    const handleOpenModal = () => {
        setShowCanvas(true);
    }

    return (
        <>
            <div className={`${GlobalStyles.floatingDiv}`}>
                <button
                    className={`${GlobalStyles.floatingBtn}`}
                    onClick={handleOpenModal}
                >
                    +
                </button>
            </div>
            <div className={`${TaskStyles.employeePage}`}>
                <div className={`${TaskStyles.employeeLeft}`}>
                    <TaskList />
                </div>

                <div className={`${TaskStyles.employeeRight}`}>
                    <div className={`row g-0`}>
                        <div className={`col-md-5 ${GlobalStyles.pStart} ${GlobalStyles.pMobile}`}>
                            <TaskDetails />
                        </div>
                    </div>
                </div>
            </div>
            <div className={GlobalStyles.mainSections}>
                <AddTask
                    showCanvas={showCanvas}
                    setShowCanvas={setShowCanvas}
                />
            </div>
        </>
    )
}

export default Task