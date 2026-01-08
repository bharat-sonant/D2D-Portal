import * as userServices from '../../services/UserServices/UserServices'
import * as common from "../../common/common";
import axios from 'axios';
import * as emailTemplate from '../../common/emailHTMLTemplates/MailTemplates'
import dayjs from 'dayjs';

export const validateUserDetail = (form, onEdit, editData, setNameError, setEmailError, setUserTypeError, setEmpCodeError, setLoading, loadUsers, resetStateValues) => {
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
  if (!form.user_type) {
    setUserTypeError("User Type is required");
    isValid = false;
  }
  if (form?.user_type === 'internal' && !form?.emp_code) {
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

    const createdBy = localStorage.getItem("name");
    let userDetail = {
      // username: form.username,
      hash_email: hashCode,
      is_superadmin: false,
      name: form?.name,
      email: encrptMail,
      status: "active",
      created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      created_by: createdBy,
      password: encrptpassword,
      user_type: form?.user_type,
      ...(form?.user_type === 'internal' && { emp_code: form?.emp_code }),
    };
    if (onEdit) {
      let updatedDetail = {
        // username: form?.username,
        hash_email: hashCode,
        name: form?.name,
        email: encrptMail,
        status: form?.status,
        password: form?.password,
        user_type: form?.user_type,
        emp_code: form?.user_type === 'internal' ? form?.emp_code : null,
      };
      handleUpdateUser(editData?.id, updatedDetail, setLoading, loadUsers, resetStateValues, setEmailError, setEmpCodeError)
    } else {
      handleSaveUser(userDetail, email, randomPasword, loginURL, setEmailError, setEmpCodeError, resetStateValues, loadUsers, setLoading);
    }

  }
};

export const handleSaveUser = async (userDetail, email, password, loginURL, setEmailError, setEmpCodeError, resetStateValues, loadUsers, setLoading) => {
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
      if (errMsg?.includes("email") || errMsg?.includes("hash_email")) {
        setEmailError("Email already exists!");
      } else if (errMsg?.includes("emp_code")) {
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
    const htmlBody = emailTemplate.sendEmployeeLoginCredentialsTemplate(email, password, loginURL);
    const response = await axios.post(url, { to: email, subject, html: htmlBody, });
    return response.status === 200 ? "success" : "failure";
  } catch (error) {
    throw error;
  }
};

const handleUpdateUser = async (userId, userDetail, setLoading, loadUsers, resetStateValues, setEmailError, setEmpCodeError) => {
  const response = await userServices.updateUserData(userId, userDetail);
  if (response.status === 'success') {
    resetStateValues();
    loadUsers();
    common.setAlertMessage("success", "User updated successfully");
  } else {
    setLoading(false);
    const errMsg = response?.error?.details || "";
    if (response?.error?.code === "23505") {
      if (errMsg?.includes("email") || errMsg?.includes("hash_email")) {
        setEmailError("Email already exists!");
      } else if (errMsg?.includes("emp_code")) {
        setEmpCodeError("Employee Code already exists!");
      } else {
        common.setAlertMessage("error", "Duplicate value exists!");
      }
    } else {
      common.setAlertMessage("error", "Something went wrong!");
    }
  }
};

export const fetchUserData = async (setSelectedUser, setUsers, setLoading, setActiveInactiveUserList) => {
  setLoading(true);
  let response = await userServices.getUserData()
  setLoading(false);
  if (response.status === 'success') {
    const sortedList = response.data.filter((item) => (item.status === 'active'))

    setSelectedUser(pre => {
      return sortedList.length > 0 ? (sortedList?.find(item => item?.id === pre?.id) || sortedList[0]) : null
    })
    setUsers(sortedList);
    setActiveInactiveUserList(response.data)
  } else {
    setSelectedUser(null);
    setUsers([]);
  }
};

export const updateStatus = async (user, setUsers, setActiveInactiveUserList, setSelectedUser, setConfirmUser) => {

  const newStatus = user.status === "active" ? "inactive" : "active";
  let response = await userServices.updateUserStatus(user.id, {
    status: newStatus,
  });



  if (response.status === "success") {
    setUsers((prev) => {
      const updatedList = prev.filter((u) => u.id !== user.id);
      return updatedList;
    });

    setActiveInactiveUserList((prev) => {
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

export const formValueChangeAction = (e, setForm) => {
  setForm(pre => ({ ...pre, [e.target.name]: e.target.value }));
};

export const filterUserListAction = (usersList, searchTerm, setSelectedUser) => {
  const term = searchTerm?.trim().toLowerCase();
  if (!term) {
    setSelectedUser(pre => usersList?.find(item => item?.id === pre?.id) || usersList[0] || null);
    return usersList;
  }
  let list = usersList?.filter((item) => item?.name?.trim().toLowerCase().includes(term));
  setSelectedUser(pre => list?.find(item => item?.id === pre?.id) || list[0] || null);
  return list;
};

export const handleApplyFilter = (activeInactiveUserList, setFilteredUsersList, statusFilter, userTypeFilter, setSelectedUser, setUsers) => {
  if (!activeInactiveUserList?.length) {
    setFilteredUsersList([]);
    return;
  }
  const filteredList = activeInactiveUserList.filter((user) => {
    const statusMatch =
      statusFilter === "all" || user.status === statusFilter;
    const typeMatch =
      userTypeFilter === "all" || user.user_type === userTypeFilter;
    return statusMatch && typeMatch;
  });
  setSelectedUser(filteredList[0]);
  setFilteredUsersList(filteredList);
  setUsers(filteredList)
};

export const loadCityData = async (setCityList) => {
  const response = await userServices.getCities();
  if (response.status === 'success') {
    setCityList(response.data);
  } else {
    setCityList([]);
  }
}

export const handleCityAccessToggle = async (userId, city_id, isCurrentlySelected, setSelectedCities) => {
  try {
    if (isCurrentlySelected) {

      setSelectedCities(prev => {
        const record = prev.find(c => c.city_id === city_id);
        if (!record) return prev;
        userServices.removeCityAccess(record.id);
        return prev.filter(c => c.city_id !== city_id);
      });

      common.setAlertMessage('success', 'User city access removed successfully.');

    } else {

      const payload = {
        user_id: userId,
        city_id: city_id,
        created_by: localStorage.getItem('name'),
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      const resp = await userServices.saveUserCityAccess(payload);
      if (resp.status === 'success') {

        if (resp?.data?.id) {
          setSelectedCities(prev => [
            ...prev,
            { id: resp.data.id, city_id }
          ]);
        };

        common.setAlertMessage('success', 'User city access saved successfully.');
      };
    };
  } catch (err) {
    console.error('City toggle failed:', err);
  };
};

export const handleGetCity = async (userId, setSelectedCities) => {
  try {
    const resp = await userServices.fetchUserCityAccess(userId);
    if (resp?.status === 'success') {
      setSelectedCities(resp.data.map(item => ({
        id: item.id,
        city_id: item.city_id
      }))
      );

    } else {
      setSelectedCities([]);
    }
  } catch (error) {
    console.error('handleGetCity error:', error);
    setSelectedCities([]);
  }
}