import React, { useEffect, useState } from "react";
import styles from "../../Style/Attendance/AttendanceApprover.module.css";
import { FaChevronRight } from "react-icons/fa";
import { Offcanvas, Modal, Button } from "react-bootstrap";
import ExpenseApproveManagerList from "./ExpenseApproveManagerList";
import { getExpenseApproveManager } from "../../actions/Employee/ExpenseApproveAction";

const ExpenseApproveManager = (props) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [expenseManagerData, setExpenseManagerData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const handleOpenCanvas = () => setShowCanvas(true);
    const handleCloseCanvas = () => setShowCanvas(false);

    useEffect(() => {
        getExpenseApproveManager(setExpenseManagerData, props.selectedPeopledata);
    }, [props.selectedPeopledata]);

    useEffect(() => {
        if (props.selectedPeopledata?.expenseApproval) {
            const selectedEmpCode = props.selectedPeopledata.expenseApproval;
          
            const match = expenseManagerData.find((manager) => manager.empCode === selectedEmpCode);
            setSelectedRow(match ? selectedEmpCode : null);
        } else {
            setSelectedRow(null);
        }
    }, [expenseManagerData, props.selectedPeopledata]);

    return (
        <>
            <div
                className={`${styles.card} ${showCanvas ? styles.activeCard : ""}`}
                onClick={() => {
                    if (expenseManagerData.length === 0) {
                        handleShowModal();
                    } else {
                        handleOpenCanvas();
                    }
                }}
            >
                <span className={styles.text}>Expense Approve Managers</span>
                <FaChevronRight className={styles.icon} />
            </div>

            <Offcanvas show={showCanvas} onHide={handleCloseCanvas} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Expense Approve Managers</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ExpenseApproveManagerList
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        managerData={expenseManagerData}
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
                        <strong>There is no expense approve managers available.</strong>
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

export default ExpenseApproveManager;
