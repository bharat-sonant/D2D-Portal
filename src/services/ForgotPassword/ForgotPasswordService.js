import * as common from '../../common/common'
import axios from "axios";
import { sendPasswordTemplate } from "../../common/emailHTMLTemplates/MailTemplates";
import { supabase } from '../../createClient';

export const sendPasswordToMail = async (to, companyCode, empCode, password, companyName) => {
    try {
        const url = common.MAILAPI;
        const subject = `Your Login Credentials for ${companyName} Application`;
        const htmlBody = sendPasswordTemplate(companyCode, empCode, password, companyName);
        const response = await axios.post(url, {
            to,
            subject,
            html: htmlBody,
        });
        console.log('response', response)

        return response.status === 200 ? "success" : "failure";
    } catch (error) {
      console.log('error in mail', error)
        throw error;
    }
}

export const forgotPasswordService = async(email) => {
  const normalisedEmail = email?.toLowerCase().trim();
  if(!normalisedEmail){
    common.setAlertMessage('Email is required');
  }
  const hashCode = common.generateHash(normalisedEmail);
  const {data, error} = await supabase.from("Users").select('*').eq("hashCode", hashCode).maybeSingle();
  console.log('data', data)
  if (error || !data) {
    common.setAlertMessage('error',"User not found");
    return;
  }

  if(data.status !== 'active'){
    common.setAlertMessage('error',"Your account is currently inactive");
    return;
  }

  const decryptedEmail = common.decryptValue(data.email);
  const decryptedPassword = common.decryptValue(data.password);

  await sendPasswordToMail(
    decryptedEmail,
    data.companyCode,
    data.empCode,
    decryptedPassword,
    data.companyName);

  return 'success';
}