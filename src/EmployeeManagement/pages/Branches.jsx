import React, { useState, useEffect } from "react";
import branchStyles from "./Branches.module.css";
import {
    Building2, Plus, Edit2, Trash2, MapPin, Loader2,
    RefreshCw, Search, Navigation, ChevronRight,
    ChevronLeft, Users, User, ArrowRight, Car,
    UserCheck, UserPlus, Info
} from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import AddBranch from "../components/AddBranch";
import BranchMap from "../components/BranchMap";
import { getBranchesAction, deleteBranchAction } from "../../services/BranchService/BranchAction";
import { getAllWards } from "../../services/WardsServices/WardsService";
import { getVehicleData } from "../../services/VehicleServices/VehicleServices";
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
    const [wards, setWards] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [branchToEdit, setBranchToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [selectedWardId, setSelectedWardId] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [center, setCenter] = useState({ lat: 26.9124, lng: 75.7873 }); // Jaipur Default
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTab, setFilterTab] = useState("All");

    const STATIC_BRANCHES = [
        { id: 'sb1', name: 'Jaipur Center', code: 'JPR-001', address: 'Malviya Nagar, Jaipur', lat: 26.8549, lng: 75.8243 },
        { id: 'sb2', name: 'North Chirawa', code: 'CHW-015', address: 'Station Road, Chirawa', lat: 28.2427, lng: 75.6420 },
        { id: 'sb3', name: 'Sikar Hub', code: 'SKR-042', address: 'Nawalgarh Road, Sikar', lat: 27.6094, lng: 75.1398 },
    ];

    const STATIC_WARDS = [
        { id: 'sw1', ward_id: '101', branch_id: 'sb1', branch: 'Jaipur Center' },
        { id: 'sw2', ward_id: '102', branch_id: 'sb1', branch: 'Jaipur Center' },
        { id: 'sw3', ward_id: '201', branch_id: 'sb2', branch: 'North Chirawa' },
        { id: 'sw4', ward_id: '301', branch_id: 'sb3', branch: 'Sikar Hub' },
    ];

    const STATIC_VEHICLES = [
        { id: 'v1', vehicles_No: 'RJ14 TR 1234', type: 'Truck', assigned_to: 'Anand' },
        { id: 'v2', vehicles_No: 'RJ14 TR 5678', type: 'Pickup', assigned_to: 'Panchu' },
        { id: 'v3', vehicles_No: 'RJ14 TR 9012', type: 'Truck', assigned_to: 'Vikram' },
    ];

    const fetchBranches = () => {
        getBranchesAction((data) => {
            setBranches([...STATIC_BRANCHES, ...data]);
            if (data.length > 0 && !selectedBranchId) {
                // Optionally auto-select first
            }
        }, setLoading);
    };

    const fetchWards = async () => {
        const response = await getAllWards();
        if (response.status === "success") {
            setWards([...STATIC_WARDS, ...(response.data || [])]);
        } else {
            setWards(STATIC_WARDS);
        }
    };

    const fetchVehicles = async () => {
        const response = await getVehicleData();
        if (response.status === "success") {
            setVehicles([...STATIC_VEHICLES, ...(response.data || [])]);
        } else {
            setVehicles(STATIC_VEHICLES);
        }
    };

    useEffect(() => {
        fetchBranches();
        fetchWards();
        fetchVehicles();
    }, []);


    const selectedBranch = branches.find(b => b && b.id === selectedBranchId);

    // Filter wards based on selected branch
    // Note: We'll match ward.branch_id or ward.branch with selectedBranchId or selectedBranch.name
    const branchWards = wards.filter(w =>
        w && ((w.branch_id === selectedBranchId) ||
            (w.branch?.toLowerCase() === selectedBranch?.name?.toLowerCase()))
    );

    const handleWardClick = (ward) => {
        setSelectedWardId(ward.ward_id || ward.id);
        // Find the branch this ward belongs to for centering
        const wardBranch = branches.find(b =>
            b && (b.id === ward.branch_id || b.name?.toLowerCase() === ward.branch?.toLowerCase())
        );
        if (wardBranch && wardBranch.lat && wardBranch.lng) {
            setCenter({ lat: parseFloat(wardBranch.lat), lng: parseFloat(wardBranch.lng) });
        }
    };

    const selectedWard = wards.find(w => w && (w.id === selectedWardId || w.ward_id === selectedWardId));

    const filteredBranches = branches.filter(branch => {
        if (!branch) return false;
        const matchesSearch = branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.code?.toLowerCase().includes(searchTerm.toLowerCase());
        if (filterTab === "All") return matchesSearch;
        // Logic for Active/Closed could go here if status exists
        return matchesSearch;
    });

    const handleDelete = (branch) => {
        setBranchToDelete(branch);
        setShowDeleteModal(true);
    };

    const handleEdit = (branch) => {
        setBranchToEdit(branch);
        setShowAddModal(true);
    };

    const handleBranchClick = (branch) => {
        setSelectedBranchId(branch.id);
        setSelectedWardId(null); // Reset ward drilldown
        if (branch.lat && branch.lng) {
            setCenter({ lat: parseFloat(branch.lat), lng: parseFloat(branch.lng) });
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

            {/* Header Content */}
            <div className={branchStyles.headerSection}>
                <div className={branchStyles.breadcrumb}>
                    <span className={branchStyles.breadcrumbItem} onClick={() => { setSelectedBranchId(null); setSelectedWardId(null); }}>Employee Management</span>
                    <ChevronRight size={14} />
                    <span className={branchStyles.breadcrumbItem} onClick={() => setSelectedWardId(null)}>Branch Network</span>
                    {selectedBranch && (
                        <>
                            <ChevronRight size={14} />
                            <span className={branchStyles.breadcrumbItem} onClick={() => setSelectedWardId(null)}>{selectedBranch.name}</span>
                        </>
                    )}
                    {selectedWard && (
                        <>
                            <ChevronRight size={14} />
                            <span style={{ color: '#4f46e5', fontWeight: '600' }}>Ward {selectedWard.ward_id || selectedWard.id}</span>
                        </>
                    )}
                </div>

                <div className={branchStyles.headerTitleBox}>
                    <div>
                        <h2 className={branchStyles.branchTitle} style={{ fontSize: '24px', textAlign: 'left' }}>
                            {selectedWard ? `Ward ${selectedWard.ward_id || selectedWard.id}` : selectedBranch ? selectedBranch.name : "Branch Network"}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {selectedWard && (
                            <button className={branchStyles.actionBtn} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setSelectedWardId(null)}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '4px 12px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>AL</div>
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>Ansh Lahari</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={branchStyles.mainLayout}>

                {/* Level 1: Sidebar Branch List */}
                <div className={branchStyles.sidebar}>
                    <div className={branchStyles.sidebarHeader}>
                        <div className={branchStyles.searchWrapper}>
                            <Search size={16} className={branchStyles.searchIcon} />
                            <input
                                className={branchStyles.searchInput}
                                placeholder="Search branches..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={branchStyles.filterTabs}>
                            {["All", "Active", "Closed"].map(t => (
                                <div
                                    key={t}
                                    className={`${branchStyles.tab} ${filterTab === t ? branchStyles.tabActive : ""}`}
                                    onClick={() => setFilterTab(t)}
                                >{t}</div>
                            ))}
                        </div>
                    </div>

                    <div className={`${branchStyles.branchList} ${branchStyles.customScrollbar}`}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', padding: '10px 10px 5px' }}>REGISTERED BRANCHES ({filteredBranches.length})</div>

                        {loading ? (
                            <div style={{ padding: '40px 0', textAlign: 'center', opacity: 0.5 }}>
                                <Loader2 className="animate-spin" size={24} style={{ margin: 'auto' }} />
                                <div style={{ marginTop: '10px', fontSize: '12px' }}>Loading branches...</div>
                            </div>
                        ) : filteredBranches.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                No branches found.
                            </div>
                        ) : (
                            filteredBranches.map(branch => (
                                <div
                                    key={branch.id}
                                    className={`${branchStyles.branchCard} ${selectedBranchId === branch.id ? branchStyles.branchCardActive : ""}`}
                                    onClick={() => handleBranchClick(branch)}
                                >
                                    <div className={branchStyles.branchIcon}>
                                        <Building2 size={18} />
                                    </div>
                                    <div className={branchStyles.branchInfo}>
                                        <div className={branchStyles.branchName}>{branch.name}</div>
                                        <div className={branchStyles.branchCode}>{branch.code}</div>
                                    </div>
                                    <ChevronRight size={14} color="#94a3b8" />
                                </div>
                            ))
                        )}
                    </div>

                    <button className={branchStyles.fab} onClick={() => { setBranchToEdit(null); setShowAddModal(true); }}>
                        <Plus size={20} /> Add Branch
                    </button>
                </div>

                {/* Level 2: Branch Info & Ward List (Hidden if Ward selected on mobile, but here 3 columns for desktop) */}
                <div className={branchStyles.detailsColumn}>
                    {selectedBranch ? (
                        <>
                            <div className={branchStyles.card}>
                                <div className={branchStyles.branchHero}>
                                    <div className={branchStyles.branchBigIcon}><Building2 size={32} /></div>
                                    <div className={branchStyles.branchTitle}>{selectedBranch.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <MapPin size={12} /> {selectedBranch.address}
                                    </div>
                                </div>

                                <div className={branchStyles.managerCard}>
                                    <img src="https://ui-avatars.com/api/?name=David+Shukla&background=4f46e5&color=fff" className={branchStyles.managerAvatar} alt="Manager" />
                                    <div className={branchStyles.managerInfo}>
                                        <div className={branchStyles.managerName}>David Shukla</div>
                                        <div className={branchStyles.managerRole}>Branch Manager</div>
                                    </div>
                                    <Info size={16} style={{ color: '#94a3b8' }} />
                                </div>

                                <div className={branchStyles.statsGrid} style={{ marginTop: '20px' }}>
                                    <div className={branchStyles.statItem} style={{ background: '#e0f2fe' }}>
                                        <span className={branchStyles.statVal} style={{ color: '#0369a1' }}>62</span>
                                        <span className={branchStyles.statLab} style={{ color: '#0369a1' }}>Total Emp</span>
                                    </div>
                                    <div className={branchStyles.statItem} style={{ background: '#dcfce7' }}>
                                        <span className={branchStyles.statVal} style={{ color: '#15803d' }}>57</span>
                                        <span className={branchStyles.statLab} style={{ color: '#15803d' }}>Active</span>
                                    </div>
                                    <div className={branchStyles.statItem} style={{ background: '#fef3c7' }}>
                                        <span className={branchStyles.statVal} style={{ color: '#b45309' }}>5</span>
                                        <span className={branchStyles.statLab} style={{ color: '#b45309' }}>Inactive</span>
                                    </div>
                                </div>
                            </div>

                            <div className={branchStyles.wardListContainer}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Ward List</div>
                                    <ChevronRight size={16} />
                                </div>
                                {branchWards.length === 0 ? (
                                    <div style={{ fontSize: '12px', color: '#94a3b8', padding: '10px 0' }}>No wards found for this branch.</div>
                                ) : (
                                    branchWards.slice(0, 10).map(ward => (
                                        <div
                                            key={ward.id || ward.ward_id}
                                            className={`${branchStyles.wardItem} ${selectedWardId === (ward.ward_id || ward.id) ? branchStyles.wardItemActive : ""}`}
                                            onClick={() => handleWardClick(ward)}
                                        >
                                            <div style={{ fontWeight: '600' }}>Ward {ward.ward_id || ward.id}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px' }}>+3.4</span>
                                                <ChevronRight size={14} color="#94a3b8" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={branchStyles.card} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6 }}>
                            <Building2 size={48} color="#cbd5e1" />
                            <p style={{ marginTop: '16px' }}>Select a branch to view details</p>
                        </div>
                    )}
                </div>

                {/* Level 3: Ward Details / Map */}
                <div className={branchStyles.contentColumn}>
                    {selectedWard ? (
                        <>
                            <div className={branchStyles.drCol}>
                                <div className={branchStyles.personCard}>
                                    <img src="https://ui-avatars.com/api/?name=Anand&background=random" style={{ width: '48px', height: '48px', borderRadius: '10px' }} alt="" />
                                    <div>
                                        <div style={{ fontWeight: '700' }}>Anand</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>+91 9876542211</div>
                                        <div style={{ fontSize: '10px', color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>Driver</div>
                                    </div>
                                </div>
                                <div className={branchStyles.personCard}>
                                    <img src="https://ui-avatars.com/api/?name=Panchu&background=random" style={{ width: '48px', height: '48px', borderRadius: '10px' }} alt="" />
                                    <div>
                                        <div style={{ fontWeight: '700' }}>Panchu</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>+91 987654322.3</div>
                                        <div style={{ fontSize: '10px', color: '#3b82f6', background: '#dbeafe', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>Helper</div>
                                    </div>
                                </div>
                            </div>

                            <div className={branchStyles.card} style={{ padding: '0' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontWeight: '700' }}>Working Vehicles</div>
                                    <div style={{ fontSize: '12px', color: '#4f46e5', cursor: 'pointer' }}>See All</div>
                                </div>
                                <table className={branchStyles.table}>
                                    <thead>
                                        <tr>
                                            <th>Vehicle</th>
                                            <th>Type</th>
                                            <th>Assigned To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.filter(v => v).slice(0, 5).map(v => (
                                            <tr key={v.id}>
                                                <td>{v.vehicles_No || v.vehicle_no || "RJ14TR9876"}</td>
                                                <td>{v.type || "Truck"}</td>
                                                <td>{v.assigned_to || (v.id % 2 === 0 ? "Anand" : "Panchu")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={branchStyles.mapCard}>
                                <button className={branchStyles.viewMapBtn}><MapPin size={16} /> View Map</button>
                                {isLoaded ? (
                                    <BranchMap
                                        branchData={branches}
                                        selectedBranch={selectedBranchId}
                                        setSelectedBranch={setSelectedBranchId}
                                        mapRef={mapRef}
                                        setMapRef={setMapRef}
                                        center={center}
                                        setCenter={setCenter}
                                    />
                                ) : (
                                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
                                        <Loader2 className="animate-spin" size={32} />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={branchStyles.card} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6 }}>
                            <Navigation size={48} color="#cbd5e1" />
                            <p style={{ marginTop: '16px' }}>Select a ward from the list to see specific details</p>
                            <div style={{ width: '100%', height: '800px', marginTop: '24px', borderRadius: '16px', overflow: 'hidden' }}>
                                {isLoaded && (
                                    <BranchMap
                                        branchData={branches}
                                        center={center}
                                        setCenter={setCenter}
                                        setMapRef={setMapRef}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals & Canva */}
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
