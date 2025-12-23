import * as userServices from '../../services/UserServices/UserServices'
import * as common from "../../common/common";
import axios from 'axios';
import * as emailTemplate from '../../common/emailHTMLTemplates/MailTemplates'
import dayjs from 'dayjs';

export const validateUserDetail = (form, onEdit, editData, setNameError, setEmailError,setUserTypeError,setEmpCodeError, setLoading, loadUsers, resetStateValues) => {
  let isValid = true;
  setNameError("");
  setEmailError("");
  setUserTypeError("");
  setEmpCodeError("");
  // if (!form.username) {
  //   setUserNameError("User name is required");
  //   isValid = false;
  // }
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
  if (!form.userType) {
    setUserTypeError("User Type is required");
    isValid = false;
  }
  if (form?.userType === 'internal' && !form?.empCode) {
    setEmpCodeError("Employee Code is required for internal users");
    isValid = false;
  }
  if (isValid) {
    setLoading(true);
    let loginURL = "https://d2d-portal-qa.web.app";
    let randomPasword = common.generateRandomCode();
    let encrptpassword = common.encryptValue(randomPasword);
    let email = form.email?.toLowerCase();
    let encrptMail = common.encryptValue(email);
    let hashCode = common.generateHash(email);

    const createdBy = localStorage.getItem("Name");
    let userDetail = {
      // username: form.username,
      hashCode: hashCode,
      name: form?.name,
      email: encrptMail,
      status: "active",
      created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      created_by: createdBy,
      password: encrptpassword,
      userType: form?.userType,
      ...(form?.userType === 'internal' && { empCode: form?.empCode}),
    };
    if (onEdit) {
      let updatedDetail = {
        // username: form?.username,
        hashCode: hashCode,
        name: form?.name,
        email: encrptMail,
        status: form?.status,
        password: form?.password,
        userType: form?.userType,
        empCode: form?.userType === 'internal'?form?.empCode:null,
      };
      handleUpdateUser(editData?.id, updatedDetail, setLoading, loadUsers, resetStateValues,setEmailError,setEmpCodeError)
    } else {
      handleSaveUser(userDetail, email, randomPasword, loginURL, setEmailError, setEmpCodeError, resetStateValues, loadUsers, setLoading);
    }

  }
}
export const handleSaveUser = async (userDetail,email, password, loginURL, setEmailError,setEmpCodeError, resetStateValues, loadUsers, setLoading) => {
  const response = await userServices.saveUserData(userDetail);
  if (response?.status === 'success') {
    await sendLoginCredentialsToEmploye(email, password, loginURL)
    resetStateValues();
    loadUsers();
    common.setAlertMessage("success", "User created successfully");
  } else {
    setLoading(false);
    const errMsg = response?.message?.details || "";
    if (response.message?.code === "23505") {
      if (errMsg?.includes("email") || errMsg?.includes("hashCode")) {
        setEmailError("Email already exists!");
      } else if (errMsg?.includes("empCode")) {
        setEmpCodeError("Employee Code already exists!");
      } else {
        common.setAlertMessage("error", "Duplicate value exists!");
      }
    } else {
      common.setAlertMessage("error", "Something went wrong!");
    }
  }
};
const sendLoginCredentialsToEmploye = async (email, password, loginURL) => {
  try {
    const url = common.MAILAPI;
    const subject = "D2D Portal Login Credentials";
    const htmlBody = emailTemplate.sendEmployeeLoginCredentialsTemplate(password, loginURL);
    const response = await axios.post(url, { to: email, subject, html: htmlBody, });
    return response.status === 200 ? "success" : "failure";
  } catch (error) {
    throw error;
  }
};
const handleUpdateUser = async (userId, userDetail, setLoading, loadUsers, resetStateValues,setEmailError,setEmpCodeError) => {
  const response = await userServices.updateUserData(userId, userDetail);
  if (response.status === 'success') {
    resetStateValues();
    loadUsers();
    common.setAlertMessage("success", "User updated successfully");
  } else {
    setLoading(false);
    const errMsg = response?.error?.details || "";
    if (response?.error?.code === "23505") {
      if (errMsg?.includes("email") || errMsg?.includes("hashCode")) {
        setEmailError("Email already exists!");
      } else if (errMsg?.includes("empCode")) {
        setEmpCodeError("Employee Code already exists!");
      } else {
        common.setAlertMessage("error", "Duplicate value exists!");
      }
    } else {
      common.setAlertMessage("error", "Something went wrong!");
    }
  }
}
export const fetchUserData = async (setSelectedUser, setUsers) => {
  let response = await userServices.getUserData()
  if (response.status === 'success') {

    const sortedList = response.data.sort((a, b) => {
      if (a.status === "inactive" && b.status !== "inactive") return 1;
      if (a.status !== "inactive" && b.status === "inactive") return -1;
      return 0;
    });
    setSelectedUser(pre=>{
      return sortedList.length>0 ? (sortedList?.find(item=>item?.id===pre?.id) || sortedList[0] ): null
    })
    setUsers(sortedList);
  } else {
    setSelectedUser(null);
    setUsers([]);
  }
}
export const updateStatus = async (user, setUsers, setSelectedUser, setConfirmUser) => {

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
export const formValueChangeAction=(e,setForm)=>{
  setForm(pre=>({ ...pre, [e.target.name]: e.target.value }));
}
export const filterUserListAction=(usersList,searchTerm,setSelectedUser)=>{
    const term = searchTerm?.trim().toLowerCase();
    if (!term) {
        setSelectedUser(pre=>usersList?.find(item=>item?.id===pre?.id) || usersList[0] || null);
        return usersList;
    }
    let list = usersList?.filter((item) => item?.name?.trim().toLowerCase().includes(term));
    setSelectedUser(pre=>list?.find(item=>item?.id===pre?.id) || list[0] || null);
    return list;
}