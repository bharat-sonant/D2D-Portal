import React, { useState, useEffect } from "react";
import branchStyles from "./Branches.module.css";
import { Building2, Plus, Edit2, Trash2, MapPin, Loader2, RefreshCw, Search, Navigation } from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import AddBranch from "../components/AddBranch";
import BranchMap from "../components/BranchMap";
import { getBranchesAction, deleteBranchAction } from "../../services/BranchService/BranchAction";
import GlobalAlertModal from "../../components/GlobalAlertModal/GlobalAlertModal";
import globalAlertStyles from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import * as common from "../../common/common";

const libraries = ["places"];

const Branches = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyB9KvPlqKdCqq-KJIq0yHfSS8x1Ys18JSM",
        libraries: libraries
    });

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [branchToEdit, setBranchToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [selectedBranch, setSelectedBranch] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [center, setCenter] = useState({ lat: 21.1458, lng: 79.0882 }); // Default to India center or specific default
    const [searchTerm, setSearchTerm] = useState("");

    const filteredBranches = branches.filter(branch =>
        branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchBranches = () => {
        getBranchesAction((data) => {
            setBranches(data);
            if (data.length > 0 && !selectedBranch) {
                // Optionally set initial center to first branch with coords
                const firstWithCoords = data.find(b => b.lat && b.lng);
                if (firstWithCoords) {
                    setCenter({ lat: parseFloat(firstWithCoords.lat), lng: parseFloat(firstWithCoords.lng) });
                }
            }
        }, setLoading);
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

    const handleBranchClick = (branch) => {
        setSelectedBranch(branch.id);
        if (branch.lat && branch.lng) {
            const newCenter = { lat: parseFloat(branch.lat), lng: parseFloat(branch.lng) };
            setCenter(newCenter);
            if (mapRef) {
                mapRef.panTo(newCenter);
                mapRef.setZoom(12);
            }
        }
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
                common.setAlertMessage("success", msg || "Branch deleted successfully");
                fetchBranches();
            },
            (err) => {
                setIsDeleting(false);
                setShowDeleteModal(false);
                setBranchToDelete(null);
                common.setAlertMessage("error", err || "Failed to delete branch");
            }
        );
    };

    return (
        <div className={branchStyles.branchesContainer}>
            {/* Background Decor */}
            <div className={branchStyles.orb} style={{ top: "-100px", right: "-100px", background: "radial-gradient(circle, #667eea 0%, #764ba2 100%)" }} />
            <div className={branchStyles.orb} style={{ bottom: "-100px", left: "-100px", background: "radial-gradient(circle, #ebbba7 0%, #cfc7f8 100%)", animationDelay: "-5s" }} />
            <div className={branchStyles.orb} style={{ top: "30%", left: "40%", width: "300px", height: "300px", background: "radial-gradient(circle, #fff1eb 0%, #ace0f9 100%)", animationDelay: "-10s" }} />

            <div className={branchStyles.headerSection}>
                <div className={branchStyles.headerContent}>
                    <div>
                        <div className={branchStyles.headerTitleWrapper}>
                            <div className={branchStyles.headerIconBox}>
                                <Building2 size={24} />
                            </div>
                            <h2 className={branchStyles.headerTitle}>Branch Network</h2>
                        </div>
                        <p className={branchStyles.headerSubtitle}>
                            Overview and management of your global physical presence
                        </p>
                    </div>

                    <div className={branchStyles.searchActions}>
                        <div className={branchStyles.searchWrapper}>
                            <Search size={18} className={branchStyles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by name, code or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={branchStyles.searchInput}
                            />
                        </div>
                        <button
                            onClick={fetchBranches}
                            className={branchStyles.refreshBtn}
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={branchStyles.mainLayout}>
                <div className={branchStyles.sidebar}>
                    <div className={branchStyles.sidebarHeader}>
                        <span className={branchStyles.sidebarTitle}>
                            Registered Branches ({filteredBranches.length})
                        </span>
                        <div className={branchStyles.activeBadge}>
                            Active
                        </div>
                    </div>

                    <div className={`${branchStyles.branchList} ${branchStyles.customScrollbar}`}>
                        {loading ? (
                            <div style={{ padding: "100px 0", textAlign: "center" }}>
                                <Loader2 className="animate-spin" size={40} style={{ margin: "auto", color: "var(--themeColor)", opacity: 0.5 }} />
                                <p style={{ marginTop: "15px", color: "var(--textMuted)", fontSize: "14px" }}>Securing connection...</p>
                            </div>
                        ) : filteredBranches.length === 0 ? (
                            <div style={{
                                padding: "100px 20px",
                                textAlign: "center",
                                background: "rgba(255,255,255,0.4)",
                                borderRadius: "20px",
                                border: "2px dashed rgba(0,0,0,0.05)"
                            }}>
                                <Building2 size={48} style={{ margin: "0 auto 15px", color: "#cbd5e1" }} />
                                <p style={{ color: "var(--textMuted)", fontSize: "15px" }}>No branches found in your network.</p>
                            </div>
                        ) : filteredBranches.map((branch, index) => (
                            <div
                                key={branch.id}
                                className={`${branchStyles.branchCard} ${selectedBranch === branch.id ? branchStyles.branchCardActive : ""}`}
                                onClick={() => handleBranchClick(branch)}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {selectedBranch === branch.id && (
                                    <div className={branchStyles.activeIndicator} />
                                )}

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div className={branchStyles.cardTopRow}>
                                        <div className={branchStyles.branchInfo}>
                                            <div className={branchStyles.branchIconBox}>
                                                <Building2 size={18} />
                                            </div>
                                            <div className={branchStyles.branchTextDetails}>
                                                <div className={branchStyles.branchName}>{branch.name}</div>
                                                <div className={branchStyles.branchMeta}>
                                                    <Navigation size={11} style={{ color: "var(--themeColor)" }} />
                                                    {branch.lat ? `${parseFloat(branch.lat).toFixed(3)}, ${parseFloat(branch.lng).toFixed(3)}` : "No GPS"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={branchStyles.cardActions}>
                                            <code className={branchStyles.branchCode}>{branch.code}</code>

                                            <div className={branchStyles.actionButtons}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(branch); }}
                                                    className={branchStyles.editBtn}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(branch); }}
                                                    className={branchStyles.deleteBtn}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={branchStyles.addressBox}>
                                        <MapPin size={16} style={{ marginTop: "2px", flexShrink: 0, color: "var(--themeColor)", opacity: 0.6 }} />
                                        <span>{branch.address}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Map */}
                <div className={branchStyles.mapWrapper}>
                    {isLoaded ? (
                        <BranchMap
                            branchData={filteredBranches}
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                            mapRef={mapRef}
                            setMapRef={setMapRef}
                            center={center}
                            setCenter={setCenter}
                        />
                    ) : (
                        <div style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(241, 245, 249, 0.5)",
                            backdropFilter: "blur(10px)"
                        }}>
                            <Loader2 className="animate-spin" size={32} style={{ color: "var(--themeColor)" }} />
                        </div>
                    )}
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => {
                    setBranchToEdit(null);
                    setShowAddModal(true);
                }}
                className={branchStyles.fab}
                title="Add New Branch"
            >
                <Plus size={32} />
            </button>

            {isLoaded && (
                <AddBranch
                    showCanvas={showAddModal}
                    setShowCanvas={setShowAddModal}
                    initialData={branchToEdit}
                    onRefresh={(msg) => {
                        fetchBranches();
                        if (msg) common.setAlertMessage("success", msg);
                    }}
                />
            )}

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

        </div>
    );
};

export default Branches;
