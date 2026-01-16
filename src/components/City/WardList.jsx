import style from "../../assets/css/City/wardList.module.css";
import GlobalStyles from "../../assets/css/globalStyles.module.css";
import { LocateFixed, Pencil } from "lucide-react";
import { debounce } from "lodash";
import { useState, useMemo } from "react";
import map from "../../assets/images/icons/map.gif";
import NoResult from "../NoResultFound/NoResult";

const COLORS = [
  "#4f6ef7", // soft blue
  "#22c55e", // soft green
  "#f59e0b", // soft amber
  "#ec4899", // soft pink
  "#8b5cf6", // soft violet
  "#06b6d4", // soft cyan
];

const WardList = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 300);

  const filteredWardList = useMemo(() => {
    if (!searchTerm) return props.wardList;
    const lowerTerm = searchTerm.toLowerCase();
    return (
      props.wardList?.filter(
        (ward) =>
          ward.name?.toLowerCase().includes(lowerTerm) ||
          ward.display_name?.toLowerCase().includes(lowerTerm)
      ) || []
    );
  }, [props.wardList, searchTerm]);

  const onWardClick = (ward) => {
    props.setSelectedWard(ward);
  };

  return (
    <div className={style.wardList}>
      <div className={style.cardHeader}>
        <h5 className={style.heading}>Wards</h5>

        <div className="d-flex justify-content-center align-items-center">
          <button
            className={`btn ${style.custom_AddDesignation_btn} p-0`}
            onClick={() => {
              props.setOpenAddWardPopUp(true);
            }}
          >
            +
          </button>
        </div>
      </div>

      <div className={style.searchContainer}>
        <input
          className={`${GlobalStyles.inputSearch}`}
          type="text"
          placeholder="Search Ward..."
          onChange={handleSearch}
        />
      </div>

      <div className={style.scrollList}>
        {filteredWardList && filteredWardList.length > 0 ? (
          <div className={style.wardLayout}>
            {filteredWardList.map((ward, index) => {
              const isActive = props.selectedWard?.id === ward.id;
              const color = COLORS[index % COLORS.length];

              return (
                <div
                  onClick={() => onWardClick(ward)}
                  key={index}
                  className={`${style.wardBox} ${isActive ? style.active : ""}`}
                  // style={
                  //   isActive
                  //     ? {
                  //         border: `1px solid ${color}`,
                  //       }
                  //     : {}
                  // }
                >
                  <div className={style.wardLeft}>
                    <div
                      className={style.wardNumber}
                      style={
                        isActive
                          ? {
                              color: "var(--white",
                              background: ` ${color}`,
                            }
                          : {}
                      }
                    >
                      {index + 1}
                    </div>

                    <div className={style.wardData}>
                      <span className={style.wardDisplayName}>
                        {!ward.display_name && (
                          <LocateFixed size={14} color={color} />
                        )}
                        {ward.display_name || ward.name}
                      </span>

                      {ward.display_name && (
                        <span className={style.wardName}>
                          Ward: {ward.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    data-edit-icon
                    className={style.wardRight}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.setEditWard({
                        ward: ward.name,
                        wardId: ward.id,
                        display_name: ward.display_name,
                      });
                      props.setOpenAddWardPopUp(true);
                      props.setOnEdit(true);
                    }}
                  >
                    <Pencil className={style.iconEdit} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoResult title="No ward found" query={searchQuery} gif={map} />
        )}
      </div>
    </div>
  );
};

export default WardList;
