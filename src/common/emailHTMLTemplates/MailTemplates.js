import moment from "moment";

export const companyRegistrationTemplate = (companyCode, empCode, password) => {
    return `
        <html>
            <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to Office Management </h1>
                    </div>
                    <div style="padding: 30px; color: #333; text-align: left;">
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Dear,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Congratulations! Your company has been successfully registered on our platform. Below are your account login details:
                        </p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Company Code:</td>
                                <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${companyCode}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Code:</td>
                                <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${empCode}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Password:</td>
                                <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${password}</td>
                            </tr>
                        </table>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            You can use these credentials to log in and start using the application. If you did not register or believe this is an error, please contact our support team immediately.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                            Best regards, <br>
                            <strong>Office Management Team</strong>
                        </p>
                    </div>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                        <p style="font-size: 12px; color: #888; margin: 0;">
                            If you have any questions, feel free to contact us at <a href="mailto:bharat.sonant@gmail.com" style="color: #0073e6; text-decoration: none;">bharat.sonant@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

export const otpEmailTemplate = (otpCode) => {
    return `
        <html>
            <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Office Management</h1>
                        <p style="color: #ffffff; font-size: 16px; margin: 10px 0;">One-Time Password (OTP) Verification</p>
                    </div>
                    <div style="padding: 30px; color: #333; text-align: left;">
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Dear User,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Use the OTP code below to complete your verification process:
                        </p>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 24px; font-weight: bold; color: #0073e6; padding: 10px 20px; background-color: #f0f8ff; border-radius: 4px; display: inline-block;">${otpCode}</span>
                        </div>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            This OTP is valid for the next 10 minutes. Please do not share this code with anyone for security reasons.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                            Best regards, <br>
                            <strong>Office Management Team</strong>
                        </p>
                    </div>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                        <p style="font-size: 12px; color: #888; margin: 0;">
                            If you did not request this OTP, please ignore this email or contact our support team at 
                            <a href="mailto:bharat.sonant@gmail.com" style="color: #0073e6; text-decoration: none;">bharat.sonant@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

export const sendPasswordTemplate = (companyCode, empCode, password, companyName) => {
    return `
        <html>
            <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to ${companyName}</h1>
                    </div>
                    <div style="padding: 30px; color: #333; text-align: left;">
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Dear User,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Below are your account details:
                        </p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Company Code:</td>
                                <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${companyCode}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Code:</td>
                                <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${empCode}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Password:</td>
                                <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${password}</td>
                            </tr>
                        </table>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Please use these credentials to log in. For security purposes, we recommend changing your password upon your first login.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                            Best regards, <br>
                            <strong>${companyName} Team</strong>
                        </p>
                    </div>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                        <p style="font-size: 12px; color: #888; margin: 0;">
                            If you have any questions, feel free to contact us at <a href="mailto:bharat.sonant@gmail.com" style="color: #0073e6; text-decoration: none;">bharat.sonant@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

// export const sendEmployeeLoginCredentialsTemplate = (companyName, companyCode, employeeId, password) => {
//     return `
//     <html>
//             <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
//                 <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
//                     <div style="background-color: #0073e6; padding: 20px; text-align: center;">
//                         <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to ${companyName}</h1>
//                     </div>
//                     <div style="padding: 30px; color: #333; text-align: left;">
//                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
//                             Dear,
//                         </p>
//                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
//                             Congratulations! Your registration has been successfully completed on ${companyName}. Below are your Login credentials:
//                         </p>
//                         <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//                             <tr>
//                                 <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Company Code:</td>
//                                 <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${companyCode}</td>
//                             </tr>
//                             <tr>
//                                 <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Code:</td>
//                                 <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${employeeId}</td>
//                             </tr>
//                             <tr>
//                                 <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Password:</td>
//                                 <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${password}</td>
//                             </tr>
//                         </table>
//                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
//                            You can use these credentials to log in and start using the application.
//                         If you did not register or believe this is an error, please contact our support team immediately.
//                         </p>
//                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
//                             Best regards, <br>
//                             <strong>${companyName} Team</strong>
//                         </p>
//                     </div>
//                     <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
//                         <p style="font-size: 12px; color: #888; margin: 0;">
//                             If you have any questions, feel free to contact us at <a href="mailto:bharat.sonant@gmail.com" style="color: #0073e6; text-decoration: none;">bharat.sonant@gmail.com</a>.
//                         </p>
//                     </div>
//                 </div>
//             </body>
//         </html>
//     `;
// }
export const sendEmployeeLoginCredentialsTemplate = (
    // companyName, 
    // companyCode, 
    employeeId, 
    password, 
    // loginUrl
) => {
    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to D2D PORTAL</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Congratulations! Your registration has been successfully completed on D2D PORTAL. Below are your Login credentials:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Code:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${employeeId}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Password:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${password}</td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color:#333">
                        You can use these credentials to log in and start using the application. If you did not register or believe this is an error, please contact our support team immediately.
                    </p>

                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0; margin-top: 20px;">
                        Best regards, <br>
                        <strong>IEC Team</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, feel free to contact us at <a href="mailto:bharat.sonant@gmail.com" style="color: #0073e6; text-decoration: none;">bharat.sonant@gmail.com</a>.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendFieldEmployeeLoginCredentialsTemplate = (companyName, companyCode, employeeId, password) => {
    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to ${companyName}</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Congratulations! Your registration has been successfully completed on ${companyName}. Below are your Login credentials:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Company Code:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${companyCode}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Code:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${employeeId}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Password:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${password}</td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color:#333">
                        You can use these credentials to log in and start using the application. If you did not register or believe this is an error, please contact our support team immediately.
                    </p>

                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0; margin-top: 20px;">
                        Best regards, <br>
                        <strong>${companyName} Team</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, feel free to contact us at <a href="mailto:bharat.sonant@gmail.com" style="color: #0073e6; text-decoration: none;">bharat.sonant@gmail.com</a>.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendChangePasswordTemplate = (companyName, companyCode, empCode, newPassword) => {
    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Password Changed Successfully</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear Employee,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Your password has been successfully updated for your ${companyName} account. Below are your updated login details:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Company Code:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${companyCode}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Code:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${empCode}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">New Password:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${newPassword}</td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Please use this new password to log in. For security reasons, we recommend changing your password periodically and not sharing it with anyone.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        If you did not request this password change, please contact our support team immediately.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${companyName} Team</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, feel free to contact us at <a href="mailto:support@${companyName.toLowerCase()}.com" style="color: #0073e6; text-decoration: none;">support@${companyName.toLowerCase()}.com</a>.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendModificationRequestTemplate = (companyName, empName, date, punchInTime, punchOutTime) => {
    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Request for Attendance Modification</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear sir,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        I hope this email finds you well. I am writing to formally request a modification to my attendance records. Below are the details of my request:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Name:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${empName}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${moment(date).format("DD MMM YYYY")}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Requested Punch-In Time:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${punchInTime}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Requested Punch-Out Time:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${punchOutTime}</td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        I kindly request your review and approval of this modification. Please let me know if any further details or clarifications are needed.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${empName}</strong><br>
                        <strong>${companyName}</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please feel free to reach out to me.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendLeaveRequestTemplate = (companyName, empName, fromDate, toDate, leaveType, reason) => {
    const isSingleDay = fromDate === toDate;
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Leave Request</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear Sir,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        I hope you are doing well. I would like to formally request leave as per the details below:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Name:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${empName}</td>
                        </tr>
                        ${isSingleDay ? `
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Leave Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedFromDate}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Leave Type:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${leaveType}</td>
                        </tr>
                        ` : `
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">From Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedFromDate}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">To Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedToDate}</td>
                        </tr>
                        `}
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6; vertical-align: top;">Reason:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0; word-wrap: break-word; max-width: 400px; line-height: 1.5;">${reason}</td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        I kindly request your approval for this leave. Please let me know if you require any additional information.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${empName}</strong> <br>
                        <strong>${companyName}</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please feel free to reach out.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendLeaveApprovalTemplate = (companyName, empName, fromDate, toDate, leaveType) => {
    const isSingleDay = fromDate === toDate;
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Leave Approved</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear ${empName},
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        We would like to inform you that your leave request has been <strong>approved</strong>.
                        Please find the details below:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Name:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${empName}</td>
                        </tr>
                        ${isSingleDay ? `
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Leave Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedFromDate}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Leave Type:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${leaveType}</td>
                        </tr>
                        ` : `
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">From Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedFromDate}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">To Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedToDate}</td>
                        </tr>
                        `}
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        We appreciate your understanding and support. If you have any concerns or require further clarification, please feel free to reach out.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${companyName}</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please feel free to reach out.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendLeaveRejectionTemplate = (companyName, empName, fromDate, toDate, leaveType, rejectionReason) => {
    const isSingleDay = fromDate === toDate;
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Leave Denied</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear ${empName},
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        We regret to inform you that your leave request has been <strong>denied</strong>.  
                        Please find the details below:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Employee Name:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${empName}</td>
                        </tr>
                        ${isSingleDay ? `
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Leave Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedFromDate}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Leave Type:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${leaveType}</td>
                        </tr>
                        ` : `
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">From Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedFromDate}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">To Date:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${formattedToDate}</td>
                        </tr>
                        `}
                         <tr>
                        <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Rejection Reason:</td>
                        <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #ff0000;">${rejectionReason}</td>
                    </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                         If you need further clarification, please feel free to reach out.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${companyName}</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please feel free to reach out.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendExpenseReportTemplate = (companyName, empName, fromDate, toDate, expenses, empCode) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expenseRows = expenses.map(expense => `
        <tr>
            <td style="font-size: 16px; padding: 10px; border-bottom: 1px solid #e0e0e0;">${expense.name}</td>
            <td style="font-size: 16px; padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${expense.amount}</td>
        </tr>
    `).join('');

    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Report Review Request</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear sir,</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        I hope this email finds you well. I am submitting my expense report for the period from 
                        <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong> for your review.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: left;">Expense Title</th>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenseRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #0073e6;">Total Amount</td>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #0073e6; text-align: right;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Kindly review the details and approve the reimbursement at your earliest convenience. Please let me know if you need any additional information or supporting documents.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${empName} [${empCode}]</strong><br>
                        ${companyName}
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please feel free to reach out.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendApprovedExpenseReportTemplate = (empName, fromDate, toDate, expenses) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expenseRows = expenses.map(expense => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${expense.title}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${expense.amount}</td>
        </tr>
    `).join('');

    return `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #28a745; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Report Approved</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear ${empName},</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Your expense report for the period <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong> has been approved.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: left;">Expense Title</th>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenseRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #28a745;">Total Amount</td>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #28a745; text-align: right;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        The reimbursement will be processed shortly. If you have any questions, please do not hesitate to contact us.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>Finance Department</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please contact support.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendRejectedExpenseReportTemplate = (empName, fromDate, toDate, expenses, rejectionReason) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expenseRows = expenses.map(expense => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${expense.title}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${expense.amount}</td>
        </tr>
    `).join('');

    return `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #dc3545; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Report Rejected</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear ${empName},</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Unfortunately, your expense report for the period <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong> has been reviewed and <strong>rejected</strong>.
                    </p>
                    <p style="font-size: 16px; color: #d9534f; font-weight: bold; margin-bottom: 20px;">
                        Reason for Rejection: ${rejectionReason}
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: left;">Expense Title</th>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenseRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #dc3545;">Total Amount</td>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #dc3545; text-align: right;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Please review the reason mentioned above and make necessary corrections before resubmitting your expense report. If you have any questions, feel free to reach out.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>Finance Department</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you need further clarification, please contact support.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendExpenseReimbursementToManager = (empName, fromDate, toDate, expenses) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expenseRows = expenses.map(expense => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${expense.title}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${expense.amount}</td>
        </tr>
    `).join('');

    return `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #007bff; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Reimbursement Request</h1>
                </div>
                <div style="padding: 30px; color: #333;">
                    <p style="font-size: 16px;">Dear Manager,</p>
                    <p style="font-size: 16px;">${empName} has submitted an expense reimbursement request for the period <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong>.</p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="padding: 10px; background-color: #f2f2f2; text-align: left;">Expense Title</th>
                                <th style="padding: 10px; background-color: #f2f2f2; text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenseRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-weight: bold; padding: 10px; border-top: 2px solid #007bff;">Total Amount</td>
                                <td style="font-weight: bold; padding: 10px; border-top: 2px solid #007bff; text-align: right;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="font-size: 16px;">Please review and approve the request at your earliest convenience.</p>
                    <br>
                    <p style="font-size: 16px;">Best regards, <br><strong>Finance Team</strong></p>
                </div>
            </div>
        </body>
    </html>`;
};

export const sendExpenseReimbursementToEmployee = (empName, fromDate, toDate, totalAmount) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    return `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #28a745; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Reimbursement Approved</h1>
                </div>
                <div style="padding: 30px; color: #333;">
                    <p style="font-size: 16px;">Dear ${empName},</p>
                    <p style="font-size: 16px;">Your expense reimbursement request for the period <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong> has been approved.</p>
                    <p style="font-size: 16px; font-weight: bold; color: #28a745;">Total Reimbursed Amount: ₹${totalAmount}</p>
                    <p style="font-size: 16px;">The amount will be credited to your account shortly.</p>
                    <br>
                    <p style="font-size: 16px;">Best regards, <br><strong>Finance Team</strong></p>
                </div>
            </div>
        </body>
    </html>`;
};

export const sendReviewedExpenseReportTemplate = (empName, fromDate, toDate, expenses) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expenseRows = expenses.map(expense => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${expense.title}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${expense.amount}</td>
        </tr>
    `).join('');

    return `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #28a745; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Report Reviewed</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear ${empName},</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Your expense report for the period <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong> has been reviewed.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: left;">Expense Title</th>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenseRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #28a745;">Total Amount</td>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #28a745; text-align: right;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        The approval will be processed shortly. If you have any questions, please do not hesitate to contact us.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>Finance Department</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please contact support.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendExpenseApprovalReportTemplate = (companyName, empName, fromDate, toDate, expenses, empCode, managerName, managerCode) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expenseRows = expenses.map(expense => `
        <tr>
            <td style="font-size: 16px; padding: 10px; border-bottom: 1px solid #e0e0e0;">${expense.title}</td>
            <td style="font-size: 16px; padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${expense.amount}</td>
        </tr>
    `).join('');

    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Report Approval Request</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear sir,</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        I hope this email finds you well. I have reviewed the expense report submitted by ${empName} [${empCode}] for the period from
                        <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong> for your approval.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: left;">Expense Title</th>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenseRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #0073e6;">Total Amount</td>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #0073e6; text-align: right;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Kindly review the details and approve the reimbursement at your earliest convenience. Please let me know if you need any additional information or supporting documents.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${managerName} [${managerCode}]</strong><br>
                        ${companyName}
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please feel free to reach out.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const sendExpenseReimburseReportTemplate = (companyName, empName, fromDate, toDate, expenses, empCode, managerName, managerCode) => {
    const formattedFromDate = moment(fromDate).format("DD MMM YYYY");
    const formattedToDate = moment(toDate).format("DD MMM YYYY");

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const expenseRows = expenses.map(expense => `
        <tr>
            <td style="font-size: 16px; padding: 10px; border-bottom: 1px solid #e0e0e0;">${expense.title}</td>
            <td style="font-size: 16px; padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${expense.amount}</td>
        </tr>
    `).join('');

    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Expense Report Reimburse Request</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Dear sir,</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        I hope this email finds you well. I have approved the expense report submitted by ${empName} [${empCode}] for the period from
                        <strong>${formattedFromDate}</strong> to <strong>${formattedToDate}</strong> for your approval.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: left;">Expense Title</th>
                                <th style="font-size: 16px; font-weight: bold; padding: 10px; background-color: #f2f2f2; text-align: right;">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expenseRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #0073e6;">Total Amount</td>
                                <td style="font-size: 16px; font-weight: bold; padding: 10px; border-top: 2px solid #0073e6; text-align: right;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Kindly review the details and approve the reimbursement at your earliest convenience. Please let me know if you need any additional information or supporting documents.
                    </p>
                    <br>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                        Best regards, <br>
                        <strong>${managerName} [${managerCode}]</strong><br>
                        ${companyName}
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, please feel free to reach out.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};









