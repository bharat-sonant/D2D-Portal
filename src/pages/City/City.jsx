import { useEffect, useState } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import { fetchUsers } from "../../services/supabaseServices";
import CityList from "../../components/City/CityList";
import AddCity from "../../components/City/AddCity";

const City = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [onEdit, setOnEdit] = useState(false);

  const loadCities = async () => {
    const data = await fetchUsers("Cities");
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    setSelectedCity(sortedData[0]);
    setCityList(sortedData);
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleOpenModal = () => {
    setShowCanvas(true);
  };

  return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`}>
        <button
          className={`${GlobalStyles.floatingBtn}`}
          onClick={handleOpenModal}
        >
          +
        </button>
      </div>

      <div className={`${TaskStyles.employeePage}`}>
        <div className={`${TaskStyles.employeeLeft}`}>
          <CityList
            cityList={cityList}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        </div>
        <div className={TaskStyles.employeeRight}>
          <div
            style={{
              width: "25%",
              background: "#fff",
              borderRadius: "12px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background: "#f2f2f2",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {selectedCity?.name || "N/A"}
              </span>
              <div style={{ width: "250px" }} />
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <img
                  src={selectedCity?.logo_image || "/city-placeholder.png"}
                  alt="City Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={GlobalStyles.mainSections}>
        <AddCity
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
          loadCities={loadCities}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
        />
      </div>
    </>
  );
};

export default City;
