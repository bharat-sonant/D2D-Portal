import styles from '../../Styles/Vehicle/Vehicle.module.css';
import GlobalStyles from '../../../../assets/css/globleStyles.module.css';
import VehicleList from '../../Components/Vehicles/VehicleList';

const Vehicle = () => {
    return (
        <>
            {/* {selectedTaskId && (
                <div className={`${GlobalStyles.floatingDiv}`} style={{ bottom: "90px" }}>
                    <button
                        className={`${GlobalStyles.floatingBtn}`}
                        onClick={openOffCanvasModal}
                    >
                        <LucideSettings style={{ position: 'relative', bottom: '3px' }} />
                    </button>
                </div>
            )} */}

            <div className={`${GlobalStyles.floatingDiv}`}>
                <button
                    className={`${GlobalStyles.floatingBtn}`}
                // onClick={handleOpenModal}
                >
                    +
                </button>
            </div>

            <div className={`${styles.employeePage}`}>
                <div className={`${styles.employeeLeft}`}>
                    <VehicleList />
                </div>

                <div className={`${styles.employeeRight}`}>
                    <div className={`row g-0`}>
                        <div className={`col-md-5 ${GlobalStyles.pStart} ${GlobalStyles.pMobile}`}>
                            {/* <TaskDetails
                                selectedTaskId={selectedTaskId}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                                setTaskList={setTaskList}
                                setSelectedTaskId={setSelectedTaskId}
                                getHistory={getHistory}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className={GlobalStyles.mainSections}>
                {/* <AddTask
                    showCanvas={showCanvas}
                    setShowCanvas={setShowCanvas}
                    setTaskList={setTaskList}
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    taskId={taskId}
                    setTaskId={setTaskId}
                    setSelectedTask={setSelectedTask}
                    getHistory={getHistory}
                /> */}
            </div>
            {/* <HistoryData
                openCanvas={openCanvas}
                onHide={onHideCanvas}
                taskHistory={taskHistory}
                onEditClick={handleClickEdit}
                handleDelete={handleDelete}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                setTaskList={setTaskList}
                setSelectedTaskId={setSelectedTaskId}
                getHistory={getHistory}

            /> */}

            {/* <DeleteConfirmation
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={selectedTask?.name || "this task"}
            /> */}
        </>
    )
}

export default Vehicle