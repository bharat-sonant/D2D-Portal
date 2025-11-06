import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import { toast } from "react-toastify";

const secretKey = "12345";

export const MAILAPI =
  "https://us-central1-wevois-dev.cloudfunctions.net/api/send-email";
// export const MAILAPI = 'http://127.0.0.1:5001/wevois-dev/us-central1/api/send-email';

export const getCurrentDateTimeWithAMPM = () => {
  return moment().format("YYYY-MM-DD hh:mm A");
};

export const getCurrentDate = () => {
  let date = moment(new Date()).format("YYYY-MM-DD");
  let year = moment().format("YYYY");
  let month = moment().format("MMMM");
  return { date, month, year };
};

export const getWeekday = (dateString) => {
  const options = { weekday: "long" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const getLocalTime = () => {
  const phoneTime = moment(new Date()).format("HH:mm");
  return phoneTime;
};

export const getStorageCity = () => {
  let city = localStorage.getItem("city");
  let cityName = "";
  if (city == "DevTest") {
    cityName = "DevTest"
  }
  return cityName;

}

export const getCurrentMonthName = (monthNumber) => {
  var d = new Date();
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  if (monthNumber !== undefined) {
    return month[monthNumber - 1];
  } else {
    return month[d.getMonth()];
  }
};

export const getMonthCode = (monthName) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = months.indexOf(monthName);
  return monthIndex; // Returns the index of the month (0 for January, 1 for February, etc.)
};

export const convertDataUrlToBlob = (dataUrl) => {
  const [metadata, base64Data] = dataUrl.split(",");
  const mimeType = metadata.split(";")[0].split(":")[1];
  const binaryData = atob(base64Data);
  const len = binaryData.length;
  const arrayBuffer = new ArrayBuffer(len);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeType });
};

export const getMonthNumber = (monthName) => {
  if (!monthName) return '';
  const months = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };
  return months[monthName] || '';
};

export const setAlertMessage = (type, message) => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const commonOptions = {
    position: isMobile ? "bottom-center" : "bottom-left",
    style: {
      fontSize: "14px",
      fontFamily: "Graphik-regular",
      fontWeight: "normal",
      color: "#333333",
      marginBottom: isMobile ? "20px" : "0px",
      marginLeft: isMobile ? "auto" : "0px",
      marginRight: isMobile ? "auto" : "0",
      // width: 'auto',
      // minWidth: '70px',
      width: isMobile ? "85%" : "450px",
    },
  };

  if (type === "error") {
    toast.error(message, commonOptions);
  } else if (type === "warn") {
    toast.warn(message, commonOptions);
  } else {
    toast.success(message, {
      ...commonOptions,
      toastStyle: {
        background: "#ffa500",
        color: "white",
      },
    });
  }
};

export function generateRandomCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join("");

  const randomDigits = Array.from({ length: 3 }, () =>
    digits.charAt(Math.floor(Math.random() * digits.length))
  ).join("");

  return randomLetters + randomDigits;
}

export function encryptValue(value) {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
}

export function decryptValue(value) {
  const bytes = CryptoJS.AES.decrypt(value, secretKey);
  const plainText = bytes.toString(CryptoJS.enc.Utf8);
  return plainText;
}

export function setResponse(status, message, data) {
  const obj = {
    status: status,
    message: message,
    data: data,
  };
  return obj;
}

export const getGlobalTime = async () => {
  try {
    const response = await axios.get(
      `https://us-central1-office-management-623ad.cloudfunctions.net/globalTime?timestamp=${Date.now()}`
    );

    if (!response?.data) {
      alert("Unable to connect to the server. Please try again later.");
      return null;
    }

    const globalTime = response.data.currentTime.split("T")[1].split(".")[0];
    const formattedTime = globalTime.substr(0, 5);
    const serverDate = response.data.currentTime.split("T")[0];
    const localDate = moment(new Date()).format("YYYY-MM-DD");

    if (serverDate !== localDate) {
      alert(
        `Your system date is incorrect. Server date is ${moment(
          serverDate
        ).format("DD-MMMM-YYYY")}. Please update your system date.`
      );
      return null;
    }

    return {
      status: "success",
      data: { time: formattedTime, date: serverDate },
    };
  } catch (error) {
    console.error("Error fetching global time: - common.js:217", error.message);
    return null;
  }
};

