import { changeUserPassword } from "../../services/ChangePasswordServices/ChangePasswordServise"


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

    const resp = await changeUserPassword(
      userId,
      currentPassword,
      newPassword
    );

    if (!resp.success) {
      throw new Error(resp.error);
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
