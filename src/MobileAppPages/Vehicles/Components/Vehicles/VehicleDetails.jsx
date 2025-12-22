import styles from '../../Styles/VehicleDetails/VehicleDetails.module.css';

const VehicleDetails = (props) => {
    if (!props.vehicleDetails) {
        return <div className={styles.emptyState}></div>;
    }

    return (
        <>
            <div className={styles.card}>
                <div className={styles.headerRow}>
                    <span className={styles.taskIdBadge}>
                        {props.vehicleDetails.vehicles_No}
                    </span>

                    <h2 className={styles.name}>
                        {props.vehicleDetails.chassis_no || 'N/A'}
                    </h2>
                </div>
            </div>
        </>
    )
}

export default VehicleDetails