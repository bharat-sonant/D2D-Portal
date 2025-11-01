import styles from "../../../src/assets/css/modal.module.css";
import * as addTaskAction from "../../actions/Task/AddTaskAction";
import { act, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import "../Task/AddTask.css";
import { getCitiesData } from "../../services/City/CityService";

const AddTask = ({
  show,
  onClose,
  data,
  setData,
  isEditing,
  setIsEditing,
  editTaskData,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [cityError, setCityError] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const empCode = "JAI482";
  const [cities, setCities] = useState([]);

// 1️⃣ Fetch cities on mount
useEffect(() => {
  const fetchCities = async () => {
    try {
      const result = await getCitiesData();
      const fetchedCities = result?.data || [];

      const activeCities = fetchedCities.filter((city)=>Number(city.status) === 1)
      console.log('fetched', activeCities)
      setCities(activeCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  fetchCities();
}, []);

useEffect(() => {
  if (!isEditing || !editTaskData || cities.length === 0) return;

  setTitle(editTaskData.title || "");
  setDescription(editTaskData.description || "");

  if (editTaskData.cities === null) {
    // All cities selected
    setSelectAll(true);
    setSelectedCities(cities.map((c) => c.id));
  } else if (editTaskData.cities) {
    // Convert to string array
    const cityIds = editTaskData.cities
      .split(",")
      .map((id) => id.trim()) // remove spaces
      .filter((id) => id); // remove empty strings
    setSelectedCities(cityIds);
    setSelectAll(cityIds.length === cities.length);
  } else {
    setSelectedCities([]);
    setSelectAll(false);
  }
}, [isEditing, editTaskData, cities]);


  const handleInputChange = (type, value) => {
    addTaskAction.validateFields(
      type,
      value,
      setTitle,
      setTitleError,
      setDescription,
      setDescriptionError
    );
  };

  const handleSave = () => {
    addTaskAction.handleSaveTaskData(
      empCode,
      title,
      description,
      selectedCities,
      selectAll,
      setTitleError,
      setDescriptionError,
      setCityError,
      clearFormData,
      setIsLoading,
      data,
      setData,
      isEditing,
      editTaskData
    );
  };

  const clearFormData = () => {
    addTaskAction.handleClearFormData(
      setTitle,
      setTitleError,
      setDescription,
      setDescriptionError,
      setSelectedCities,
      setCityError,
      setSelectAll
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCities([]);
      setSelectAll(false);
    } else {
      setSelectedCities(cities.map((c) => c.id));
      setSelectAll(true);
    }
    setCityError("");
  };

  const handleCityToggle = (cityId) => {
    let updated;
    if (selectedCities.includes(cityId)) {
      updated = selectedCities.filter((id) => id !== cityId);
    } else {
      updated = [...selectedCities, cityId];
    }
    setSelectedCities(updated);

    // Sync select-all checkbox
    if (updated.length === cities.length) setSelectAll(true);
    else setSelectAll(false);
    setCityError("");
  };

  const handleClose = () => {
    clearFormData();
    setSelectAll(false);
    setIsLoading(false);
    setIsEditing(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="addtask-overlay">
      <div className="addtask-modal">
        <div className="addtask-header">
          <h3>{isEditing ? "Edit Task" : "Add Task"}</h3>
          <button className="addtask-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="addtask-body">
          <div className="addtask-left">
            {/* Title */}
            <div className="addtask-field">
              <label>Title</label>
              <input
                type="text"
                value={title}
                placeholder="Enter task title"
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={titleError ? "input-error" : ""}
              />
              {titleError && <div className="error-text">{titleError}</div>}
            </div>

            {/* Description */}
            <div className="addtask-field">
              <label>Description</label>
              <textarea
                rows="6"
                value={description}
                placeholder="Enter task description"
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={descriptionError ? "input-error" : ""}
              />
              {descriptionError && (
                <div className="error-text">{descriptionError}</div>
              )}
            </div>

            {/* Save Button */}
            <button
              className="addtask-save"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="addtask-loading">
                  <FaSpinner className="addtask-spinner" />
                  <span>Please wait...</span>
                </div>
              ) : isEditing ? (
                "Update Data"
              ) : (
                "Save Data"
              )}
            </button>
          </div>

          <div className="addtask-right">
            {/* City Selection */}
            <div className="addtask-city-section">
              <div className="addtask-city-header">
                <span className="city-header-title">Select Cities</span>
                <label className="addtask-select-all">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  Select All
                </label>
              </div>

              <div className="addtask-city-grid">
                {cities?.map((city) => (
                  <label key={city.id} className="addtask-city-item">
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city.id)}
                      onChange={() => handleCityToggle(city.id)}
                    />
                    <span>{city.cityName}</span>
                  </label>
                ))}
              </div>

              {cityError && (
                <div className="error-text city-error">{cityError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
