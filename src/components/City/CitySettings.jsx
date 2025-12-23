import { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import style from '../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css';
import { Edit2} from 'lucide-react';
import { images } from '../../assets/css/imagePath';
import LogoImage from '../Common/Image/LogoImage';

const CitySettings = ({openCanvas,onHide,selectedCity,onClickEdit,setStatusConfirmation}) => {
  const [toggle, setToggle] = useState(selectedCity?.Status === 'active' || false);
  const handleToggle=(e)=>setStatusConfirmation({status:true,data:e.target.checked,setToggle})
  return (
    <>
      <Offcanvas
        placement="end"
        show={openCanvas}
        onHide={onHide}
        className={style.responsiveOffcanvas}
        style={{ width: '45%' }}
      >
        <div className={style.canvas_container}>
          <div className={style.OffcanvasHeader}>
            <h4 className={style.header_title}>City Settings</h4>
          </div>
          <div className={style.scroll_section}>
            <div className={style.canvas_header_end}>
              <img
                src={images.iconClose}
                className={style.close_popup}
                onClick={onHide}
                alt="Close"
              />
            </div>

            <div className={style.taskControlCard}>
              <div className={style.controlRow}>
                <LogoImage image={selectedCity?.logoUrl}/>
                <h3 className={style.taskName}>{selectedCity?.CityName || 'N/A'}</h3>
                <div className={style.actionButtons}>
                  <button className={style.editButton} onClick={onClickEdit}>
                    <Edit2 size={18} />
                  </button>
                </div>

                <div className={style.statusSection}>
                  <label className={style.toggleSwitch}>
                    <input type="checkbox" checked={toggle} onChange={handleToggle}/>
                    <span className={style.toggleSlider}></span>
                  </label>
                  <span className={`${style.statusText} ${toggle ? style.active : style.inactive}`}>
                    {toggle ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default CitySettings;