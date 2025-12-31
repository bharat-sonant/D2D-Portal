import { images } from "../../assets/css/imagePath";
import style from "../../assets/css/City/wardList.module.css"
import { FiEdit } from "react-icons/fi";

const WardList = (props) => {



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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px", padding: "10px 0" }}>
            {props.wardList.map((ward, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px", background: "#e0e7ff", color: "#6B7FDE",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold"
                  }}>
                    {index + 1}
                  </div>
                  <span className={style.designationName} style={{ fontWeight: 600, fontSize: "14px" }}>
                    {ward.name}
                  </span>
                </div>

                <div
                  className={style.countEdit}
                  onClick={() => {
                    props.setEditWard({ ward: ward.name, wardId: ward.id });
                    props.setOpenAddWardPopUp(true);
                  }}
                  style={{ cursor: "pointer", padding: "5px" }}
                >
                  <FiEdit className={style.edit_icon} color="#9ca3af" />
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
