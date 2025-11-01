import { useState } from "react";
import style from "../../assets/css/Dashboard/LeaveList.module.css";
import moment from "moment";
import { images } from "../../assets/css/imagePath";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { handleDeletePendingLeave } from "../../actions/LeaveRequest/LeaveRequestAction";

const LeaveList = (props) => {
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState();
  const [month, setMonth] = useState('');

  const editLeave = (item) => {
    const isSingle = item.fromDate === item.toDate;
    props.setLeaveId(item.leaveId);
    props.setShowModal(true);
    props.setLeaveType(item.leaveType);
    props.setReason(item.reason);
    props.setFromDate(item.fromDate);
    props.setToDate(item.toDate);
    props.setSingleDay(isSingle ? true : false);
    props.setMultipleDay(isSingle ? false : true);
  };

  const deleteLeave = (leave) => {
    setShow(true);
    props.setLeaveId(leave.leaveId);
    props.setFromDate(leave.fromDate);
    setMonth(leave.month)
  }

  const handleDelete = () => {
    handleDeletePendingLeave(
      props.leaveId,
      props.fromDate,
      setLoader,
      setShow,
      props.leaveData,
      props.setLeaveData,
      month
    )
  }


  return (
    <>
      {props.leaveData.length > 0 ? (
        props.leaveData.map((leave, index) => (
          <div key={index} className={style.leaveCard}>
            <div
              className={style.leaveTypeRow}
            >
              <div className={style.leaveType}>{leave.leaveType || ""}</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {leave.status === "Pending" && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <img
                      src={images.iconEdit}
                      className={style.iconNext}
                      title="Edit"
                      alt="icon"
                      onClick={() => editLeave(leave)}
                    />
                    <img
                      src={images.iconDeleted}
                      className={style.iconNext}
                      title="Delete"
                      alt="icon"
                      onClick={() => deleteLeave(leave)}
                    />
                  </div>
                )}
              </div>

            </div>
            <div className={style.row}>
              <div className={style.formGroup}>
                <span className={style.appliedDate}>
                  {new Date(leave.fromDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                {/* Show 'toDate' only if it's different from 'fromDate' */}
                {leave.toDate && leave.toDate !== leave.fromDate && (
                  <>
                    <span className={style.appliedDate}>&nbsp; - &nbsp;</span>
                    <span className={style.appliedDate}>
                      {new Date(leave.toDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={`${style.leaveTypeRow} ${style.leaveTypeRowTwo}`}>
              <div className={style.formGroup}>
                <label
                  className={`badge-default ${leave.status === "Pending"
                    ? "badge-InReview"
                    : leave.status === "Approved"
                      ? "badge-done"
                      : leave.status === "Rejected"
                        ? "badge-pause"
                        : ""
                    }`}
                >
                  {leave.status}
                </label>
                {leave.rejectedReason && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {leave.rejectedReason || ""}
                  </div>
                )}
              </div>
              <div className={style.formGroup}>
                <p className={style.textMuted} title="Applied Date">
                  <span>Applied date :&nbsp;</span>
                  {new Date(leave.leaveCreateDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* {leave.status !== "Approved" && leave.status !== "Rejected" && (
                <div className={style.formGroup}>
                  <label>
                    <CiEdit
                      style={{ fontSize: "15px", cursor: "pointer" }}
                      onClick={() => editLeave(leave)}
                    />
                  </label>
                </div>
              )} */}
            </div>
            <div className={style.formGroup} style={{ alignItems: "center" }}>
              <label>{leave.remark || ""}</label>
            </div>
            <div className={style.row} style={{ display: "flex", gap: "5px" }}>
              {/* {leave.approvedBy && (
                <div className={style.formGroup}>
                  <span className={style.approvedBy}>
                    Appvd. by - {leave.approvedBy}
                  </span>
                  {leave.approvedDateAndTime && (
                    <span className={style.approvedBy}>
                      &nbsp; (
                      {moment(leave.approvedDateAndTime).format(
                        "DD MMM YYYY HH:mm"
                      )}
                      )
                    </span>
                  )}
                </div>
              )} */}
              {leave.approvedBy && (
                <div className={style.formGroup}>
                  <span className={style.approvedBy}>
                    Appvd. by - {leave.approvedBy}
                    {leave.approvedDateAndTime &&
                      ` (${moment(leave.approvedDateAndTime).format(
                        "DD MMM YYYY HH:mm"
                      )})`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className={style.noData}>
          <img
            src={images.imgHoliday}
            className={style.noHoliday}
            alt=""
            title=""
          />
          <p>No leave requests found.</p>
        </div>
      )}
      <DeleteDialog
        show={show}
        handleClose={() => setShow(false)}
        handleDelete={handleDelete}
        loader={loader}
        title={'Delete leave'}
        message={'Are you sure. You want to delete this leave ?'}
      />
    </>
  );
};

export default LeaveList;
