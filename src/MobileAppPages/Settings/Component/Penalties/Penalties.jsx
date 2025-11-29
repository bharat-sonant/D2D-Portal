import { useEffect, useState } from 'react';
import { setAlertMessage } from '../../../../common/common';
import { getPaneltiesValue, RemovePaneltiesValue, savePaneltiesValue } from '../../Services/PaneltiesViaWebServise';
import style from '../../Style/Settings.module.css'

const Penalties = () => {
    const [isPenaltiesOn, setIsPenaltiesOn] = useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        loadPenalties();
    }, [])

    const loadPenalties = async () => {
        const response = await getPaneltiesValue(setLoader);
        setIsPenaltiesOn(response.status === "success" && response.data.value === "yes");
    };

    const togglePenalties = async () => {
        const newValue = !isPenaltiesOn;
        setIsPenaltiesOn(newValue);

        const res = newValue ? await savePaneltiesValue() : await RemovePaneltiesValue();
        if (res?.status !== "success") {
            setIsPenaltiesOn(isPenaltiesOn);
            setAlertMessage("error", "Failed to update Penalties");
        } else setAlertMessage("success", "Penalties updated");
    };

    return (
        <div>
            <div className={style.card}>
                <h3 className={style.cardTitle}>Penalties</h3>
                <div className={style.toggleWrapper}>
                    <label className={style.toggleLabel}>Penalties Via Web</label>
                    <div className={`${style.toggleSwitch} ${isPenaltiesOn ? style.on : style.off}`} onClick={togglePenalties}>
                        <div className={style.toggleCircle}>{isPenaltiesOn ? "ON" : "OFF"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Penalties