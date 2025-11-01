import React, { useEffect, useState } from "react";
import styles from "../../Style/Attendance/AttendanceApprover.module.css";
import { FaChevronRight } from "react-icons/fa";
import { Offcanvas, Modal, Button } from "react-bootstrap";
import { getExpenseReimburseManager } from "../../actions/Employee/ExpenseApproveAction";
import ReimburseManagerList from "./ReimburseManagerList";

const ReimburseManager = (props) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [expenseReimburseManagerData, setExpenseReimburseManagerData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const handleOpenCanvas = () => setShowCanvas(true);
    const handleCloseCanvas = () => setShowCanvas(false);

    useEffect(() => {
        getExpenseReimburseManager(setExpenseReimburseManagerData, props.selectedPeopledata);
    }, [props.selectedPeopledata]);

    useEffect(() => {
        const selectedEmpCodes = props.selectedPeopledata?.expenseReimburse;

        if (selectedEmpCodes && Array.isArray(selectedEmpCodes)) {
            const validCodes = expenseReimburseManagerData
                .map(manager => manager.empCode)
                .filter(code => selectedEmpCodes.includes(code));

            setSelectedRow(validCodes);
        } else if (selectedEmpCodes) {
            const match = expenseReimburseManagerData.find(manager => manager.empCode === selectedEmpCodes);
            setSelectedRow(match ? [selectedEmpCodes] : []);
        } else {
            setSelectedRow([]);
        }
    }, [expenseReimburseManagerData, props.selectedPeopledata]);


    return (
        <>
            <div
                className={`${styles.card} ${showCanvas ? styles.activeCard : ""}`}
                onClick={() => {
                    if (expenseReimburseManagerData.length === 0) {
                        handleShowModal();
                    } else {
                        handleOpenCanvas();
                    }
                }}
            >
                <span className={styles.text}>Expense Reimburse Managers</span>
                <FaChevronRight className={styles.icon} />
            </div>

            <Offcanvas show={showCanvas} onHide={handleCloseCanvas} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Expense Reimburse Managers</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ReimburseManagerList
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        managerData={expenseReimburseManagerData}
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

export default ReimburseManager;
