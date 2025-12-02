import TaskList from "../../Components/Task/TaskList"
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import TaskStyles from '../../Styles/TaskList/TaskList.module.css';
import AddTask from "../../Components/Task/AddTask";
import { useEffect, useState } from "react";
import TaskDetails from "../../Components/Task/TaskDetails";
import * as firebaseService from '../../../../firebase/firebaseService';
import * as dbConfig from '../../../../configurations/cityDBConfig';

const Task = () => {
    const [showCanvas, setShowCanvas] = useState(false);
    const city = localStorage.getItem('city') || "DevTest";

    useEffect(() => {
        const config = dbConfig.getCityFirebaseConfig(city);
        firebaseService.connectFirebase(config, city);
    }, []);

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