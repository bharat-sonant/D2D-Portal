import React, { useState, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import style from "../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css";
import { Edit2, History, Trash2, Info, User } from "lucide-react";
import { images } from "../../assets/css/imagePath";
import DeleteConfirmation from "../../MobileAppPages/Tasks/Components/DeleteConfirmation/DeleteConfirmation";
import { setAlertMessage } from "../../common/common";
import * as TaskAction from "../../Actions/TaskAction/TaskAction";
import dayjs from "dayjs";

const TaskDataSettings = ({
  openCanvas,
  onHide,
  selectedTask,
  refreshTasks,
  handleDelete,
  setShowCanvas,
  setOpenCanvas,
  taskTitle,
  setTaskTitle,
  isEditing,
  setIsEditing
}) => {
  const [toggle, setToggle] = useState(selectedTask?.status === "active" || false);
  const [handleOpenDelete, setHandleOpenDelete] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [taskHistory, setTaskHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    setToggle(selectedTask?.status === "active");
    setHistoryVisible(false);
    setTaskHistory([]);
  }, [selectedTask]);

  /* ================= EDIT ================= */

  const handleEditClick = () => {
    if (!selectedTask) return;
    setTaskTitle(selectedTask.taskName);
    setOpenCanvas(false);
    setShowCanvas(true);
    setIsEditing(true);
  };

  /* ================= DELETE ================= */

  const handleDeleteClick = () => setHandleOpenDelete(true);

  const ConfirmDelete = async () => {
    try {
      if (handleDelete) await handleDelete(selectedTask);
      setHandleOpenDelete(false);
      setAlertMessage("success", "Task data deleted successfully");
      refreshTasks();
      onHide();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  /* ================= STATUS TOGGLE ================= */

  const handleToggle = () => {
    if (!selectedTask) return;

    TaskAction.toggleTaskStatus(
      selectedTask,
      toggle,
      refreshTasks,
      setToggle
    );
  };

  /* ================= HISTORY ================= */

  const handleHistoryClick = () => {
    if (!selectedTask) return;

    setHistoryVisible(!historyVisible);

    if (!historyVisible) {
      TaskAction.fetchTaskHistory(
        selectedTask.uniqueId,
        setTaskHistory,
        setLoadingHistory
      );
    }
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <>
      <Offcanvas
        placement="end"
        show={openCanvas}
        onHide={onHide}
        className={style.responsiveOffcanvas}
        style={{ width: "45%" }}
      >
        <div className={style.canvas_container}>
          <div className={style.OffcanvasHeader}>
            <h4 className={style.header_title}>Task Data Settings</h4>
          </div>

          <div className={style.scroll_section}>
            <div className={style.canvas_header_end}>
              <img
                src={images.iconClose}
                className={style.close_popup}
                onClick={onHide}
                alt="Close"
              />
            </div>

            <div className={style.taskControlCard}>
              <div className={style.controlRow}>
                <h3 className={style.taskName}>
                  {selectedTask?.taskName || "N/A"}
                </h3>

                <div className={style.actionButtons}>
                  <History
                    size={18}
                    onClick={handleHistoryClick}
                    className={style.historyIcon}
                  />
                  <button
                    className={style.editButton}
                    onClick={handleEditClick}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className={style.deleteButton}
                    onClick={handleDeleteClick}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className={style.statusSection}>
                  <label className={style.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={toggle}
                      onChange={handleToggle}
                    />
                    <span className={style.toggleSlider}></span>
                  </label>
                  <span
                    className={`${style.statusText} ${
                      toggle ? style.active : style.inactive
                    }`}
                  >
                    {toggle ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              {historyVisible ? (
                <div className={style.historyScroll}>
                  {loadingHistory ? (
                    <p style={{ textAlign: "center" }}>Loading history...</p>
                  ) : taskHistory.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#777" }}>
                      No history found.
                    </p>
                  ) : (
                    <div className={style.timeline}>
                      {taskHistory.map((item) => (
                        <div key={item.id} className={style.timelineItem}>
                          <div className={style.timelineMarker}></div>
                          <div className={style.timelineContent}>
                            <div className={style.timelineHeader}>
                              <span className={style.timelineAction}>
                                {item.action}
                              </span>
                              <span className={style.timelineTime}>
                                {dayjs(item.created_at).format(
                                  "DD MMM, YYYY hh:mm A"
                                )}
                              </span>
                            </div>
                            <div className={style.timelineBody}>
                              {item.oldvalue && (
                                <p>
                                  <strong>Old Value:</strong> {item.oldvalue}
                                </p>
                              )}
                              <p>
                                <strong>New Value:</strong> {item.newValue}
                              </p>
                              {item.status && (
                                <p>
                                  <strong>Status:</strong> {item.status}
                                </p>
                              )}
                              <p className={style.timelineBy}>
                                <User size={14} /> {item.created_by}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className={style.infoBox}>
                  <Info size={18} />
                  <p className={style.infoText}>
                    Click on the history icon above to view task data history.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Offcanvas>

      <DeleteConfirmation
        isOpen={handleOpenDelete}
        onClose={() => setHandleOpenDelete(false)}
        onConfirm={ConfirmDelete}
        itemName={selectedTask?.taskName || "this task"}
      />
    </>
  );
};

export default TaskDataSettings;
