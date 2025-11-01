import style from '../../assets/css/Employee/DialogueBox.module.css';
import { imagesRefPath } from '../../common/imagesRef/imagesRefPath';

const DialogueBox = ({
    styles,
    visible,
    setIsVisible,
    title,
    msg,
    onConfirm,
    onCancel,
    btnOneText,
    btnTwoText,
    img,
    isManager
}) => {

    if (!visible) {
        return;
    }

    return (
        <>
            <div className={style.overlay}>
                <div className={style.dialogbox}>
                    <div className={style.header}>
                        {!isManager ? (
                            <img
                                src={img || imagesRefPath.confirm}
                                className={`${style.approveImg}`}
                                alt=""
                            />
                        ) : (
                            <img
                                src={img || imagesRefPath.remove}
                                className={`${style.headerImg}`}
                                alt=""
                            />
                        )}
                        <p
                            className={style.headerText}
                            style={{ textAlign: styles && `${styles}`, marginBottom: "0px" }}
                        >
                            {title}
                        </p>
                        <p className={style.msgText}>{msg}</p>
                    </div>
                    <div className={style.action}>
                        {!isManager && btnTwoText ? (
                            <button className={style.btnDelete} onClick={() => onCancel()}>
                                {btnTwoText}
                            </button>
                        ):(
                            <button className={style.btnCancel} onClick={() => onCancel()}>
                            {btnTwoText}
                        </button>
                        )}
                        {!isManager ? (
                            <button className={style.btnSuccess} onClick={() => onConfirm()}>
                                {btnOneText}
                            </button>
                        ) : (
                            <button className={style.btnDelete} onClick={() => onConfirm()}>
                                {btnOneText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DialogueBox