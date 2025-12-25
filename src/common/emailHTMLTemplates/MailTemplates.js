export const sendEmployeeLoginCredentialsTemplate = (email,password, loginUrl) => {
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

          <div style="padding: 15px; background: #f0f0f0; text-align: center;">
            <p style="font-size: 12px; color: #777777; margin: 0;">
              This is an automated message. Please do not reply.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
};
