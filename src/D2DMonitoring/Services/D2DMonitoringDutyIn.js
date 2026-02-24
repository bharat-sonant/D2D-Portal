import * as db from '../../services/dbServices';

export const getWardDutyOnTimeFromDB = async (year, month, day) => {
    db.getData(`WasteCollectionInfo/${year}/${month}/${day}/Summary/dutyIntime`).then((resp) => {
        if (resp !== null) {
            console.log("Duty In Time: ", resp);
        }
    })
};