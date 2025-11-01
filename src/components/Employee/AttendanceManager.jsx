import React, { useEffect, useState } from "react";
import styles from "../../Style/Attendance/AttendanceApprover.module.css";
import { FaChevronRight } from "react-icons/fa";
import ManagersList from "./ManagersList";
import { Offcanvas, Modal, Button } from "react-bootstrap";
import { getManagersList } from "../../actions/Employee/AttendanceApproverAction";

const AttendanceManager = (props) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [managerData, setManagerData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleOpenCanvas = () => setShowCanvas(true);
  const handleCloseCanvas = () => setShowCanvas(false);

  useEffect(() => {
    getManagersList(setManagerData, props.selectedPeopledata);
  }, [props.selectedPeopledata]);

  useEffect(() => {
    if (props.selectedPeopledata?.attendanceApprover) {
      const selectedEmpCode = props.selectedPeopledata.attendanceApprover;
      const match = managerData.find((manager) => manager.empCode === selectedEmpCode);
      setSelectedRow(match ? selectedEmpCode : null);
    } else {
      setSelectedRow(null);
    }
  }, [managerData, props.selectedPeopledata]);

  return (
    <>
      <div
        className={`${styles.card} ${showCanvas ? styles.activeCard : ""}`}
        onClick={() => {
          if (managerData.length === 0) {
            handleShowModal();
          } else {
            handleOpenCanvas();
          }
        }}
      >
        <span className={styles.text}>Attendance Approver Managers</span>
        <FaChevronRight className={styles.icon} />
      </div>

      <Offcanvas show={showCanvas} onHide={handleCloseCanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Attendance Approver Managers</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ManagersList
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            managerData={managerData}
            selectedPeopledata={props.selectedPeopledata}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>No Manager Found</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="fs-5">
            <strong>There is no attendance manager available.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttendanceManager;
