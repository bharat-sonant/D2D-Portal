import { updateData, getDataByColumnName } from "../../services/supabaseServices";
import { decryptValue, encryptValue, MAILAPI } from "../../common/common";
import { sendChangePasswordTemplate } from "../../common/emailHTMLTemplates/MailTemplates"// Make sure this path is correct
import axios from "axios";

/**
 * Change user password service
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changeUserPassword = async (userId, currentPassword, newPassword) => {
    try {
        // Fetch user data
        const resp = await getDataByColumnName("Users", "id", userId);
        if (!resp.success || !resp.data) {
            throw new Error("User not found");
        }

        const userData = resp.data;
        const decryptedPassword = decryptValue(userData.password);
// console.log(userData)
        // Validate current password
        if (decryptedPassword !== currentPassword) {
            throw new Error("Invalid current password");
        }

        // Ensure new password is different
        if (currentPassword === newPassword) {
            throw new Error("New password cannot be same as current password");
        }

        // Encrypt new password
        const encryptedNewPassword = encryptValue(newPassword);

        // Update password in database
        const updateResp = await updateData(
            "Users",               // tableName
            "id",                  // key column
            userId,                // key value
            { password: encryptedNewPassword } // data to update
        );

        if (!updateResp.success) {
            throw new Error("Failed to update password");
        }
// console.log(decryptValue(userData.email))
        // Send password change success email
        try {
            await sendChangePasswordToMail(decryptValue(userData.email), userData.name, newPassword);
        } catch (mailError) {
            console.error("Failed to send password change email:", mailError);
            // Do not block success response if email fails
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

export const sendChangePasswordToMail = async (to, empCode, password) => {
    // console.log(empCode,"asda")
    try {
        const url = MAILAPI;
        const subject = `Your Login Credentials for WeVOIS Labs Pvt. Ltd. Application`;
        const htmlBody = sendChangePasswordTemplate(empCode, password);
        const response = await axios.post(url, {
            to,
            subject,
            html: htmlBody,
        });
        // console.log('response', response)

        return response.status === 200 ? "success" : "failure";
    } catch (error) {
        console.log('error in mail', error)
        throw error;
    }
}
