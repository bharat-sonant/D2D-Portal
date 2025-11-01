import React from "react";
import style from "../../Style/commonStyle/confirmation.module.css";
import { imagesRefPath } from "../../common/imagesRef/imagesRefPath";

const LocationPermissionAlertDialog = ({
  visible,
  title,
  msg,
  onConfirm,
  onCancel,
  btnOneText,
  btnTwoText,
  img,
}) => {
  if (!visible) {
    return;
  }
  return (
    <>
      <div className={style.overlay}>
        <div
          className={`${style.dialogbox}`}
        >
          <div className={style.header}>
            {img ? (
              img
            ) : (
              <img
                src={img || imagesRefPath.locationBlocked}
                className={`${style.headerImg}`}
                alt=""
              />
            )}
            <p className={`${style.headerText}`}>{title}</p>
            <p className={`${style.msgText}`}>{msg}</p>
          </div>
          <div className={style.action}>
            {btnTwoText && (
              <button className={style.btnCancel} onClick={() => onCancel()}>
                {btnTwoText}
              </button>
            )}
            <button className={style.btnSuccess} onClick={() => onConfirm()}>
              {btnOneText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationPermissionAlertDialog;
