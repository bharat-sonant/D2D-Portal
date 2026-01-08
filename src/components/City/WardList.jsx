import { images } from "../../assets/css/imagePath";
import style from "../../assets/css/City/wardList.module.css"
import { FiEdit } from "react-icons/fi";
import { updateWardRealTimeStatusAction } from "../../Actions/City/cityAction";

const WardList = (props) => {


  const handleToggleRealtime = (wardId,realTimeStatus) => {
   updateWardRealTimeStatusAction(wardId,realTimeStatus,props.setWardList)
}


  return (
    <div className={style.Detailscard}>
      <div className={style.card_header}>
        <h5 className={style.heading}>Add Wards </h5>

        <div className="d-flex justify-content-center align-items-center">
          <button
            className={`btn ${style.custom_AddDesignation_btn} p-0`}
            onClick={() => { props.setOpenAddWardPopUp(true) }}
          >
            +
          </button>
        </div>

      </div>

  <div className={style.Scroll_List}>
  {props.wardList && props.wardList.length > 0 ? (
    // GRID LAYOUT for Wards
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "15px", padding: "10px 0" }}>
      {props.wardList.map((ward, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "10px",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
            position: "relative"
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = "translateY(-3px)"; 
            e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
            // Edit icon ko visible karo
            const editIcon = e.currentTarget.querySelector('[data-edit-icon]');
            if (editIcon) editIcon.style.opacity = "1";
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = "translateY(0)"; 
            e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
            // Edit icon ko hide karo
            const editIcon = e.currentTarget.querySelector('[data-edit-icon]');
            if (editIcon) editIcon.style.opacity = "0";
          }}
        >
          {/* Ward Name and Edit Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
              <div style={{
                width: "32px", 
                height: "32px", 
                borderRadius: "8px", 
                background: "#e0e7ff", 
                color: "#6B7FDE",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontWeight: "bold",
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <span className={style.designationName} style={{ fontWeight: 600, fontSize: "14px" }}>
                {ward.name}
              </span>
            </div>
            <div
              data-edit-icon
              className={style.countEdit}
              onClick={() => {
                props.setEditWard({ ward: ward.name, wardId: ward.id });
                props.setOpenAddWardPopUp(true);
              }}
              style={{ 
                cursor: "pointer", 
                padding: "5px",
                opacity: 0,
                transition: "opacity 0.2s ease"
              }}
            >
              <FiEdit  color="#9ca3af" />
            </div>
          </div>

          {/* Realtime Toggle Row */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            paddingTop: "8px",
            borderTop: "1px solid #f0f0f0"
          }}>
            <span style={{ fontSize: "13px", color: "#666", fontWeight: 500 }}>
              Show in Realtime
            </span>
            <label style={{
              position: "relative", 
              display: "inline-block", 
              width: "44px", 
              height: "24px",
              cursor: "pointer"
            }}>
              <input 
                type="checkbox" 
                checked={ward.show_realtime === 'Yes'}
                onChange={() => { 
                    handleToggleRealtime(ward.id ,ward.show_realtime);
                }}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: ward.show_realtime==='Yes' ? "#6B7FDE" : "#ccc",
                transition: "0.3s",
                borderRadius: "24px"
              }}>
                <span style={{
                  position: "absolute",
                  content: "",
                  height: "18px",
                  width: "18px",
                  left:  ward.show_realtime==='Yes' ? "23px" : "3px",
                  bottom: "3px",
                  backgroundColor: "white",
                  transition: "0.3s",
                  borderRadius: "50%"
                }}></span>
              </span>
            </label>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className={style.dropdownItemNot}>
      <img src={images.imgComingSoon} className={`${style.foundNot}`} />
      No ward found
    </div>
  )}
</div>
    </div>
  );
};

export default WardList;
