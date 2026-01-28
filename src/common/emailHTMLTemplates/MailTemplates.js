
export const sendEmployeeLoginCredentialsTemplate = (email, password, loginUrl) => {
    return `
    <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #0073e6; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome to WeVOIS Labs Pvt Ltd</h1>
                </div>
                <div style="padding: 30px; color: #333; text-align: left;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Congratulations! Your registration has been successfully completed on D2D Portal . Below are your Login credentials:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Email Id:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${email}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">Password:</td>
                            <td style="font-size: 16px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${password}</td>
                        </tr>
                    </table>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color:#333">
                        You can use these credentials to log in and start using the application. If you did not register or believe this is an error, please contact our support team immediately.
                    </p>

                    <!-- Login Button -->
                    <div style="text-align: center; margin-top: 20px;">
                     <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                       Click on the <strong>Login</strong> button below to access your account.
                    </p>
                        <a href="${loginUrl}" style="background-color:rgb(41, 182, 243); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px; display: inline-block;">
                            Login
                        </a>
                    </div>

                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0; margin-top: 20px;">
                        Best regards, <br>
                        <strong> WeVOIS Team</strong>
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

export const sendPasswordTemplate = (password) => {
    return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          
          <div style="padding: 20px; background-color: #0073e6; border-bottom: 1px solid #e0e0e0; text-align: center;">
            <h2 style="margin: 0; color: #ffffff;">Password Recovery</h2>
          </div>

          <div style="padding: 25px; color: #333333;">
            <p style="font-size: 15px; line-height: 1.6;">
              Hello,
            </p>

            <p style="font-size: 15px; line-height: 1.6;">
              We received a request to recover your account password. Your current password is:
            </p>

            <div style="margin: 20px 0; padding: 15px; background: #eef6ff; border: 1px solid #cfe2ff; border-radius: 4px; text-align: center;">
              <span style="font-size: 18px; font-weight: bold; color: #000000;">
                ${password}
              </span>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #555555;">
              For security reasons, please change your password immediately after logging in.
            </p>

            <p style="font-size: 14px; line-height: 1.6; color: #555555;">
              If you did not request this password recovery, please contact support immediately.
            </p>

            <p style="font-size: 14px; margin-top: 25px;">
              Regards,<br/>
              <strong>WeVOIS Support Team</strong>
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

export const sendChangePasswordTemplate = (empCode, newPassword) => {
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
                        Your password has been successfully updated for your WeVOIS Labs Pvt. Ltd. account. Below are your updated login details:
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        
                        <tr>
                            <td style="font-size: 16px; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #0073e6;">User Name:</td>
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
                        <strong>WeVOIS Labs Pvt. Ltd. Team</strong>
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                    <p style="font-size: 12px; color: #888; margin: 0;">
                        If you have any questions, feel free to contact us at <a href="mailto:support@wevois.com" style="color: #0073e6; text-decoration: none;">support@wevois.com</a>.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
};

export const getFEAppLoginCredentialMailContent = async () => {
    return `
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 600px;">
                    
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #004d40 0%, #00796b 100%); padding: 50px 20px;">
                            <div style="margin-bottom: 25px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
                                    <tr>
                                        <td align="center" style="
                                            background-color: #ffffff; 
                                            width: 85px; 
                                            height: 85px; 
                                            border-radius: 50%; 
                                            border: 4px solid #4db6ac; 
                                            box-shadow: 0 6px 15px rgba(0,0,0,0.2);
                                            vertical-align: middle;
                                        ">
                                            <div style="
                                                border: 1px dashed #00796b; 
                                                border-radius: 50%; 
                                                margin: 4px; 
                                                height: 67px; 
                                                line-height: 67px;
                                            ">
                                                <span style="
                                                    color: #004d40; 
                                                    font-size: 32px; 
                                                    font-weight: 900; 
                                                    font-family: 'Arial Black', sans-serif; 
                                                    display: block;
                                                    letter-spacing: -1.5px;
                                                ">FE</span>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <h1 style="color: #ffffff; font-size: 24px; margin: 0; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">FIELD EXECUTIVE</h1>
                            <div style="width: 40px; height: 3px; background-color: #4db6ac; margin: 15px auto;"></div>
                            <p style="color: #E8F5E9; font-size: 14px; margin: 5px 0 0 0; opacity: 0.9; letter-spacing: 0.5px;">Smart Operations by WeVOIS Labs</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px; color: #333333;">
                            <h2 style="font-size: 22px; margin-bottom: 20px; color: #004d40;">Hello {{name}},</h2>
                            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px;">
                                Welcome to the team! Your access to the <strong>Field Executive Mobile App</strong> has been activated. Please use the secure credentials below to log in.
                            </p>
                            
                            <div style="background-color: #f0fdfa; border: 1px dashed #00796b; padding: 30px; border-radius: 12px; text-align: left;">
                                <p style="margin: 0 0 15px 0; font-size: 13px; font-weight: bold; color: #00796b; text-transform: uppercase; letter-spacing: 1px;">Login Credentials</p>
                                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 15px; color: #666; width: 100px;"><strong>User ID :</strong></td>
                                        <td style="padding: 8px 0; font-size: 16px; color: #000; font-family: monospace;"><strong>{{userName}}</strong></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 15px; color: #666; width: 100px;"><strong>Password :</strong></td>
                                        <td style="padding: 8px 0; font-size: 16px; color: #000; font-family: monospace;"><strong>{{password}}</strong></td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 30px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
                           <p style="font-size: 13px; color: #666; margin: 0;">
                            Need assistance?
                            <a href="mailto:support@wevois.com" style="color: #00796b; text-decoration: none; font-weight: bold;">
                                 Contact Support
                            </a>
                                    </p>

                            <p style="font-size: 11px; color: #999; margin-top: 20px;">&copy; 2026 WeVOIS Labs Pvt Ltd. | Confidential</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};