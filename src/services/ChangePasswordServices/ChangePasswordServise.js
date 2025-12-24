import { updateData, getDataByColumnName } from "../../services/supabaseServices";
import { decryptValue, encryptValue } from "../../common/common";
import { log } from "@tensorflow/tfjs";

/**
 * Change user password service
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changeUserPassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    // console.log(currentPassword,"asd")
    try {
        const resp = await getDataByColumnName("Users", "id", userId);
        if (!resp.success || !resp.data) {
            throw new Error("User not found");
        }

        const decryptedPassword = decryptValue(resp.data.password);

        if (decryptedPassword !== currentPassword) {
            throw new Error("Invalid current password");
        }
        if (currentPassword === newPassword) {
            throw new Error("New password cannot be same as current password");
        }

        const encryptedNewPassword = encryptValue(newPassword);

        const updateResp = await updateData(
            "Users",          // tableName
            "id",             // key column
            userId,           // key value
            { password: encryptedNewPassword } // data to update
        );

        if (!updateResp.success) {
            throw new Error("Failed to update password");
        }

        return {
            success: true,
            message: "Password updated successfully",
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || err,
        };
    }
};
