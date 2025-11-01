import React, { useEffect, useRef, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { images } from '../../assets/css/imagePath';
import style from '../../Style/Expense/SubExpense.module.css';
import styless from "../../assets/css/Task/TaskDetails/SubTask.module.css";
import styles from '../../assets/css/modal.module.css';
import { setAlertMessage } from '../../common/common';
import { getSubExpenseCategory, handleItemExpense, handleOnChange } from '../../actions/Expenses/ExpenseAction';
import { useDispatch } from 'react-redux';
import { handleExpenseEntry, handleExpenseEntryUpdate } from '../../Redux/Expense/ExpenseAction';
import { MdClose } from 'react-icons/md';
import { handleRemoveImaga } from '../../services/MainExpense/ExpenseService';
import DatePicker from 'react-datepicker';

const AddSubExpense = (props) => {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [expenseLimit, setExpenseLimit] = useState(0);
    const [isDesc, setIsDesc] = useState(false);
    const inputRef = useRef(null)

    useEffect(() => {
        if (props.addExpenseData.subCategoryId) {
            const selectedCategory = props.expenseSubCategoryList.find(cat => cat.subCategoryId === props.addExpenseData.subCategoryId);
            if (selectedCategory && selectedCategory.expenseLimit !== false) {
                setExpenseLimit(selectedCategory.expenseLimit);
            } else {
                setExpenseLimit(false);
            }
            if (selectedCategory && selectedCategory.desc !== false) {
                setIsDesc(selectedCategory.desc);
            } else {
                setIsDesc(false);
            }
        } else {
            setExpenseLimit(0);
            setIsDesc(false);
        }
    }, [props.addExpenseData.subCategoryId, props.expenseSubCategoryList]);

    useEffect(() => {
        if (props.addExpenseData.categoryId) {
            const selectedCategory = props.expenseCategoryList.find(cat => cat.id === props.addExpenseData.categoryId);
            getSubExpenseCategory(
                selectedCategory,
                props.setExpenseSubCategoryList
            );
        }
    }, [props.addExpenseData.categoryId, props.showAddExpense])

    useEffect(() => {
        if (props.addExpenseData.paymentMethod === "Cash") {
            const company = localStorage.getItem('company');
            const empCode = localStorage.getItem('empCode');

            const imagesToRemove = (props.addExpenseData.images || []).filter(
                img => img.isScreenShot === true || img.isScreenShot === "Yes"
            );

            props.setAddExpenseData((prevData) => ({
                ...prevData,
                images: (prevData.images || []).filter(
                    img => !(img.isScreenShot === true || img.isScreenShot === "Yes")
                ),
            }));

            if (props.flag === 'edit' && imagesToRemove.length > 0) {
                handleRemoveImaga(company, empCode, props.expenseId, props.addExpenseData.id, imagesToRemove);
            };

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [props.addExpenseData.paymentMethod, props.flag, props.expenseId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        handleOnChange(
            props.addExpenseData,
            props.setAddExpenseData,
            props.error,
            props.setError,
            name,
            value
        );

        let parsedValue;
        try {
            parsedValue = JSON.parse(value);
        } catch (error) {
            parsedValue = value;
        }

        if (name === "categoryId") {
            props.setAddExpenseData((prevData) => ({
                ...prevData,
                categoryId: parsedValue.id,
                name: parsedValue.name,
            }));
            setExpenseLimit(parsedValue.expenseLimit !== false ? parsedValue.expenseLimit : false);

        } else if (name === "subCategoryId") {
            props.setAddExpenseData((prevData) => ({
                ...prevData,
                subCategoryId: parsedValue.subCategoryId,
                subCategory: parsedValue.name,
            }));

        } else {
            props.setAddExpenseData((prevData) => ({
                ...prevData,
                [name]: parsedValue,
            }));
        }

        if (["categoryId", "subCategoryId", "date"].includes(name) && props.error[name]) {
            props.setError((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";  // Clear previous file if needed
            fileInputRef.current.click();     // Open dialog
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        props.setAddExpenseData((prevData) => {
            const existing = new Set((prevData.images || []).map(f => f.name + f.file?.size));
            const newFiles = files.filter(f => !existing.has(f.name + f.size)).map(file => ({
                imageId: "",
                imageUri: URL.createObjectURL(file),
                file: file,
                name: file.name,
            }));

            if (!newFiles.length) {
                setAlertMessage("error", "Duplicate images are not allowed.");
                return prevData;
            }

            return {
                ...prevData,
                images: [...(prevData.images || []), ...newFiles],
            };
        });
    };


    const handleRemoveImage = (targetImage) => {
        if (targetImage?.isScreenShot === true || targetImage?.isScreenShot === "Yes") {
            return;
        }

        props.setAddExpenseData((prevData) => ({
            ...prevData,
            images: prevData.images.filter(img => img !== targetImage),
        }));
    };

    const handleSaveExpenseItem = (e) => {
        e.preventDefault();

        handleItemExpense(
            props.addExpenseData,
            props.setError,
            dispatch,
            handleExpenseEntry,
            props.setAddExpenseData,
            props.itemFlag,
            handleExpenseEntryUpdate,
            props.setShowAddExpense,
            props.setFlag,
            expenseLimit,
            setExpenseLimit,
            isDesc,
            props.expenseSubCategoryList
        );
    };

    const onHandleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (props.addExpenseData.paymentMethod === "Cash") {
            props.setAddExpenseData((prevData) => ({
                ...prevData,
                images: []
            }));
        } else {
            props.setAddExpenseData((prevData) => {
                const existingImages = new Set((prevData.images || []).map(img => img.file?.name + img.file?.size));
                const newImages = files
                    .filter(file => !existingImages.has(file.name + file.size))
                    .map(file => ({
                        imageId: "",
                        imageUri: URL.createObjectURL(file),
                        file: file,
                        name: file.name,
                        isScreenShot: true
                    }));

                if (newImages.length === 0) {
                    setAlertMessage("error", "Duplicate images are not allowed.");
                    return prevData;
                }

                // Clear error after successful image addition
                if (props.setError && files.length > 0) {
                    props.setError(prevError => ({
                        ...prevError,
                        images: ""
                    }));
                }

                return {
                    ...prevData,
                    images: [...(prevData.images || []), ...newImages],
                };
            });
        }
    };

    return (
        <>
            <Offcanvas placement="end" show={props.showAddExpense} onHide={props.onHide} className={style.responsiveOffcanvas} style={{ width: '500px' }}>
                <div className={style.canvas_container} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                    <div className={style.OffcanvasHeader}>
                        <h4 className={style.department_title}>Add Item</h4>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "30px", overflowX: 'hidden' }}>

                        <div className={style.canvas_header_end}>
                            <img
                                src={images.iconClose}
                                className={`${style.close_popup}`}
                                onClick={props.onHide}
                                alt="Close"
                            />
                        </div>

                        {/* Expense Category */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className={`${styles.textboxGroup}`}>
                                    <div className={`${styles.textboxMain}`}>
                                        <div className={`${styles.textboxLeft}`}>Expense category</div>
                                        <div className={`${styles.textboxRight}`}>
                                            <select
                                                className={`form-control ${styles.formTextbox} ${props.error.categoryId ? "is-invalid" : ""}`}
                                                id="categoryId"
                                                name="categoryId"
                                                value={props.addExpenseData.categoryId ? JSON.stringify(props.expenseCategoryList.find(cat => cat.id === props.addExpenseData.categoryId)) : ""}
                                                onChange={handleInputChange}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <option value="" disabled>Select category</option>
                                                {props.expenseCategoryList.map((category) => (
                                                    <option key={category.id} value={JSON.stringify(category)}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>


                                        </div>
                                    </div>
                                    {props.error.categoryId && (
                                        <p className={`${styles.errorMessage}`}>
                                            {props.error.categoryId}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {props.addExpenseData.categoryId && (
                            <div className="row">
                                <div className="col-md-12">
                                    <div className={`${styles.textboxGroup}`}>
                                        <div className={`${styles.textboxMain}`}>
                                            <div className={`${styles.textboxLeft}`}>Sub category</div>
                                            <div className={`${styles.textboxRight}`}>
                                                <select
                                                    className={`form-control ${styles.formTextbox} ${props.error.subCategoryId ? "is-invalid" : ""}`}
                                                    id="subCategoryId"
                                                    name="subCategoryId"
                                                    value={props.addExpenseData.subCategoryId ? JSON.stringify(props.expenseSubCategoryList.find(cat => cat.subCategoryId === props.addExpenseData.subCategoryId)) : ""}
                                                    onChange={handleInputChange}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <option value="" disabled>Select category</option>
                                                    {props.expenseSubCategoryList.map((category) => (
                                                        <option key={category.subCategoryId} value={JSON.stringify(category)}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>


                                            </div>
                                        </div>
                                        {props.error.subCategoryId && (
                                            <p className={`${styles.errorMessage}`}>
                                                {props.error.subCategoryId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Amount */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className={`${styles.textboxGroup}`}>
                                    <div className={`${styles.textboxMain}`}>
                                        <div className={`${styles.textboxLeft}`}>Amount</div>
                                        <div className={`${styles.textboxRight}`}>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className={`form-control ${styles.formTextbox} ${props.error.amount ? "is-invalid" : ""}`}
                                                id="amount"
                                                name="amount"
                                                placeholder=""
                                                value={props.addExpenseData.amount}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (Number(value) >= 0 || value === '') {
                                                        handleInputChange(e);
                                                    }
                                                }}
                                                onFocus={() => {
                                                    if (props.addExpenseData.amount === "0.00") {
                                                        handleInputChange({ target: { name: "amount", value: "" } });
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value === "") {
                                                        handleInputChange({ target: { name: "amount", value: "0.00" } });
                                                    }
                                                }}
                                            />


                                        </div>

                                    </div>
                                    {props.error.amount && (
                                        <p className={`${styles.errorMessage}`}>
                                            {props.error.amount}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-12`}>
                            <div className={`${styles.textboxGroup}`}>
                                <div className={`${styles.textboxMain}`}>
                                    <div className={`${styles.textboxLeft}`}>Date</div>
                                    <div className={`${styles.textboxRight} ${styles.formCalendarBox}`}>
                                        <DatePicker
                                            selected={props.addExpenseData?.date}
                                            onChange={(date) =>
                                                handleInputChange({ target: { name: 'date', value: date } })
                                            }
                                            dateFormat="dd-MM-yyyy"
                                            className={`form-control ${styles.formTextbox} custom-datepicker ${props.error.date ? styles.inputError : styles.input
                                                }`}
                                            placeholderText="DD-MM-YYYY"
                                            minDate={props.expense?.from ? new Date(props.expense?.from) : null}
                                            maxDate={props.expense?.to ? new Date(props.expense?.to) : null}
                                            required
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            popperPlacement="auto"
                                            dayClassName={(date) => {
                                                const min = props.expense?.from ? new Date(new Date(props.expense?.from).setHours(0, 0, 0, 0)) : null;
                                                const max = props.expense?.to ? new Date(new Date(props.expense?.to).setHours(0, 0, 0, 0)) : null;
                                                const current = new Date(date.setHours(0, 0, 0, 0));

                                                if ((min && current < min) || (max && current > max)) {
                                                    return 'inline-disabled-day';
                                                }
                                                return '';
                                            }}
                                            renderCustomHeader={({
                                                date,
                                                decreaseMonth,
                                                increaseMonth,
                                                prevMonthButtonDisabled,
                                                nextMonthButtonDisabled,
                                                changeYear,
                                                changeMonth,
                                            }) => (
                                                <div className="custom-datepicker-header d-flex align-items-center justify-content-between">
                                                    <button
                                                        onClick={decreaseMonth}
                                                        disabled={prevMonthButtonDisabled}
                                                        className="custom-nav-button"
                                                    >
                                                        <img
                                                            src={images.iconLeft}
                                                            className={`iconPreNext ${styles.iconPreNext}`}
                                                            title="Previous"
                                                            alt="icon"
                                                        />
                                                    </button>

                                                    <div className="d-flex align-items-center">
                                                        <div className="dropdown me-2">
                                                            <button
                                                                className="btn btn-light dropdown-toggle btnMonthYear"
                                                                type="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                {new Date(0, date.getMonth()).toLocaleString('default', {
                                                                    month: 'long',
                                                                })}
                                                            </button>
                                                            <ul className="dropdown-menu DropdownMonthYear">
                                                                {Array.from({ length: 12 }, (_, i) => (
                                                                    <li key={i}>
                                                                        <a
                                                                            className={`dropdown-item dropdownItemMonthYear ${date.getMonth() === i ? 'active' : ''
                                                                                }`}
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                changeMonth(i);
                                                                            }}
                                                                        >
                                                                            {new Date(0, i).toLocaleString('default', {
                                                                                month: 'long',
                                                                            })}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div className="dropdown">
                                                            <button
                                                                className="btn btn-light dropdown-toggle btnMonthYear"
                                                                type="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                {date.getFullYear()}
                                                            </button>
                                                            <ul className="dropdown-menu DropdownMonthYear">
                                                                {Array.from({ length: 100 }, (_, i) => {
                                                                    const year = new Date().getFullYear() - i;
                                                                    return (
                                                                        <li key={year}>
                                                                            <a
                                                                                className={`dropdown-item dropdownItemMonthYear ${date.getFullYear() === year ? 'active' : ''
                                                                                    }`}
                                                                                href="#"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    changeYear(year);
                                                                                }}
                                                                            >
                                                                                {year}
                                                                            </a>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={increaseMonth}
                                                        disabled={nextMonthButtonDisabled}
                                                        className="custom-nav-button"
                                                    >
                                                        <img
                                                            src={images.iconRight}
                                                            className={`iconPreNext ${styles.iconPreNext}`}
                                                            title="Next"
                                                            alt="icon"
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        />
                                        <style>
                                            {`
                                                                           .inline-disabled-day {
                                                                            background-color: #f0f0f0 !important;
                                                                            color: black !important;
                                                                            pointer-events: none !important;
                                                                            border-radius: 0.3rem;
                                                                          }
                                                                        `}
                                        </style>
                                    </div>
                                </div>
                                {props.error.date && (
                                    <div className={`${styles.invalidfeedback}`}>
                                        {props.error.date}
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className={`${styles.textboxGroup}`} >
                            <div className={`${style.textboxLeft} `}>Payment method</div>
                            <div style={{ display: "flex", gap: "60px", flexDirection: "row" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "14px", cursor: "pointer" }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Online"
                                        checked={props.addExpenseData?.paymentMethod === "Online"}
                                        onChange={handleInputChange}
                                    />
                                    Online
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "14px", cursor: "pointer" }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Cash"
                                        checked={props.addExpenseData.paymentMethod === "Cash"}
                                        onChange={handleInputChange}
                                    />
                                    Cash
                                </label>
                            </div>
                            {props.error.paymentMethod && (
                                <p className={`${styles.errorMessage}`}>
                                    {props.error.paymentMethod}
                                </p>
                            )}
                        </div>

                        {props.addExpenseData.paymentMethod === 'Online' && (
                            <div className="col-md-12">
                                <div className={`${styles.textboxGroup}`}>
                                    {(() => {
                                        const screenshot = props.addExpenseData?.images?.find(
                                            img => img?.isScreenShot === "Yes" || img?.isScreenShot === true
                                        );

                                        const hasScreenshot = !!screenshot;

                                        return (
                                            <>
                                                <div className={`${styles.textboxMain}`}>
                                                    <div className={`${styles.textboxLeft}`}>Upload File</div>
                                                    <div className={`${styles.textboxRight} d-flex align-items-center gap-2`}>
                                                        <input
                                                            ref={inputRef}
                                                            id="fileUpload"
                                                            type="file"
                                                            accept="image/jpeg, image/png, image/jpg"
                                                            name="fileUpload"
                                                            placeholder="Upload Payment screenshot"
                                                            onChange={onHandleFileChange}
                                                            style={{ display: "none" }}
                                                            disabled={hasScreenshot}
                                                        />
                                                        <label
                                                            htmlFor="fileUpload"
                                                            className={`form-control ${styles.formTextbox}`}
                                                            style={{
                                                                cursor: hasScreenshot ? "not-allowed" : "pointer",
                                                                backgroundColor: hasScreenshot ? "#f0f0f0" : "",
                                                                color: hasScreenshot ? "#888" : ""
                                                            }}
                                                        >
                                                            {hasScreenshot ? "PaymentScreenShot.jpg" : "Upload payment screenshot"}
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Show uploaded screenshot */}
                                                {hasScreenshot && (
                                                    <div className={`mt-2 ${style.uploadJpg}`}>
                                                        <img
                                                            src={screenshot.imageUri}
                                                            alt="Payment Screenshot"
                                                            className={style.uploadJpgIn}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                                {props.error.images && (
                                    <p className={`${styles.errorMessage}`} style={{ position: 'relative', bottom: '9px' }}>
                                        {props.error.images}
                                    </p>
                                )}
                            </div>
                        )}

                        {isDesc && (
                            <div className="row">
                                <div className="col-md-12">
                                    <div className={`${styles.textboxGroup}`}>
                                        <label className={style.descriptiontext}>Description</label>
                                        <div className='col-md-12'>
                                            <textarea
                                                className={`${style.boxDescripition} ${props.error.description ? "is-invalid" : ""}`}
                                                id='description'
                                                name='description'
                                                style={{ width: '100%' }}
                                                cols={5}
                                                rows={5}
                                                onChange={handleInputChange}
                                                value={props.addExpenseData?.description}
                                                placeholder='Please provide description.'
                                            />
                                        </div>
                                        {props.error.description && (
                                            <p className={`${styles.errorMessage}`}>
                                                {props.error.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={style.textboxMainUpload} onClick={handleClick}>
                            <div className={style.textboxAtt}>Upload attachments</div>
                            <div className={style.buttonAdd}>
                                <button className={`btn ${style.btnUpload}`} type="button">
                                    + Upload
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*,application/pdf"
                                />
                            </div>
                        </div>


                        <div className="row mt-3">
                            {(props.addExpenseData.images || [])
                                .filter(imageObj => !(imageObj?.isScreenShot === true || imageObj?.isScreenShot === "Yes"))
                                .map((imageObj, index) => {
                                    const isPDF = imageObj.file?.type === "application/pdf" || imageObj.name?.toLowerCase().endsWith(".pdf");
                                    return (
                                        <div
                                            key={index}
                                            className="col-6 col-sm-4 col-md-3 "
                                            style={{ position: "relative" }}
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            {isPDF || imageObj.type === ".pdf" ? (
                                                <div className={style.uploadJpg}>
                                                    <img
                                                        src={images.iconPDF}
                                                        alt="PDF File"
                                                        className={style.uploadJpgIn}
                                                    />
                                                </div>
                                            ) : (
                                                <div className={style.uploadJpg}>
                                                    <img
                                                        src={imageObj.imageUri}
                                                        alt={`Uploaded ${index}`}
                                                        className={style.uploadJpgIn}
                                                    />
                                                </div>
                                            )}

                                            {/* Remove Button */}
                                            {hoveredIndex === index && !props.addExpenseData.id && (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveImage(imageObj);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '0px',
                                                        background: 'white',
                                                        color: 'black',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0px 0px 5px rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    <MdClose />
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                        </div>
                    </div>

                    <div style={{
                        position: "sticky",
                        bottom: 0,
                        // backgroundColor: "#fff",
                        padding: "16px 30px",
                        // boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
                        zIndex: 10,
                    }}>
                        <button
                            type="submit"
                            className={`${styles.btnSave}`}
                            onClick={handleSaveExpenseItem}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </Offcanvas >
        </>
    );
};

export default AddSubExpense;
