import { setAlertMessage } from "../../common/common"
import { getDashboardPermissions, saveDashboardPermission } from "../../services/Permission/PermissonServices"

export const SaveDashBoardPermissions = (company, empCode, assignDashboard) => {
    saveDashboardPermission(company, empCode, assignDashboard).then((response) => {
        if (response.status === 'success') {
            setAlertMessage('success', response.message)
        }
    })
}

export const getPermissionData = async (company, empCode, setSelectedDashboard) => {
    let data = await getDashboardPermissions(company, empCode)
    setSelectedDashboard('')
    if (data !== null) {
        setSelectedDashboard(data)
    }
}