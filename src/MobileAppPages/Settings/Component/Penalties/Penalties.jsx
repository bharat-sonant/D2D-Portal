import style from '../../Style/Settings.module.css'
import { togglePenalties } from '../../Action/Penalties/PenaltiesAction';

const Penalties = (props) => {
    return (
        <div>
            <div className={style.card}>
                <h3 className={style.cardTitle}>Penalties</h3>
                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>Penalties Via Web</label>
                    <div className={`${style.toggleSwitch} ${props.isPenaltiesOn ? style.on : style.off}`} onClick={togglePenalties}>
                        <div className={style.toggleCircle}>{props.isPenaltiesOn ? "ON" : "OFF"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Penalties