import * as userServices from '../../services/UserServices/UserServices'
import * as common from "../../common/common";
import axios from 'axios';
import * as emailTemplate from '../../common/emailHTMLTemplates/MailTemplates'
import dayjs from 'dayjs';

export const validateUserDetail = (form,onEdit,editData,setUserNameError,setNameError,setEmailError,setLoading,loadUsers,resetStateValues)=>{
     let isValid = true;
    setUserNameError("");
    setNameError("");
    setEmailError("");
    if (!form.username) {
      setUserNameError("User name is required");
      isValid = false;
    }
    if (!form.name) {
      setNameError("Name is required");
      isValid = false;
    }
    if (!form.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      !form.email.endsWith(".com")
    ) {
      setEmailError("Please enter a valid email ending with .com");
      isValid = false;
    } else {
      setEmailError("");
    }
    if(isValid){
           setLoading(true);
            let loginURL = "https://d2d-portal-qa.web.app";
            let randomPasword = common.generateRandomCode();
            let encrptpassword = common.encryptValue(randomPasword);
            let encrptMail = common.encryptValue(form.email);
            let userDetail = {
              username: form.username,
              name: form.name,
              email: encrptMail,
              status:"active",
              created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              password: encrptpassword, 
            };
            if (onEdit) {
                    let updatedDetail = {
                      username: form.username,
                      name: form.name,
                      email: encrptMail,
                      status: form.status,
                      created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                      password: form.password,
                    };
                    handleUpdateUser(editData.id,updatedDetail,setLoading,loadUsers,resetStateValues)
                  }else{
                  handleSaveUser(form.email,form.username,randomPasword,loginURL,setUserNameError,setEmailError,userDetail,resetStateValues,loadUsers,setLoading)
                  }
           
    }
}

export const handleSaveUser = async (email,username,password,loginURL,setUserNameError,setEmailError,userDetail,resetStateValues,loadUsers,setLoading) => {
  const response = await userServices.saveUserData(userDetail);

  if (response.status==='success') {
    await sendLoginCredentialsToEmploye(email,username,password,loginURL)
    resetStateValues();
    loadUsers();
    common.setAlertMessage("success", "User created successfully");
  } else {
    setLoading(false);
    const errMsg = response.message.details || "";
    if (response.message?.code === "23505"){
      if (errMsg.toLowerCase().includes("username")) {
        setUserNameError("Username already exists!");
      } else if (errMsg.toLowerCase().includes("email")) {
        setEmailError("Email already exists!");
      } else {
        common.setAlertMessage("error", "Duplicate value exists!");
      }
    } else {
      common.setAlertMessage("error", "Something went wrong!");
    }
  }
};

 const sendLoginCredentialsToEmploye = async (email,username,password,loginURL) => {
    try {
      const url = common.MAILAPI;
      const subject = "D2D Portal Login Credentials";
      const htmlBody = emailTemplate.sendEmployeeLoginCredentialsTemplate(username,password,loginURL);
      const response = await axios.post(url, {to: email,subject,html: htmlBody,});
      return response.status === 200 ? "success" : "failure";
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const handleUpdateUser =async (userId,userDetail,setLoading,loadUsers,resetStateValues)=>{
      const response = await userServices.updateUserData(userId,userDetail);
  if (response.status==='success') {
    resetStateValues();
    loadUsers();
    common.setAlertMessage("success", "User created successfully");
  } else {
    setLoading(false);
  }
  }


 export const fetchUserData = async (setSelectedUser,setUsers)=>{
     let response = await userServices.getUserData()
     if(response.status==='success'){
       
       const sortedList = response.data.sort((a, b) => {
  if (a.status === "inactive" && b.status !== "inactive") return 1;
  if (a.status !== "inactive" && b.status === "inactive") return -1;
  return 0;
});
     setSelectedUser(sortedList[0])
       setUsers(sortedList);
     }else{
       setSelectedUser(null)
       setUsers([]);
     }
  }


  export const updateStatus = async (user,setUsers,setSelectedUser,setConfirmUser) => {

  const newStatus = user.status === "active" ? "inactive" : "active";
  let response = await userServices.updateUserStatus(user.id, {
    status: newStatus,
  });

  if (response.status === "success") {
    setUsers((prev) => {
      const updatedList = prev.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      );

      // 👇 inactive users ko bottom me bhejo
      return updatedList.sort((a, b) => {
  // 1️⃣ pehle status ke basis par (inactive last)
  if (a.status !== b.status) {
    return a.status === "inactive" ? 1 : -1;
  }

  // 2️⃣ same status wale users name ke basis par A–Z
  return a.name.localeCompare(b.name);
});

    });

    setSelectedUser({
      ...user,
      status: newStatus,
    });

    setConfirmUser(false);
    common.setAlertMessage("success", "User status updated successfully");
  } else {
    common.setAlertMessage("error", "Something went wrong!");
  }
};

  