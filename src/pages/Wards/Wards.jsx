import React, { useEffect, useState } from "react";
import style from "../../Style/Attendance/AttendanceData.module.css";
import { getAllVehicles, getAllWards } from "../../services/WardsServices/WardsService";
import { Loader } from "lucide-react";

const Wards = () => {
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 start with loading true

  useEffect(() => {
    fetchWardList();
  }, []);

  const fetchWardList = async () => {
    try {
      const result = await getAllWards();
      if (result?.status === "success") {
        const cleanedList = result.data.filter(Boolean);
        setWardList(cleanedList);
      } else {
        console.error("Invalid ward data:", result);
        setWardList([]);
      }
    } catch (error) {
      console.error("Error fetching ward list:", error);
      setWardList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.mainContainer} style={{ marginTop: "60px" }}>
      <div className={style.card}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "500",
              margin: "15%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader className="animate-spin" size={32} />
          </div>
        ) : wardList.length > 0 ? (
          <div
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "8px",
            }}
          >
            <table className={style.table} style={{ width: "100%" }}>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#f5f5f5",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th>Sr No.</th>
                  <th>Ward</th>
                </tr>
              </thead>
              <tbody>
                {wardList.map((record, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "500",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "15%",
            }}
          >
            No Wards found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Wards;
