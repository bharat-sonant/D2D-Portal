import { images } from "../../assets/css/imagePath";
import style from "../../assets/css/City/wardList.module.css"

const AddVehiclesCard = () => {
    return (
        <div className={style.Detailscard}>
            <div className={style.card_header}>
                <h5 className={style.heading}>Add Vehicles</h5>
                <div className="d-flex justify-content-center align-items-center">
                    <button
                        className={`btn ${style.custom_AddDesignation_btn} p-0`}
                        onClick={() => { }}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className={style.Scroll_List}>
                <div className={style.dropdownItemNot}>
                    <img src={images.imgComingSoon} className={`${style.foundNot}`} alt="Coming Soon" />
                    No vehicle found
                </div>
            </div>
        </div>
    );
};

export default AddVehiclesCard;
