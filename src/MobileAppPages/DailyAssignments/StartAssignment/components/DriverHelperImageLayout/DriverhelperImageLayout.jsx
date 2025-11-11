import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import styles from '../../styles/DriverHelperImageLayout/DriverHelperImageLayout.module.css';

const DriverHelperImageLayout = () => {
    const [driverImage, setDriverImage] = useState(null);
    const driverInputRef = useRef(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (type === 'driver') {
                setDriverImage(event.target.result);
            };
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h3 className={styles.heading}>कृपया DRIVER AND HELPER की फोटो खींचे ।</h3>

                <div
                    className={styles.imageBox}
                    onClick={() => driverInputRef.current?.click()}
                >
                    {driverImage ? (
                        <img src={driverImage} alt="Driver" className={styles.image} />
                    ) : (
                        <Camera className={styles.cameraIcon} />
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*;capture=camera"
                    capture="environment"
                    ref={driverInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'driver')}
                />

            </div>
        </div>
    );
};

export default DriverHelperImageLayout;
