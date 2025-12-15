import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { supabase } from '../../createClient';
import style from '../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css';
import { Edit2, History, Trash2, Info, User, Calendar } from 'lucide-react';
import { images } from '../../assets/css/imagePath';
import dayjs from 'dayjs';
import DeleteConfirmation from '../../MobileAppPages/Tasks/Components/DeleteConfirmation/DeleteConfirmation';
import { setAlertMessage } from '../../common/common';

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
  const [toggle, setToggle] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [handleOpenDelete, setHandleOpenDelete] = useState(false);

  useEffect(() => {
    setToggle(selectedTask?.status === 'active');
    setHistoryVisible(false);
    setHistoryData([]);
  }, [selectedTask]);

  const tryParse = (v) => {
    if (!v) return v;
    try { return JSON.parse(v); } catch { return v; }
  };

  const saveHistory = async ({ task, action, oldValue = null, newValue = null }) => {
    if (!task) return null;
    try {
      const payload = {
        created_by: 'Ansh',
        created_at: new Date().toISOString(),
        oldvalue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        uniqueId: task.uniqueId,
        action
      };
      const { data, error } = await supabase.from('TaskHistory').insert([payload]);
      if (error) console.error('Failed to save history:', error);
      return data;
    } catch (err) {
      console.error('Unexpected error saving history:', err);
      return null;
    }
  };

  const handleEditClick = () => {
    if (!selectedTask) return alert('No task selected.');
    setTaskTitle(selectedTask.taskName);
    setOpenCanvas(false);
    setShowCanvas(true);
    setIsEditing(true);
  };

  const handleDeleteClick = () => setHandleOpenDelete(true);

  const ConfirmDelete = async () => {
    try {
      await saveHistory({ task: selectedTask, action: 'delete', oldValue: { taskName: selectedTask.taskName, status: selectedTask.status }, newValue: null });
      if (handleDelete) await handleDelete(selectedTask);
      setHandleOpenDelete(false);
      setAlertMessage('success', "Task data deleted successfully")
      refreshTasks();
      onHide();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task: ' + err.message);
    }
  };

  const handleToggle = async () => {
    if (!selectedTask) return;
    const newState = toggle ? 'inactive' : 'active';
    try {
      await supabase.from('TaskData').update({ status: newState }).eq('id', selectedTask.id);
      await saveHistory({ task: selectedTask, action: 'toggle-status', oldValue: { status: toggle ? 'Active' : 'Inactive' }, newValue: { status: newState } });
      setToggle(!toggle);
      refreshTasks();
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to change status: ' + err.message);
    }
  };

  const getTaskHistory = async () => {
    if (!selectedTask) return;
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase.from('TaskHistory').select('*').eq('uniqueId', selectedTask.uniqueId).order('created_at', { ascending: false });
      if (error) throw error;
      setHistoryData(data || []);
      setHistoryVisible(true);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch history: ' + err.message);
    } finally { setLoadingHistory(false); }
  };

  return (
    <>
      <Offcanvas placement="end" show={openCanvas} onHide={onHide} className={style.responsiveOffcanvas} style={{ width: '45%' }}>
        <div className={style.canvas_container}>
          <div className={style.OffcanvasHeader}>
            <h4 className={style.header_title}>Task Data Settings</h4>
          </div>

          <div className={style.scroll_section}>
            <div className={style.canvas_header_end}>
              <img src={images.iconClose} className={style.close_popup} onClick={onHide} alt="Close" />
            </div>

            <div className={style.taskControlCard}>
              <div className={style.controlRow}>
                <h3 className={style.taskName}>{selectedTask?.taskName || 'N/A'}</h3>
                <div className={style.actionButtons}>
                  <History size={18} onClick={getTaskHistory} className={style.historyIcon} />
                  <button className={style.editButton} onClick={handleEditClick}><Edit2 size={18} /></button>
                  <button className={style.deleteButton} onClick={handleDeleteClick}><Trash2 size={18} /></button>
                </div>
                <div className={style.statusSection}>
                  <label className={style.toggleSwitch}>
                    <input type="checkbox" checked={toggle} onChange={handleToggle} />
                    <span className={style.toggleSlider}></span>
                  </label>
                  <span className={`${style.statusText} ${toggle ? style.active : style.inactive}`}>{toggle ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              {historyVisible ? (
                <div className={style.historyScroll}>
                  {loadingHistory ? <p style={{ textAlign: 'center' }}>Loading history...</p> :
                    historyData.length > 0 ? (
                      historyData.map((h, idx) => {
                        const oldV = tryParse(h.oldvalue);
                        const newV = tryParse(h.newValue);
                        const oldStr = oldV?.taskName ?? oldV ?? '—';
                        const newStr = newV?.taskName ?? newV ?? '—';
                        return (
                          <div key={idx} className={style.historyCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div className={style.historyTitle}>{h.action}</div>
                              <div className={style.metaRow}>
                                <User size={16} /><span>{h.created_by || 'N/A'}</span>
                                <Calendar size={16} /><span>[{h.created_at ? dayjs(h.created_at).format('DD MMM, YYYY hh:mm A') : 'N/A'}]</span>
                              </div>
                            </div>
                            <div style={{ marginTop: 8, color: '#555', fontSize: 13 }}><strong>{oldStr} → {newStr}</strong></div>
                          </div>
                        );
                      })
                    ) : <p style={{ color: '#777', textAlign: 'center' }}>No history found.</p>
                  }
                </div>
              ) : (
                <div className={style.infoBox}>
                  <Info size={18} />
                  <p className={style.infoText}>Click on the history icon above to view task data history.</p>
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
        itemName={selectedTask?.taskName || 'this task'}
      />
    </>
  );
};

export default TaskDataSettings;
