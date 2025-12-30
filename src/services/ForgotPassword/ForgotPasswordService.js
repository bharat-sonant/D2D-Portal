import * as common from '../../common/common'
import axios from "axios";
import { sendPasswordTemplate } from "../../common/emailHTMLTemplates/MailTemplates";
import { supabase } from '../../createClient';

export const sendPasswordToMail = async (to, password) => {
    try {
        const url = common.MAILAPI;
        const subject = `Your Login Credentials for D2D Portal`;
        const htmlBody = sendPasswordTemplate( password);
        const response = await axios.post(url, {
            to,
            subject,
            html: htmlBody,
        });

        return response.status === 200 ? "success" : "failure";
    } catch (error) {
        throw error;
    }
}

export const forgotPasswordService = async(email, setEmailError) => {
  const normalisedEmail = email?.toLowerCase().trim();

  const hashCode = common.generateHash(normalisedEmail);
  const {data, error} = await supabase.from("Users").select('*').eq("hashCode", hashCode).maybeSingle();
  if (error || !data) {
    setEmailError("Email not registered !")
    return;
  }

  if(data.status !== 'active'){
    setEmailError("Your account is currently inactive.");
    return;
  }


  const decryptedEmail = common.decryptValue(data.email);
  const decryptedPassword = common.decryptValue(data.password);

  const mailResult = await sendPasswordToMail(
    decryptedEmail,
    decryptedPassword,);

     if (mailResult !== "success") {
      common.setAlertMessage("error", "Failed to send email. Try again later.");
      return;
    }

    return "success";
}