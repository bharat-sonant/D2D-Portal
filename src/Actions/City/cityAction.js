import dayjs from "dayjs";
import * as common from "../../common/common";
import * as cityService from "../../services/CityService/cityServices"


export const saveCityAction = async (form, logo, props, setLoading, setCityError, setCityCodeError, resetStateValues, setLogoError) => {
    let isValid = true;
    setCityError("");
    setCityCodeError("");
    if (!form?.city_code?.trim()) {
        setCityCodeError("Site code is required");
        isValid = false;
    }
    if (!form?.city_name?.trim()) {
        setCityError("Site name is required");
        isValid = false;
    }
    if (!logo && !props?.onEdit && !props?.onEdit?.logo_image) {
        setLogoError("Site logo is required");
        isValid = false;
    }
    if (isValid) {
        setLoading(true);
        let loggedUserName = localStorage.getItem("name");
        let cityDetail = {
            city_code: form?.city_code?.trim(),
            city_name: form?.city_name?.trim(),
            status: form?.status,
            created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            created_by: loggedUserName
        }

        try {
            await cityService.saveCityData(cityDetail, logo, props?.onEdit?.city_id);
            resetStateValues();
            props.loadCities();
            common.setAlertMessage("success", !props?.onEdit ? "Site added successfully" : "Site updated successfully");
        } catch (err) {
            setLoading(false);
            if (err?.code === "23505") {
                if (err?.details?.includes("city_code")) {
                    setCityCodeError("Site code already exists!");
                    return;
                }
                if (err?.details?.includes("city_name")) {
                    setCityError("Site name already exists!");
                    return;
                }
                else {
                    common.setAlertMessage("error", "Duplicate value exists!");
                }
            } else {
                common.setAlertMessage("error", "Something went wrong!");
            }
        }
    }
}

export const getCityList = async (setSelectedCity, setCityList, selectedCity, setWardList, setLoading,setSelectedWard) => {
    setLoading(true)
    const response = await cityService.getCityData();
    if (response.status === 'success') {
        let currentSelected = response.data?.find(item => item?.city_id === selectedCity?.city_id);
        setSelectedCity(currentSelected || response.data[0]);
        getwardList(response.data[0]?.city_id, setWardList,setSelectedWard)
        setCityList(response.data);
        setLoading(false)
    } else {
        setSelectedCity(null)
        setCityList([]);
        setLoading(false)
    }
}

export const changeCityStatusAction = async (newStatus, selectedCity, setToggle, loadCities, setStatusConfirmation) => {

    if (!selectedCity) return;
    try {

        await cityService.updateCityStatus(selectedCity?.city_id, newStatus);
        setToggle(newStatus);
        setStatusConfirmation({ status: false, data: null, setToggle: () => { } })
        loadCities()
        common.setAlertMessage("success", `Site status ${newStatus ? 'active' : 'inactive'} successfully.`);
    }
    catch (error) {
        console.error(error);
        common.setAlertMessage("error", error);
    }
}
export const filterCityAction = (cityList, searchTerm, setSelectedCity, selectedCity) => {
    const term = searchTerm?.trim().toLowerCase();
    if (!term) {
        let currentSelected = cityList?.find(item => item?.city_id === selectedCity?.city_id);
        setSelectedCity(currentSelected || cityList[0] || null);
        return cityList;
    }
    let list = cityList?.filter((item) => item?.city_name?.trim().toLowerCase().includes(term));
    let currentSelected = list?.find(item => item?.city_id === selectedCity?.city_id);

    setSelectedCity(currentSelected || list[0] || null);

    return list;
}



export const saveWardAction = async (form, cityId, wardId, setLoading, setWardNumberError, resetStateValues, setWardList, setDisplayNameError, wardList,setSelectedWard,setOnEdit) => {
    let isValid = true;
    setWardNumberError("");
    setDisplayNameError(""); // Reset display name error

    if (!form?.Ward?.trim()) {
        setWardNumberError("Ward name is required");
        isValid = false;
    }
    if (!form?.display_name?.trim()) {
        setDisplayNameError("Display name is required");
        isValid = false;
    }

    // Client-side Duplicate Validation
    if (isValid && wardList && wardList.length > 0) {
        const lowerWardName = form.Ward.trim().toLowerCase();
        const lowerDisplayName = form.display_name.trim().toLowerCase();

        const duplicateName = wardList.find(w =>
            w.name?.toLowerCase() === lowerWardName &&
            w.id !== wardId // Exclude current ward if editing
        );

        if (duplicateName) {
            setWardNumberError("Ward name already exists!");
            isValid = false;
        }

        if (isValid) { // distinct check to show one error at a time or both
            const duplicateDisplayName = wardList.find(w =>
                w.display_name?.toLowerCase() === lowerDisplayName &&
                w.id !== wardId
            );
            if (duplicateDisplayName) {
                setDisplayNameError("Display name already exists!");
                isValid = false;
            }
        }
    }

    if (isValid) {
        setLoading(true);
        let wardDetail = {
            name: form?.Ward?.trim(),
            display_name: form?.display_name?.trim(),
            city_Id: cityId,
            created_At: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            created_By: localStorage.getItem('name'),
            ...(!wardId && { show_realtime: 'Yes' })
        }

        try {
            let response = await cityService.saveCityWiseWardData(wardDetail, wardId)
            if (response.duplicatefound) {
                setWardNumberError(response.msg); // Or handle specifically if duplication is on display_name? Assuming generic dup check msg
                setLoading(false);
                return;
            }
            getwardList(cityId, setWardList,setSelectedWard)
            resetStateValues();
            const message = wardId ? "Ward updated successfully" : "Ward added successfully";
            common.setAlertMessage("success", message);

        } catch (err) {
            setLoading(false);
            if (err?.code === "23505") {
                if (err?.details?.includes("CityCode")) {
                    setWardNumberError("City code already exists!"); // Keep existing legacy check if applicable
                    return;
                }
                else {
                    common.setAlertMessage("error", "Duplicate value exists!");
                }
            } else {
                common.setAlertMessage("error", "Something went wrong!");
            }
        }
        finally{
            setOnEdit(false)
        }
    }
}


export const getwardList = async (city_Id, setWardList,setSelectedWard) => {
    
    let response = await cityService.getCityWisewardList(city_Id)
    if (response.status === 'success') {
        let wardData = sortWardsByRealtimeStatus(response.data)
        setSelectedWard(wardData[0])
        setWardList(wardData)
    } else {
        setWardList([])
    }
}

export const updateWardRealTimeStatusAction = async (wardId, realTimeStatus, setWardList) => {
    let newStatus = { show_realtime: realTimeStatus === 'Yes' ? 'No' : 'Yes' }
    let response = await cityService.updateWardRealTimeStatus(wardId, newStatus)
    if (response.status === 'success') {
        setWardList(prevList => prevList.map(ward => ward.id === wardId ? { ...ward, show_realtime: newStatus.show_realtime } : ward));
        common.setAlertMessage("success", "Ward status updated successfully");
    }
}

export const sortWardsByRealtimeStatus = (wardList = []) => {
    if (!Array.isArray(wardList)) return [];
    const nameSorted = [...wardList].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
    return nameSorted;
};
