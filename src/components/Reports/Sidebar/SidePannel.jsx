import style from '../../../Style/Reports_Style/SidePannel/SidePannel.module.css';

const SidePannel = ({ selectedReport, setSelectedReport }) => {

  const menuItems = [
    "Daily Work Report"
  ];

  return (
    <div className={style.container}>
      <div className={style.menuList}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`${style.menuItem} ${selectedReport === item ? style.active : ""}`}
            onClick={() => setSelectedReport(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePannel;
