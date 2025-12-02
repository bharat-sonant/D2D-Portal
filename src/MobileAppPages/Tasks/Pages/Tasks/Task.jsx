import TaskList from "../../Components/Task/TaskList"
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import AddTask from "../../Components/Task/AddTask";
import { useState } from "react";

const Task = () => {
    const [showCanvas, setShowCanvas] = useState(false);

    const handleOpenModal = () => {
        setShowCanvas(true);
    }

    return (
        <div>
            <div className={`${GlobalStyles.floatingDiv}`}>
                <button
                    className={`${GlobalStyles.floatingBtn}`}
                    onClick={handleOpenModal}
                >
                    +
                </button>
            </div>
            <TaskList />

            <AddTask
                showCanvas={showCanvas}
                setShowCanvas={setShowCanvas}
            />
        </div>
    )
}

export default Task