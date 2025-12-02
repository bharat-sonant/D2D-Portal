import style from "../../Style/Settings.module.css"
import { saveBackOfficeSettingsHandler } from '../../Action/BackOffice/BackOfficeAction';

const BackOffice = (props) => {
    const handleSaveBackOfficeKey = () => {
        saveBackOfficeSettingsHandler(props);
    };

    return (
        <div>
            <div className={style.card}>

                <div className={style.twoColRow}>
                    <div className={style.inputRow}>
                        <label className={style.inputLabel}>Driver Large Image Width In px</label>
                        <input
                            type="text"
                            className={style.textInput}
                            value={props.driverLargeImageWidth}
                            onChange={(e) => {
                                if (/^\d{0,4}$/.test(e.target.value)) props.setDriverLargeImageWidth(e.target.value);
                            }}
                        />
                    </div>

                    <div className={style.inputRow}>
                        <label className={style.inputLabel}>Driver Thumbnail Width In px</label>
                        <input
                            type="text"
                            className={style.textInput}
                            value={props.driverThumbnailWidth}
                            onChange={(e) => {
                                if (/^\d{0,4}$/.test(e.target.value)) props.setDriverThumbnailWidth(e.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className={style.saveRow}>
                    <button className={style.saveButton} onClick={handleSaveBackOfficeKey}>Save</button>
                </div>

            </div>
        </div>

    )
}

export default BackOffice
