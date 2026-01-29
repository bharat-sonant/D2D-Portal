import { useEffect, useState } from "react";
import { Building2, Grid3x3, Truck, Users } from "lucide-react";

import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "./City.module.css";
import globalAlert from "../../components/GlobalAlertModal/GlobalAlertModal.module.css";
import CityList from "../../components/City/CityList";
import AddCity from "../../components/City/AddCity";
import SettingsBtn from "../../components/Common/SettingsBtn";
import CitySettings from "../../components/City/CitySettings";
import ConfirmationModal from "../../components/confirmationModal/ConfirmationModal";
import {
  changeCityStatusAction,
  getCityList,
} from "../../Actions/City/cityAction";
import WardList from "../../components/City/WardList";
import AddWard from "../../components/City/AddWard";
import AddVehiclesCard from "../../components/City/AddVehiclesCard";
import UserCityAccessList from "../../components/UserCityAccess/UserCityAccessList";
import { getUsersByCity } from "../../Actions/City/UserCityAccessAction";
import { saveFirebaseConfigAction } from "../../Actions/City/firebaseConfigAction";
import LogoImage from "../../components/Common/Image/LogoImage";

import WardSetting from "../../components/City/WardSetting";
import GlobalOffcanvas from "../../components/Common/globalOffcanvas/globalOffcanvas";
import WardMapCanvas from "../../components/City/WardMapCanvas";
import { useRef } from "react";
import { saveWardBoundaryGeojsonInDb, saveWardMapData, uploadWardBoundaryJson, uploadWardMapJson } from "../../Actions/City/wardMapAction";

const TABS = [
  { key: "city", label: "Site Details", icon: Building2 },
  { key: "wards", label: "Wards", icon: Grid3x3 },
  { key: "vehicle", label: "Vehicles", icon: Truck },
  { key: "users", label: "Users In Site", icon: Users },
];

const City = (props) => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [openAddWardPopUp, setOpenAddWardPopUp] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [statusConfirmation, setStatusConfirmation] = useState({
    status: false,
    data: null,
    setToggle: () => {},
  });
  const [wardList, setWardList] = useState([]);
  const [editWard, setEditWard] = useState({ ward: "", wardId: "" });
  const [activeTab, setActiveTab] = useState("city");
  const [usersInCity, setUsersInCity] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedWard, setSelectedWard] = useState("");
  const [openWardMapCanvas, setOpenWardMapCanvas] = useState(false);
  const [activeWardId, setActiveWardId] = useState(null);
  const [isWardBoundaryMapPopupOpen, setIsWardBoundaryMapPopupOpen] =
    useState(false);
  const [isWardLinePopupOpen, setIsWardLinePopOpen] = useState(false);
  const [wardBoundaryGeoJsonData, setWardBoundaryGeoJsonData] = useState(null);
