import style from "../../../Style/Reports_Style/SidePannel/SidePannel.module.css";
import { File } from "lucide-react";
const SidePannel = ({ selectedReport, setSelectedReport }) => {
  const menuItems = [
  "Daily Work Report",
];

  return (
    <div className={style.menuList}>
      {menuItems.map((item, index) => (
        
          <div
            key={index}
            className={`${style.menuItem} `}
            onClick={() => setSelectedReport(item)}
          >
            <div
              className={`${style.menuIcon} ${
                selectedReport === item ? style.active : ""
              }`}
            >
              <File />
            </div>

            {item}
          </div>

      ))}
    </div>
  );
};

export default SidePannel;
