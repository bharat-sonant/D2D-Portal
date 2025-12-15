import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import style from '../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css';
import { Edit2, History, Trash2, Info, User, Calendar } from 'lucide-react';
import { images } from '../../assets/css/imagePath';
import { supabase } from '../../createClient';
import dayjs from 'dayjs';
import DeleteConfirmation from '../../MobileAppPages/Tasks/Components/DeleteConfirmation/DeleteConfirmation';

const TaskDataSettings = ({ openCanvas, onHide, selectedTask, refreshTasks, handleDelete, setShowCanvas, setOpenCanvas, setTaskTitle, taskTitle, setTask, task }) => {
  const [toggle, setToggle] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [handleOpenDelete, setHandleOpenDelete] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setToggle(selectedTask?.status === 'active' || selectedTask?.status === 'Active' || false);
    setHistoryVisible(false);
    setHistoryData([]);
  }, [selectedTask]);

  // ===== Save history to TaskHistory table (Option 2) =====
  const saveHistory = async ({ task, action, oldValue = null, newValue = null }) => {
    if (!task) return null;

    const payload = {
      created_by: 'Ansh',
      created_at: new Date().toISOString(),
      oldvalue: oldValue ? JSON.stringify(oldValue) : null,
      newValue: newValue ? JSON.stringify(newValue) : null,
      uniqueId: task.uniqueId || null,
      action
    };

    try {
      const { data, error } = await supabase.from('TaskHistory').insert([payload]);
      if (error) {
        console.error('Failed to save history:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Unexpected error saving history:', err);
      return null;
    }
  };

  // ===== Edit Task =====
  const handleEditClick = () => {
    if (!selectedTask) return alert('No task selected.');

    setTaskTitle(selectedTask.taskName); // input me value set
    setOpenCanvas(false);
    setShowCanvas(true);
    setTask(true); // edit form open
  };

  // ===== Delete Task =====
  const handleDeleteClick = async () => {
    setHandleOpenDelete(true);
    setOpenCanvas(false);

  };

  const ConfirmDelete = async () => {
    try {
      // Save history before deletion
      await saveHistory({
        task: selectedTask,
        action: 'delete',
        oldValue: { taskName: selectedTask.taskName, status: selectedTask.status },
        newValue: null
      });

      if (typeof handleDelete === 'function') {
        await handleDelete(selectedTask);
      } else {
        const { error } = await supabase.from('TaskData').delete().eq('id', selectedTask.id);
        if (error) throw error;
      }
      setHandleOpenDelete(false);
      if (typeof refreshTasks === 'function') await refreshTasks();
      onHide();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task: ' + err.message);
    }
  }

  // ===== Toggle Status =====
  const handleToggle = async () => {
    if (!selectedTask) return;

    const oldState = toggle ? 'Active' : 'Inactive';
    const newState = !toggle ? 'Active' : 'Inactive';

    try {
      const { error } = await supabase
        .from('TaskData')
        .update({ status: newState.toLowerCase() })
        .eq('id', selectedTask.id);
      if (error) throw error;

      await saveHistory({
        task: selectedTask,
        action: 'toggle-status',
        oldValue: { status: oldState },
        newValue: { status: newState }
      });

      setToggle(!toggle);
      if (typeof refreshTasks === 'function') await refreshTasks();
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to change status: ' + err.message);
    }
  };

  // ===== Get History =====
  const getTaskHistory = async () => {
    if (!selectedTask) return;
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('TaskHistory')
        .select('*')
        .eq('uniqueId', selectedTask.uniqueId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistoryData(data || []);
      setHistoryVisible(true);
    } catch (err) {
      console.error('Error fetching history:', err);
      alert('Failed to fetch history: ' + err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const tryParse = (v) => {
    if (!v) return v;
    if (typeof v !== 'string') return v;
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  };

  return (
    <>
      <Offcanvas
        placement="end"
        show={openCanvas}
        onHide={() => onHide()}
        className={style.responsiveOffcanvas}
        style={{ width: '45%' }}
      >
        <div className={style.canvas_container} style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                  <div className={style.sectionTitle}>
                    <span title="History Icon">
                      <History size={18} onClick={getTaskHistory} className={style.historyIcon} />
                    </span>
                  </div>

                  <button className={style.editButton} onClick={handleEditClick} title="Edit Task">
                    <Edit2 size={18} />
                  </button>

                  <button className={style.deleteButton} onClick={handleDeleteClick} title="Delete Task">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className={style.statusSection}>
                  <div className={style.toggleContainer}>
                    <label className={style.toggleSwitch}>
                      <input type="checkbox" checked={toggle} onChange={handleToggle} />
                      <span className={style.toggleSlider}></span>
                    </label>
                    <span className={`${style.statusText} ${toggle ? style.active : style.inactive}`}>
                      {toggle ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* History area */}
            <div style={{ marginTop: 16 }}>
              {historyVisible ? (
                <div className={style.historyScroll}>
                  {loadingHistory ? (
                    <p style={{ textAlign: 'center' }}>Loading history...</p>
                  ) : historyData.length > 0 ? (
                    historyData.map((h, idx) => {
                      const oldV = tryParse(h.oldvalue);
                      const newV = tryParse(h.newValue);
                      return (
                        <div key={idx} className={style.historyCard}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div className={style.historyTitle}>{h.action}</div>
                            <div className={style.metaRow}>
                              <User size={16} />
                              <span style={{ fontFamily: 'sans-serif', fontWeight: '500', fontSize: '12px', marginLeft: 6 }}>{h.created_by || 'N/A'}</span>
                              <Calendar size={16} style={{ marginLeft: 10 }} />
                              <span style={{ fontFamily: 'sans-serif', fontWeight: '500', fontSize: '12px', marginLeft: 6 }}>
                                [{h.created_at ? dayjs(h.created_at).format('DD MMM, YYYY hh:mm A') : 'N/A'}]
                              </span>
                            </div>
                          </div>
                          <div style={{ marginTop: 8, color: '#555', fontSize: 13 }}>
                            {(() => {
                              const oldV = tryParse(h.oldvalue);
                              const newV = tryParse(h.newValue);

                              // Extract the actual value if it's an object with taskName
                              const oldStr = oldV && typeof oldV === 'object' && oldV.taskName ? oldV.taskName : oldV ?? '—';
                              const newStr = newV && typeof newV === 'object' && newV.taskName ? newV.taskName : newV ?? '—';

                              return <div><strong>{oldStr} → {newStr}</strong></div>;
                            })()}
                          </div>
                        </div>
                      );
                    })
                  ) : <p style={{ color: '#777', textAlign: 'center' }}>No history found.</p>}
                </div>
              ) : (
                <div className={style.infoBox}>
                  <div className={style.infoIconWrapper}><Info size={18} /></div>
                  <div><p className={style.infoText}>Click on the history icon above to view task data history.</p></div>
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
