import { changeUserPassword } from "../../services/ChangePasswordServices/ChangePasswordServise";
// import { sendChangePasswordMail } from "../../services/emailService";
import { decryptValue } from "../../common/common";
import { getDataByColumnName } from "../../services/supabaseServices";

/**
 * Action to change user password and send success email
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 * @param {function} setLoading - Optional loading state setter
 * @param {function} setError - Optional error state setter
 * @param {function} onSuccess - Optional success callback
 */
export const changePasswordAction = async (
  userId,
  currentPassword,
  newPassword,
  setLoading,
  setError,
  onSuccess
) => {
  try {
    if (setLoading) setLoading(true);
    if (setError) setError("");

    // Call service to change password
    const resp = await changeUserPassword(userId, currentPassword, newPassword);

    if (!resp.success) {
      throw new Error(resp.error);
    }

    // Fetch user data to get email and other details for sending email
    try {
      const userResp = await getDataByColumnName("Users", "id", userId);

      if (userResp.success && userResp.data) {
        const userEmail = decryptValue(userResp.data.email);
      }
    } catch (mailError) {
      console.error("Failed to send password change email:", mailError);
      // Do not block the main password change flow
    }

    // Success callback (close modal, show toast, etc.)
    if (onSuccess) onSuccess(resp.message);

    return {
      success: true,
      message: resp.message,
    };
  } catch (error) {
    if (setError) {
      setError(error.message || "Something went wrong");
    }

    return {
      success: false,
      error: error.message || error,
    };
  } finally {
    if (setLoading) setLoading(false);
  }
};