const [wardMapGeoJsonData, setWardMapGeoJsonData] = useState(null);
const [ PreviousMapList,setPreviousMapList] = useState([]);
const [SelectedDate,setSelectedDate] = useState([]);

  const [HoldArray, setHoldArray] = useState([]);
    const mapRef = useRef(null);
  const loadCities = async () => {
    getCityList(
      setSelectedCity,
      setCityList,
      selectedCity,
      setWardList,
      setLoading,
      setSelectedWard,
    );
  };

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    if (activeTab === "users" && selectedCity?.city_id) {
      getUsersByCity(selectedCity.city_id, setUsersInCity, setLoadingUsers);
    }
  }, [activeTab, selectedCity]);

  const handleOpenModal = () => {
    setShowCanvas(true);
  };
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);
  const handleOpenEditWindow = () => {
    setOpenSettings(false);
    setShowCanvas(true);
    setOnEdit(selectedCity);
  };
  const handleStatusConfirmation = () => {
    changeCityStatusAction(
      statusConfirmation?.data,
      selectedCity,
      statusConfirmation?.setToggle,
      loadCities,
      setStatusConfirmation,
    );
  };

  const handleSaveFirebaseConfig = async (dbPath, setLoader) => {
    await saveFirebaseConfigAction(
      selectedCity.city_id || selectedCity.CityId,
      dbPath, // Pass string directly
      setLoader,
      () => {
        loadCities(); // Refresh city list to get updated config
      },
    );
  };

  const mapContainerStyle = {
    width: "100%",
    height: "320px",
  };

  const center = {
    lat: 26.901875,
    lng: 75.738869,
  };
   const handleGeoJsonUpload = async (event) => {
    const file = event.target.files[0];
    uploadWardBoundaryJson(
      file,
      setWardBoundaryGeoJsonData,
      props.setIsWardBoundaryMapPopupOpen,
      setHoldArray,
    );
  };

  function handleWardGeoJsonUpload(event) {
    const file = event.target.files[0];
    uploadWardMapJson(
      file,
      setWardMapGeoJsonData,
      props.setIsWardLinePopOpen,
      setHoldArray,
    );
  }
    const fitToBoundsForBoundaryAndLines = () => {
    if (!mapRef.current) return;

    const bounds = new window.google.maps.LatLngBounds();

    // Boundary
    if (wardBoundaryGeoJsonData?.length) {
      wardBoundaryGeoJsonData.forEach((p) => {
        bounds.extend(new window.google.maps.LatLng(p.lat, p.lng));
      });
    }

    // Lines (multiple polylines)
    if (wardMapGeoJsonData?.length) {
      wardMapGeoJsonData.forEach((path) => {
        path.forEach((p) => {
          bounds.extend(new window.google.maps.LatLng(p.lat, p.lng));
        });
      });
    }

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds);
    }
  };

  return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`}>
        {activeTab === "city" && (
          <>
            {/* {selectedCity && <SettingsBtn click={handleOpenSettings} />} */}
            <button
              className={`${GlobalStyles.floatingBtn}`}
              onClick={handleOpenModal}
            >
              +
            </button>
          </>
        )}
      </div>

      <div className={`${TaskStyles.cityPage}`}>
        <div className={`${TaskStyles.cityPageLeft}`}>
          <CityList
            cityList={cityList}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            setWardList={setWardList}
            setLoading={setLoading}
            loading={loading}
            setSelectedWard={setSelectedWard}
          />
        </div>

        {selectedCity !== null && (
          <div className={TaskStyles.cityPageRight}>
            <div className={TaskStyles.tabContainer}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${TaskStyles.tabButton} ${
                      activeTab === tab.key ? TaskStyles.active : ""
                    }`}
                  >
                    <div className={TaskStyles.tabIconBG}>
                      <Icon size={16} className={TaskStyles.tabIcon} />
                    </div>
                    <span className={TaskStyles.tabName}>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === "city" && (
              <div className={TaskStyles.cityCard}>
                <div className={TaskStyles.cityLeft}>
                  <LogoImage image={selectedCity?.logoUrl} />
                  <span className={TaskStyles.userName}>
                    {selectedCity?.site_code || "N/A"}
                    <p>Manage permissions, site access and more</p>
                  </span>
                </div>

                <div className={TaskStyles.cityRight}>
                  {activeTab === "city" && (
                    <>
                      {selectedCity && (
                        <SettingsBtn click={handleOpenSettings} />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            {activeTab === "wards" && (
              <>
                <div className={`${TaskStyles.wardTab}`}>
                  <WardList
                    setOpenAddWardPopUp={setOpenAddWardPopUp}
                    wardList={wardList}
                    setWardList={setWardList}
                    setEditWard={setEditWard}
                    setSelectedWard={setSelectedWard}
                    selectedWard={selectedWard}
                    setOnEdit={setOnEdit}
                  />
                  {selectedWard !== undefined && (
                    <WardSetting
                      selectedWard={selectedWard}
                      setWardList={setWardList}
                      selectedCity={selectedCity}
                      openWardMap={(wardId) => {
                        setActiveWardId(wardId);
                        setOpenWardMapCanvas(true);
                      }}
                    />
                  )}
                </div>
              </>
            )}

            {activeTab === "vehicle" && (
              <AddVehiclesCard selectedCity={selectedCity} />
            )}

            {activeTab === "users" && (
              <UserCityAccessList
                selectedCity={selectedCity}
                userList={usersInCity}
                loading={loadingUsers}
                isEmbedded={true}
              />
            )}
          </div>
        )}
      </div>

      {showCanvas && (
        <AddCity
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
          loadCities={loadCities}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
        />
      )}
      {openSettings && (
        <CitySettings
          openCanvas={openSettings}
          onHide={handleCloseSettings}
          selectedCity={selectedCity}
          onClickEdit={handleOpenEditWindow}
          setStatusConfirmation={setStatusConfirmation}
          onSaveFirebaseConfig={handleSaveFirebaseConfig}
        />
      )}

      {openAddWardPopUp && (
        <AddWard
          openAddWardPopUp={openAddWardPopUp}
          setOpenAddWardPopUp={setOpenAddWardPopUp}
          setEditWard={setEditWard}
          editWard={editWard}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
          selectedCity={selectedCity}
          setWardList={setWardList}
          wardList={wardList}
          setSelectedWard={setSelectedWard}
        />
      )}
      {statusConfirmation?.status && (
        <ConfirmationModal
          visible={statusConfirmation?.status}
          title={`Site ${statusConfirmation?.data ? "Activate" : "Deactivate"}`}
          message={
            <>
              Are you sure you want to{" "}
              {statusConfirmation?.data ? "activate" : "deactivate"}{" "}
              <strong
                className={
                  statusConfirmation?.data
                    ? globalAlert.successName
                    : globalAlert.warningName
                }
              >
                {selectedCity?.city_name}
              </strong>{" "}
              site?
            </>
          }
          onCancel={() =>
            setStatusConfirmation({
              status: false,
              data: null,
              setToggle: () => {},
            })
          }
          onConfirm={handleStatusConfirmation}
          btnColor={!statusConfirmation?.data && "red"}
        />
      )}
      {openWardMapCanvas && (
        <GlobalOffcanvas
          open={openWardMapCanvas}
          onClose={() => setOpenWardMapCanvas(false)}
          title="Ward Settings"
        >
          <WardMapCanvas
            wardId={activeWardId}
            selectedCity={selectedCity.city_id}
           setIsWardBoundaryMapPopupOpen={setIsWardBoundaryMapPopupOpen}
  setIsWardLinePopOpen={setIsWardLinePopOpen}

  setWardBoundaryGeoJsonData={setWardBoundaryGeoJsonData}
  setWardMapGeoJsonData={setWardMapGeoJsonData}
  setHoldArray={setHoldArray}
          />
        </GlobalOffcanvas>
      )}
{isWardBoundaryMapPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "700px",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              <span>Ward Map Preview</span>
              <span
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => setIsWardBoundaryMapPopupOpen(false)}
              >
                ✕
              </span>
            </div>

            {/* MAP */}
            <GoogleMap
              onLoad={(map) => {
                mapRef.current = map;
                fitToBoundsForBoundaryAndLines();
              }}
              mapContainerStyle={{
                width: "100%",
                height: "360px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
              center={center}
              zoom={13}
            >
              {wardBoundaryGeoJsonData && (
                <Polygon
                  paths={wardBoundaryGeoJsonData}
                  options={{
                    strokeColor: "#000",
                    strokeWeight: 3,
                    strokeOpacity: 1,
                    fillOpacity: 0,
                  }}
                />
              )}
            </GoogleMap>

            {HoldArray?.length !== 0 && (
              <div
                style={{
                  marginTop: "12px",
                  textAlign: "right",
                }}
              >
                <label
                  style={{
                    display: "inline-block",
                    padding: "8px 14px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() =>
                    saveWardBoundaryGeojsonInDb(
                      props.wardId,
                      props.selectedCity,
                      HoldArray,
                      setHoldArray,
                      props.setIsWardBoundaryMapPopupOpen,
                    )
                  }
                >
                  Upload GeoJSON
                </label>
              </div>
            )}
          </div>
        </div>
      )}

{isWardLinePopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "700px",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              <span>Ward Map Preview</span>
              <span
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => setIsWardLinePopOpen(false)}
              >
                ✕
              </span>
            </div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              onLoad={(map) => {
                mapRef.current = map;
                fitToBoundsForBoundaryAndLines();
              }}
            >
              {wardBoundaryGeoJsonData && (
                <Polygon
                  paths={wardBoundaryGeoJsonData}
                  options={{
                    strokeColor: "#000",
                    strokeWeight: 3,
                    strokeOpacity: 1,
                    fillOpacity: 0,
                  }}
                />
              )}

              {wardMapGeoJsonData &&
                wardMapGeoJsonData.map((path, index) => (
                  <Polyline
                    key={index}
                    path={path}
                    options={{
                      strokeColor: "#2563eb",
                      strokeOpacity: 1,
                      strokeWeight: 2,
                    }}
                  />
                ))}
            </GoogleMap>

            {HoldArray?.length !== 0 && (
              <div
                style={{
                  marginTop: "12px",
                  textAlign: "right",
                }}
              >
                <label
                  style={{
                    display: "inline-block",
                    padding: "8px 14px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() =>
                    saveWardMapData(
                      props.wardId,
                      props.selectedCity,
                      HoldArray,
                      setHoldArray,
                      props.setIsWardLinePopOpen,
                      setPreviousMapList,
                      setSelectedDate,
                    )
                  }
                >
                  Upload GeoJSON
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default City;
