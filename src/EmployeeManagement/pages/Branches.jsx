import React, { useState, useEffect } from "react";
import styles from "../../pages/Reports/Reports.module.css";
import { Building2, Plus, Edit2, Trash2, MapPin, Loader2, RefreshCw } from "lucide-react";
import AddBranch from "../components/AddBranch";
import { getBranchesAction, deleteBranchAction } from "../../services/BranchService/BranchAction";
import GlobalAlertModal from "../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import Toast from "../../components/Common/GlobalToast/GlobalToast";

const Branches = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [branchToEdit, setBranchToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchBranches = () => {
        getBranchesAction(setBranches, setLoading);
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleDelete = (branch) => {
        setBranchToDelete(branch);
        setShowDeleteModal(true);
    };

    const handleEdit = (branch) => {
        setBranchToEdit(branch);
        setShowAddModal(true);
    };

    const confirmDelete = () => {
        if (!branchToDelete) return;
        setIsDeleting(true);
        deleteBranchAction(
            branchToDelete.id,
            (msg) => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setBranchToDelete(null);
                setToast({ message: msg || "Branch deleted successfully", type: "success" });
                fetchBranches();
            },
            (err) => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setBranchToDelete(null);
                setToast({ message: err || "Failed to delete branch", type: "error" });
            }
        );
    };

    return (
        <div className={styles.reportsContainer}>
            <div className={styles.background}>
                <div className={`${styles.gradientOrb} ${styles.orb1}`} />
                <div className={`${styles.gradientOrb} ${styles.orb2}`} />
                <div className={`${styles.gradientOrb} ${styles.orb3}`} />
                <div className={styles.gridOverlay} />
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: "30px" }}>
                <div style={{ marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2 style={{ fontFamily: "var(--fontGraphikBold)", margin: 0 }}>Branch Management</h2>
                        <p style={{ color: "var(--textMuted)", fontSize: "14px", marginTop: "5px" }}>Manage all company physical locations and codes</p>
                    </div>
                </div>

                <div style={{
                    background: "var(--white)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    overflow: "hidden"
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--borderColor)" }}>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Branch Name</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Code</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Manager</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>City ID</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Address</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)" }}>Status</th>
                                <th style={{ padding: "15px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--textMuted)", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: "40px", textAlign: "center" }}>
                                        <Loader2 className="animate-spin" size={32} style={{ margin: "auto", color: "var(--themeColor)" }} />
                                    </td>
                                </tr>
                            ) : branches.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "var(--textMuted)" }}>
                                        No branches found.
                                    </td>
                                </tr>
                            ) : branches.map((branch) => (
                                <tr key={branch.id} style={{ borderBottom: "1px solid var(--borderColor)" }}>
                                    <td style={{ padding: "15px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{ color: "var(--themeColor)" }}><Building2 size={18} /></div>
                                            <span style={{ fontFamily: "var(--fontGraphikMedium)", fontSize: "14px" }}>{branch.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>
                                        <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>{branch.code}</code>
                                    </td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>
                                        {branch.manager_name || "-"}
                                    </td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px" }}>
                                        {branch.city_id || "-"}
                                    </td>
                                    <td style={{ padding: "15px 20px", fontSize: "14px", color: "var(--textMuted)", maxWidth: "250px" }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                                            <MapPin size={14} style={{ marginTop: "3px", flexShrink: 0 }} />
                                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px", display: "inline-block" }}>
                                                {branch.address}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "15px 20px" }}>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "20px",
                                            background: branch.status ? "#ecfdf5" : "#fef2f2",
                                            color: branch.status ? "#059669" : "#dc2626",
                                            fontSize: "12px",
                                            fontWeight: "500"
                                        }}>
                                            {branch.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "15px 20px", textAlign: "center" }}>
                                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                            <button
                                                onClick={() => handleEdit(branch)}
                                                style={{ border: "none", background: "none", color: "var(--textMuted)", cursor: "pointer" }}
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(branch)}
                                                style={{ border: "none", background: "none", color: "#ff4d4f", cursor: "pointer" }}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => {
                    setBranchToEdit(null);
                    setShowAddModal(true);
                }}
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--gradientTheme)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    zIndex: 1000
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) translateY(0)"}
                title="Add New Branch"
            >
                <Plus size={28} />
            </button>

            <AddBranch
                showCanvas={showAddModal}
                setShowCanvas={setShowAddModal}
                initialData={branchToEdit}
                onRefresh={() => {
                    fetchBranches();
                    setToast({ message: branchToEdit ? "Branch updated successfully" : "Branch created successfully", type: "success" });
                }}
            />

            {showDeleteModal && (
                <GlobalAlertModal
                    show={showDeleteModal}
                    title="Confirm Deletion"
                    message={
                        <>
                            Are you sure you want to delete branch{" "}
                            <strong className={globalAlertStyles.warningName}>
                                {branchToDelete?.name}
                            </strong>
                            ?
                        </>
                    }
                    buttonText="Yes, Delete"
                    buttonGradient="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                    iconType="warning"
                    warningText="This action cannot be undone."
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setBranchToDelete(null);
                    }}
                    onConfirm={confirmDelete}
                />
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Branches;
