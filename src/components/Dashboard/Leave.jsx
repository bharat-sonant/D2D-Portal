import { useEffect, useState } from "react";
import style from "../../assets/css/Dashboard/Leave.module.css";
import DialougeBox from "./DialougeBox";
import LeaveList from "./LeaveList";
import { getAllLeaves } from "../../actions/LeaveRequest/LeaveRequestAction";

const Leave = (props) => {
  const [multipleDay, setMultipleDay] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveId, setLeaveId] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <h3 className={style.cardTitle}>Applied leave</h3>
        <button
          className={`${style.btnLeave}`}
          onClick={() => {
            setShowModal(true);
            props.setSingleDay(!leaveId && true);
          }}
          title="Add Leave"
        >
          +
        </button>
      </div>

      <div className={style.cardBody}>
        <LeaveList
          showModal={showModal}
          setShowModal={setShowModal}
          setSingleDay={props.setSingleDay}
          setMultipleDay={setMultipleDay}
          setLeaveType={setLeaveType}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setReason={setReason}
          setLeaveId={setLeaveId}
          leaveData={props.leaveData}
          leaveId={leaveId}
          fromDate={fromDate}
          setLeaveData={props.setLeaveData}
        />
      </div>

      {showModal && (
        <DialougeBox
          onClose={() => setShowModal(false)}
          singleDay={props.singleDay}
          setSingleDay={props.setSingleDay}
          multipleDay={multipleDay}
          setMultipleDay={setMultipleDay}
          leaveType={leaveType}
          setLeaveType={setLeaveType}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          reason={reason}
          setReason={setReason}
          leaveId={leaveId}
          setLeaveId={setLeaveId}
          setTrigger={props.setTrigger}
        />
      )}
    </div>
  );
};

export default Leave;
