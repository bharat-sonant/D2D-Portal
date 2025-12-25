import { images } from "../../assets/css/imagePath";
import style from "../../assets/css/City/wardList.module.css"

const WardList = (props) => {
 
   

  return (
    <div className={style.Detailscard}>
      <div className={style.card_header}>
        <h5 className={style.heading}> </h5>
        
          <div className="d-flex justify-content-center align-items-center">
            <button
              className={`btn ${style.custom_AddDesignation_btn} p-0`}
              onClick={()=>{props.setOpenAddWardPopUp(true)}}
            >
              +
            </button>
          </div>
      
      </div>

      <div className={style.Scroll_List}>
        {props.wardList&& props.wardList.length > 0 ? (
          <ul className={style.listLine}>
            {props.wardList.map((ward, index) => (
              <li key={index} className={style.list_item}>
                <span className={style.designationName}>
                  {" "}
                  {ward.name}
                </span>
                <div className={style.countEdit}>
                
                    <img
                      src={images.iconEdit}
                      className={`${style.edit_icon}`}
                     
                    />
           
                      <img
                        src={images.iconDeleted}
                        className={style.edit_icon}
                        width="13px"
                        
                      />
                    
                  
                </div>
              </li>
            ))}
          </ul>
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
