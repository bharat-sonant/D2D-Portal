
import React, { useEffect, useState } from "react";
import styles from "../../Style/Attendance/AttendanceApprover.module.css";
import { FaChevronRight } from "react-icons/fa";
import { Offcanvas, Modal, Button } from "react-bootstrap";
import { getExpenseReviewer } from "../../actions/Employee/ExpenseApproveAction";
import ExpenseReviewersList from "./ExpenseReviewersList";

const ExpenseReviewers = (props) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [expenseReviewerData, setExpenseReviewerData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const handleOpenCanvas = () => setShowCanvas(true);
    const handleCloseCanvas = () => setShowCanvas(false);

    useEffect(() => {
        if(props.selectedPeopledata){
            getExpenseReviewer(setExpenseReviewerData, props.selectedPeopledata);
        }
    }, [props.selectedPeopledata]);

    useEffect(() => {
        if (props.selectedPeopledata?.expenseReviewer) {
            const selectedEmpCode = props.selectedPeopledata?.expenseReviewer;
            const match = expenseReviewerData.find((manager) => manager.empCode === selectedEmpCode);
            setSelectedRow(match ? selectedEmpCode : null);
        } else {
            setSelectedRow(null);
        }
    }, [expenseReviewerData, props.selectedPeopledata]);

    return (
        <>
            <div
                className={`${styles.card} ${showCanvas ? styles.activeCard : ""}`}
                onClick={() => {
                    if (expenseReviewerData.length === 0) {
                        handleShowModal();
                    } else {
                        handleOpenCanvas();
                    }
                }}
            >
                <span className={styles.text}>Expense Reviewer</span>
                <FaChevronRight className={styles.icon} />
            </div>

            <Offcanvas show={showCanvas} onHide={handleCloseCanvas} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Expense Reviewer</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ExpenseReviewersList
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        reviewerData={expenseReviewerData}
                        selectedPeopledata={props.selectedPeopledata}
                    />
                </Offcanvas.Body>
            </Offcanvas>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>No Reviewer Found</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="fs-5">
                        <strong>There is no expense reviewer available.</strong>
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

export default ExpenseReviewers;