export const getCurrentLocation = async (setIsLocationVisible) => {
  const fallbackCoords = { lat: 0.0, lng: 0.0 };

  try {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported by this browser. - common.js:227");
      alert("Geolocation is not supported by this browser.");
      return { status: "error", data: fallbackCoords };
    }

    // Optional: check permissions if supported
    if ("permissions" in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

        if (permissionStatus.state === "denied") {
          console.warn("Location permission is denied. - common.js:238");
          setIsLocationVisible(true);
          return { status: "error", data: fallbackCoords };
        }
      } catch (permErr) {
        console.warn("Permissions API check failed: - common.js:243", permErr.message);
        // Continue anyway, not a blocker
      }
    }

    // Get current position
    const locationPromise = new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            status: "success",
            data: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error("Error getting location: - common.js:261", error.message);
          setIsLocationVisible(true);
          resolve({ status: "error", data: fallbackCoords });
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
      );
    });

    return await locationPromise;
  } catch (error) {
    console.error("Unexpected error getting location: - common.js:271", error.message);
    setIsLocationVisible(true);
    return { status: "error", data: fallbackCoords };
  }
};

export const validCompanyAndUsername = (name) => {
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(name);
};

export const calculateTotalWorkingHrs = (inTime, outTime) => {
  if (!inTime || !outTime) {
    return "00:00";
  }

  const inTimeMoment = moment(inTime, ["hh:mm A", "HH:mm"]);
  const outTimeMoment = moment(outTime, ["hh:mm A", "HH:mm"]);

  const timeDifferenceMinutes = outTimeMoment.diff(inTimeMoment, "minutes");
  const adjustedTimeDifferenceMinutes =
    timeDifferenceMinutes < 0
      ? timeDifferenceMinutes + 24 * 60
      : timeDifferenceMinutes;
  const hours = Math.floor(adjustedTimeDifferenceMinutes / 60);
  const minutes = adjustedTimeDifferenceMinutes % 60;

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return timeString;
};

export function returnResponse(status, data) {
  const obj = {
    status: status,
    data: data,
  };
  return obj;
}

export const getDayOfSpecificDate = (date) => {
  let dateObj = new Date(date);
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayOfWeekIndex = dateObj.getDay();
  let dayOfWeek = daysOfWeek[dayOfWeekIndex];
  return dayOfWeek;
};

export const parseDate = (dateString) => {
  const [day, month, year] = dateString.split(" ");
  const monthsMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  return new Date(year, monthsMap[month], day);
};

export const getTotalExperience = (doj) => {
  if (!doj) return "Invalid Date";

  const joiningDate = new Date(doj);
  const currentDate = new Date();

  if (isNaN(joiningDate)) return "Invalid Date";

  const diffInMs = currentDate - joiningDate;

  const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  let experience = "";

  if (years > 0) {
    experience += `${years} Year${years > 1 ? "s" : ""} `;
  }

  if (months > 0) {
    experience += `${months} Month${months > 1 ? "s" : ""} `;
  }

  if (days > 0) {
    experience += `${days} Day${days > 1 ? "s" : ""}`;
  }

  return experience.trim();
};

export function base64ToBlob(base64Data, contentType = '') {
  try {
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType || 'image/jpeg' });
  }
  catch (error) {
    console.error('Error in Blob conversion : - common.js:402', error);
    return null;
  }

}

export const getCityDetailsJSON = () => {
  return new Promise(async(resolve) => {
    let url = "https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/"+ "CityDetails%2FCityDetails.json?alt=media";
    await axios.get(url).then((response) => {
      if (response != null) {
        resolve(response.data);
      }
      else {
        resolve([]);
      }
    }).catch((error) => {
      console.log('Error in getCityDetailsJSON', error);
      resolve([]);
    });
  });
}