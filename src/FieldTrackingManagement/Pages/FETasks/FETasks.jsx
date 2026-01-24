import React, { useState } from 'react'
import GlobalStyles from '../../../assets/css/globleStyles.module.css'
import AddTask from '../../Components/FETasks/AddTask';
import style from './FETasks.module.css'
import notFoundImage from '../../../assets/images/userNotFound.png'

const FETasks = () => {
  const [openCanvas, setOpenCanvas] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleOpenModal = () => {
    console.log('open')
    setOpenCanvas(true);
  }

  const handleSaveTask = (taskData) => {
    if(isEdit){
      setTasks((prev) => 
        prev.map((task,index) => 
        index === editIndex
          ? {...task, ...taskData}
          : task
    ))
    }else{
      setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...taskData,
      },
    ])
    }
    setEditIndex(null)
    setIsEdit(false)
  }

  const handleEdit = (index) => {
    const selectedTask = tasks[index];
    setIsEdit(true)
    setEditIndex(index);

    setTaskName(selectedTask.taskName);
    setDescription(selectedTask.description)

    setOpenCanvas(true)
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

        {/* Tasks Table */}
      <div className={style.container}>

        {tasks.length === 0 ? (
          <div className={style.emptyState}>
            <img src={notFoundImage} alt="No tasks" />
            <p className={style.empty}>No tasks added yet</p>
          </div>
        ) : (
          <table className={style.table}>
            <thead>
              <tr>
                <th>S. No</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td className={style.actionCol}>
                    <button className={style.editBtn} onClick={()=> handleEdit(index)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

        {openCanvas && (
          <AddTask
          taskName={taskName}
          setTaskName={setTaskName}
          description={description}
          setDescription={setDescription}
          setOpenCanvas={setOpenCanvas}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setEditIndex={setEditIndex}
          onSave={handleSaveTask}
          />
        )}
    </>
  )
}

export default FETasks
