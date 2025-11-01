import * as React from 'react';
import styles from '../../assets/css/modal.module.css';
import { images } from '../../assets/css/imagePath';
import style from '../../Style/Expense/Expense.module.css';
import AddSubExpense from './AddSubExpense';
import * as action from '../../actions/Expenses/ExpenseAction';
import * as reduxDispatch from 'react-redux';
import dayjs from 'dayjs';
import * as reduxAction from '../../Redux/Expense/ExpenseAction';
import { FaSpinner } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { MdClose } from "react-icons/md";
import DeleteDialog from '../DeleteDialog/DeleteDialog';
import DatePicker from 'react-datepicker';

const AddExpense = (props) => {
    const { expenseDetail } = reduxDispatch.useSelector((store) => store.expense);
    const [attachmentType, setAttachmentType] = React.useState('');
    const [showAddExpense, setShowAddExpense] = React.useState(false);
    const [loader, setLoader] = React.useState(false);
    const [showImageModal, setShowImageModal] = React.useState(false);
    const [showDeleteModal, setDeleteModal] = React.useState(false);
    const [showDeleteImgModal, setShowDeleteImgModal] = React.useState(false);

    const [expenseCategoryList, setExpenseCategoryList] = React.useState([]);
    const [expenseSubCategoryList, setExpenseSubCategoryList] = React.useState([]);
    const [selectedImage, setSelectedImage] = React.useState([]);
    const [hoveredIndex, setHoveredIndex] = React.useState({ itemIndex: null, imageIndex: null });
    const [previewImage, setPreviewImage] = React.useState(null);
    const [itemIndex, setItemIndex] = React.useState(null);
    const [currentItemIndex, setCurrentItemIndex] = React.useState(null);
    const [year, setYear] = React.useState('');
    const [month, setMonth] = React.useState('');
    const [itemId, setItemId] = React.useState(null);
    const [attachementId, setAttachementId] = React.useState('');
    const [imgIndex, setImgIndex] = React.useState(null);
    const [expImgIndex, setExpImgIndex] = React.useState(null);
    const [expImgId, setExpImgId] = React.useState('');
    const [showDeleteExpImg, setShowDeleteExpImg] = React.useState(false);
    //loaders state
    const [itemLoader, setItemLoader] = React.useState(false);
    const [itemAttLoader, setItemAttLoader] = React.useState(false);
    const [expLoader, setExpLoader] = React.useState(false);

    const currentYear = new Date().getFullYear();
    const minDate = new Date(currentYear, 0, 1);
    const maxDate = new Date(currentYear, 11, 31);

    const dispatch = reduxDispatch.useDispatch();

    React.useEffect(() => {
        action.getExpenseCategoryList(setExpenseCategoryList);
    }, []);

    React.useEffect(() => {
        if (props.selectedCityName && props.expenseError?.city) {
            props.setExpenseError(prev => {
                const updated = { ...prev };
                delete updated.city;
                return updated;
            });
        }
    }, [props.selectedCityName]);

    const validateFields = () => {
        const error = [];

        if (props.expense.from === "") {
            error.from = "Please provide From Date.";
        }
        if (props.expense.to === "") {
            error.to = "Please provide To Date.";
        }
        if (props.expense.expensePurpose.trim() === "") {
            error.expensePurpose = "Please provide expense purpose.";
        }

        if (!props.selectedCityName || props.selectedCityName === "") {
            error.city = "Please select a city to log your expenses.";
        }

        props.setExpenseError(error);

        if (Object.keys(error).length === 0) {
            setShowAddExpense(true);
            props.setItemFlag('add');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        action.handleSaveExpenseData(
            props.expense,
            props.setExpenseError,
            expenseDetail,
            expenseDetail.items.reduce(
                (acc, ele) => acc + +ele.amount,
                0,
            ),
            props.setExpense,
            dispatch,
            reduxAction.handleExpenseAllClear,
            props.setTrigger,
            props.setShowExpenseModal,
            setLoader,
            props.setRenderData,
            props.selectedCityName
        )
    }

    const handleInputChange = (eOrValue, fieldName) => {
        if (eOrValue?.target) {
            const { name, value } = eOrValue.target;
            action.handleAddExpenseOnChange(
                props.expense,
                props.setExpense,
                props.expenseError,
                props.setExpenseError,
                name,
                value
            );
        } else if (fieldName) {
            action.handleAddExpenseOnChange(
                props.expense,
                props.setExpense,
                props.expenseError,
                props.setExpenseError,
                fieldName,
                eOrValue
            );
        }
    };

    const onHide = () => {
        setShowAddExpense(false)
        props.setAddExpenseData({
            categoryId: "",
            subCategoryId: "",
            subCategory: "",
            name: "",
            amount: "0.00",
            date: "",
            images: [],
            id: '',
            description: "",
            paymentMethod: "Online"

        });
        props.setError({});
        props.setItemFlag('');
    }

    const handleCloseModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
    };

    const handleEdit = (item, index) => {
        setShowAddExpense(true);
        props.setItemFlag('edit');
        let obj = {
            id: index,
            name: item.name,
            amount: item.amount,
            date: item.date,
            images: item.images,
            categoryId: item.categoryId,
            subCategoryId: item.subCategoryId,
            subCategory: item.subCategory,
            description: item.decription,
            paymentMethod: item.paymentMethod
        };

        dispatch(reduxAction.handleExpenseEntryEdit(obj))
        props.setAddExpenseData({
            categoryId: item.categoryId,
            amount: item.amount,
            date: item.date,
            images: item.images,
            name: item.name,
            id: item.id,
            subCategoryId: item.subCategoryId,
            subCategory: item.subCategory,
            description: item.description,
            paymentMethod: item.paymentMethod
        })
    }

    const handleDelete = (item, index) => {
        setItemIndex(item.id);
        setDeleteModal(true);
        setCurrentItemIndex(index);
        const year = dayjs(item.date).format('YYYY');
        const month = dayjs(item.date).format('MMMM');
        setYear(year);
        setMonth(month);
    }

    const handleDeleteConfirm = () => {
        action.handleDeleteExpenseItem(
            props.showData?.expenseId,
            itemIndex,
            year,
            month,
            setDeleteModal,
            currentItemIndex,
            dispatch,
            expenseDetail,
            setItemIndex,
            setCurrentItemIndex,
            setItemLoader,
            props.setAddExpenseData
        )
    }

    const handleDeleteItemImage = (imIndex, imageObj, item) => {
        setImgIndex(imIndex);
        setShowDeleteImgModal(true);
        setAttachementId(imageObj.imageId);
        setItemId(item.id);
        setAttachmentType(imageObj.type);
    }

    const deleteImageByID = () => {
        action.DeleteItemImages(
            imgIndex,
            itemId,
            attachementId,
            props.showData?.expenseId,
            expenseDetail.items,
            setShowDeleteImgModal,
            dispatch,
            setItemAttLoader,
            attachmentType,
            props.selectedCityName
        );
        props.setAddExpenseData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, index) => index !== imgIndex)
        }));

    }

    const deleteExpAttachment = (img, index) => {
        setShowDeleteExpImg(true);
        setExpImgId(img?.imageId);
        setExpImgIndex(index);
        setShowImageModal(false);

    }

    const onConfirmDelete = () => {
        action.deleteExpenseAttachement(
            props.showData?.expenseId,
            expImgId,
            dispatch,
            props.expense,
            expImgIndex,
            setShowDeleteExpImg,
            setExpLoader,
            props.setExpense
        );
    }

    const onEnterKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <div className={`${styles.overlay}`} style={{ zIndex: '9' }}>
            <div className={`${styles.modal}`}>
                <div className={`${styles.actionBtn}`}>
                    <p className={styles.headerText}>
                        {props.flag === 'edit' ? "Update Expense Report" : "Add Expense Report"}
                    </p>
                    <button className={styles.closeBtn} onClick={props.handlePopUpClose}>
                        <img
                            src={images.iconClose}
                            className={`${styles.iconClose}`}
                            title="Close"
                            alt="icon"
                        />
                    </button>
                </div>

                <div className={`${styles.modalBody}`} >
                    <div className="row">
                        <div className="col-md-12">
                            <div className={`${styles.textboxGroup}`}>
                                <div className={`${styles.textboxMain}`}>
                                    <div className={`${styles.textboxLeft}`}>Selected City</div>
                                    <div className={`${styles.textboxRight}`}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input
                                                type="text"
                                                className={`form-control ${styles.formTextbox}`}
                                                value={props.selectedCityName || "No city selected"}
                                                disabled
                                                style={{ backgroundColor: '#f8f9fa', color: '#000' }}
                                            />
                                            {props.flag === 'edit' || props.selectedCityName ? (
                                                <span
                                                    style={{
                                                        color: '#667dfaff',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        textDecoration: 'none',
                                                        width: '40%'
                                                    }}
                                                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                                                    onClick={() => props.setShowAddModal(true)}
                                                >
                                                    Change city
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: '#667dfaff',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        textDecoration: 'none',
                                                        width: '40%'
                                                    }}
                                                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                                                    onClick={props.handleOpenCityModal}
                                                >
                                                    Select city
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                                {props.expenseError.city && (
                                    <p className={`${styles.errorMessage}`}>
                                        {props.expenseError.city}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className={`${styles.textboxGroup}`}>
                                <div className={`${styles.textboxMain}`}>
                                    <div className={`${styles.textboxLeft}`}>Expense Purpose</div>
                                    <div className={`${styles.textboxRight}`}>
                                        <input
                                            type="text"
                                            className={`form-control ${styles.formTextbox} ${props.expenseError.expensePurpose ? "is-invalid" : ""}`}
                                            id="expensePurpose"
                                            name="expensePurpose"
                                            placeholder=""
                                            value={props.expense.expensePurpose}
                                            onChange={handleInputChange}
                                            onKeyDown={onEnterKeyPress}
                                        />
                                    </div>
                                </div>
                                {props.expenseError.expensePurpose && (
                                    <p className={`${styles.errorMessage}`}>
                                        {props.expenseError.expensePurpose}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className={`${styles.textboxGroup}`}>
                                <div className={`${styles.textboxMain}`}>
                                    <div className={`${styles.textboxLeft}`}>
                                        From Date
                                    </div>
                                    <div
                                        className={`${styles.textboxRight}  ${styles.formCalendarBox}`}
                                    >
                                        <DatePicker
                                            selected={props.expense.from ? new Date(props.expense.from) : null}
                                            onChange={(date) => handleInputChange(date, 'from')}
                                            dateFormat="dd-MM-yyyy"
                                            className={`form-control ${styles.formTextbox} custom-datepicker ${props.expenseError.from
                                                ? styles.inputError
                                                : styles.input
                                                }`}
                                            placeholderText="DD-MM-YYYY"
                                            onKeyDown={onEnterKeyPress}
                                            min={minDate.toISOString().split("T")[0]}
                                            max={maxDate.toISOString().split("T")[0]}
                                            maxDate={props.expense.to ? new Date(props.expense.to) : maxDate}
                                            required
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            popperPlacement="auto"
                                            dayClassName={(date) => {
                                                const max = props.expense.to ? new Date(props.expense.to) : null;
                                                if (max && date > max) {
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
                                                                {new Date(
                                                                    0,
                                                                    date.getMonth()
                                                                ).toLocaleString("default", {
                                                                    month: "long",
                                                                })}
                                                            </button>
                                                            <ul className="dropdown-menu DropdownMonthYear">
                                                                {Array.from({ length: 12 }, (_, i) => (
                                                                    <li key={i}>
                                                                        <a
                                                                            className={`dropdown-item dropdownItemMonthYear ${date.getMonth() === i
                                                                                ? "active"
                                                                                : ""
                                                                                }`}
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                changeMonth(i);
                                                                            }}
                                                                        >
                                                                            {new Date(0, i).toLocaleString(
                                                                                "default",
                                                                                { month: "long" }
                                                                            )}
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
                                                                    const year =
                                                                        new Date().getFullYear() - i;
                                                                    return (
                                                                        <li key={year}>
                                                                            <a
                                                                                className={`dropdown-item dropdownItemMonthYear ${date.getFullYear() === year
                                                                                    ? "active"
                                                                                    : ""
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
                                                    .custom-datepicker {
                                                        cursor: pointer !important;
                                                    }
                                                `}
                                        </style>
                                    </div>
                                </div>
                                {props.expenseError.from && (
                                    <div className={`${styles.invalidfeedback}`}>
                                        {props.expenseError.from}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className={`${styles.textboxGroup}`}>
                                <div className={`${styles.textboxMain}`}>
                                    <div className={`${styles.textboxLeft}`}>
                                        To Date
                                    </div>
                                    <div
                                        className={`${styles.textboxRight}  ${styles.formCalendarBox}`}
                                    >
                                        <DatePicker
                                            selected={props.expense.to ? new Date(props.expense.to) : null}
                                            onChange={(date) => handleInputChange(date, 'to')}
                                            dateFormat="dd-MM-yyyy"
                                            className={`form-control ${styles.formTextbox} custom-datepicker 
                                                ${props.expenseError.to
                                                    ? styles.inputError
                                                    : styles.input
                                                }
                                                `}
                                            placeholderText="DD-MM-YYYY"
                                            onKeyDown={onEnterKeyPress}
                                            disabled={!props.expense.from}
                                            minDate={props.expense.from ? new Date(props.expense.from) : null}
                                            required
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            popperPlacement="auto"
                                            dayClassName={(date) => {
                                                const min = props.expense.from ? new Date(props.expense.from) : null;
                                                if (min && date < min) {
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
                                                    {/* Previous Button */}
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

                                                    {/* Month and Year Dropdowns */}
                                                    <div className="d-flex align-items-center">
                                                        {/* Month Dropdown */}
                                                        <div className="dropdown me-2">
                                                            <button
                                                                className="btn btn-light dropdown-toggle btnMonthYear"
                                                                type="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                {new Date(
                                                                    0,
                                                                    date.getMonth()
                                                                ).toLocaleString("default", {
                                                                    month: "long",
                                                                })}
                                                            </button>
                                                            <ul className="dropdown-menu DropdownMonthYear">
                                                                {Array.from({ length: 12 }, (_, i) => (
                                                                    <li key={i}>
                                                                        <a
                                                                            className={`dropdown-item dropdownItemMonthYear ${date.getMonth() === i
                                                                                ? "active"
                                                                                : ""
                                                                                }`}
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                changeMonth(i);
                                                                            }}
                                                                        >
                                                                            {new Date(0, i).toLocaleString(
                                                                                "default",
                                                                                { month: "long" }
                                                                            )}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Year Dropdown */}
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
                                                                    const year =
                                                                        new Date().getFullYear() - i;
                                                                    return (
                                                                        <li key={year}>
                                                                            <a
                                                                                className={`dropdown-item dropdownItemMonthYear ${date.getFullYear() === year
                                                                                    ? "active"
                                                                                    : ""
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

                                                    {/* Next Button */}
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

    .custom-datepicker::placeholder {
      color: #333 !important; /* Darker placeholder text */
      opacity: 1 !important;
    }
  `}
                                        </style>

                                    </div>
                                </div>
                                {props.expenseError.to && (
                                    <div className={`${styles.invalidfeedback}`}>
                                        {props.expenseError.to}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.totalAmaout}>
                        <div className={styles.expenseItem}>
                            <h4> <span>Expense Total (INR)</span>   <img
                                src={images.iconRupee}
                                className={`${styles.iconRupee}`}

                            />{
                                    (() => {
                                        const total = expenseDetail.items.reduce((count, ele) => count + +ele.amount, 0);
                                        return total % 1 === 0 ? parseInt(total) : total.toFixed(2);
                                    })()
                                }</h4>
                        </div>
                        <div>  <button
                            className={`btn ${style.custom_AddDesignation_btn} p-0`}
                            onClick={validateFields}
                        >
                            +
                        </button></div>
                    </div>
                    <div className={styles.uploadOver}>
                        {expenseDetail.items && expenseDetail.items.length > 0 ? (
                            [...expenseDetail.items]
                                .sort((a, b) => new Date(a.date) - new Date(b.date)) // ✅ ascending date sort
                                .map((item, index) => {
                                    return (
                                        <div key={index} className={styles.itemInfo}>
                                            <div className={styles.dateExpense}>
                                                <p className={styles.itemName}>{item.subCategory || "No Name"}</p>
                                                <h4 className={styles.itemAmount}>
                                                    <img
                                                        src={images.iconRupee}
                                                        className={`${styles.iconRupee}`}
                                                    />
                                                    {parseFloat(item.amount) % 1 === 0
                                                        ? parseInt(item.amount)
                                                        : parseFloat(item.amount).toFixed(2)}
                                                </h4>
                                            </div>
                                            <div className={styles.iconGroup}>
                                                <div className={styles.itemDate}>
                                                    {dayjs(item.date).format("DD MMM YYYY")}
                                                </div>
                                                <div className={styles.iconGap}>
                                                    <img
                                                        onClick={() => handleEdit(item, index)}
                                                        src={images.iconEdit}
                                                        className={styles.iconEdit}
                                                        title="Edit"
                                                        alt="icon"
                                                    />
                                                    <img
                                                        onClick={() => handleDelete(item, index)}
                                                        src={images.iconDeleted}
                                                        className={styles.iconDeleted}
                                                        title="Delete"
                                                        alt="icon"
                                                    />
                                                </div>
                                            </div>

                                            {/* Receipt image or PDF preview */}
                                            {item.images && item.images.length > 0 && (
                                                <div className={styles.receipSection}>
                                                    {item.images.map((imageObj, imIndex) => {
                                                        const isPDF = imageObj?.type === ".pdf" || imageObj?.file?.type === "application/pdf";
                                                        return (
                                                            <div
                                                                key={imIndex}
                                                                className={styles.imageBoxUp}
                                                                onMouseEnter={() => setHoveredIndex({ itemIndex: index, imageIndex: imIndex })}
                                                                onMouseLeave={() => setHoveredIndex({ itemIndex: null, imageIndex: null })}
                                                            >
                                                                {isPDF ? (
                                                                    <img
                                                                        src={images.iconPDF}
                                                                        alt={`PDF ${imIndex}`}
                                                                        className={styles.expenseImage}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={imageObj?.imageUri}
                                                                        alt={`Uploaded ${imIndex}`}
                                                                        className={styles.expenseImage}
                                                                    />
                                                                )}

                                                                {hoveredIndex.itemIndex === index && hoveredIndex.imageIndex === imIndex && (
                                                                    <span
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteItemImage(imIndex, imageObj, item);
                                                                        }}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '-6px',
                                                                            right: '-2px',
                                                                            background: 'white',
                                                                            color: 'black',
                                                                            borderRadius: '50%',
                                                                            width: '16px',
                                                                            height: '16px',
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            cursor: 'pointer',
                                                                            fontSize: '10px',
                                                                            fontWeight: 'bold',
                                                                            boxShadow: '0px 0px 5px rgba(0,0,0,0.3)',
                                                                        }}
                                                                    >
                                                                        <MdClose />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className={styles.itemActions}>
                                                <div className={styles.actionButtons}>
                                                    {/* Placeholder for any extra actions */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '150px' }}>
                                <img src={images.noUser} className={styles.iconNo} />
                                <p className={styles.textNo}>No Expense Items Available</p>
                            </div>
                        )}

                    </div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className={` mt-3 ${styles.btnSave}`}
                        disabled={loader === true}
                        style={loader ? { width: "100%" } : {}}
                    >
                        {loader ? (
                            <div className={styles.Loginloadercontainer}>
                                <FaSpinner className={styles.spinnerLogin} />
                                <span className={styles.loaderText}>
                                    Please wait...
                                </span>
                            </div>
                        ) : (
                            props.flag === 'edit' ? "Update Expense Report" : "Save Expense Report"
                        )}
                    </button>
                </div>
            </div>
            <AddSubExpense
                showAddExpense={showAddExpense}
                onHide={onHide}
                addExpenseData={props.addExpenseData}
                setAddExpenseData={props.setAddExpenseData}
                expenseCategoryList={expenseCategoryList}
                setError={props.setError}
                error={props.error}
                expense={props.expense}
                flag={props.flag}
                setShowAddExpense={setShowAddExpense}
                setFlag={props.setFlag}
                setExpenseSubCategoryList={setExpenseSubCategoryList}
                expenseSubCategoryList={expenseSubCategoryList}
                expenseId={props.showData?.expenseId}
                setItemFlag={props.setItemFlag}
                itemFlag={props.itemFlag}
            />

            <Modal show={showImageModal} size="lg" centered onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Check your uploaded images</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {previewImage && (
                        <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
                            <img src={previewImage} alt="Full View" style={{ width: '300px', height: '300px', borderRadius: '8px', objectFit: 'cover' }} />
                        </div>
                    )}
                    {selectedImage && selectedImage.map((img, index) => {
                        return (
                            <div
                                key={index}
                                style={{ position: 'relative', margin: '10px', cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => setPreviewImage(img?.imageUri)}
                            >

                                <img
                                    src={img?.imageUri}
                                    alt="Uploaded"
                                    style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                                {hoveredIndex === index && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteExpAttachment(img, index)
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
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
                        )
                    }

                    )}
                </Modal.Body>
            </Modal>
            <DeleteDialog
                show={showDeleteModal}
                title={'Are you sure !!'}
                heading={"Delete item"}
                message={"You want to delete this item"}
                handleDelete={handleDeleteConfirm}
                handleClose={() => setDeleteModal(false)}
                loader={itemLoader}
            />
            {
                showDeleteImgModal && (
                    <DeleteDialog
                        show={showDeleteImgModal}
                        title={'Are you sure !!'}
                        heading={"Delete item image"}
                        message={"You want to delete this attachement"}
                        handleDelete={deleteImageByID}
                        handleClose={() => setShowDeleteImgModal(false)}
                        loader={itemAttLoader}
                    />
                )
            }
            {
                showDeleteExpImg && (
                    <DeleteDialog
                        show={showDeleteExpImg}
                        title={'Are you sure !!'}
                        heading={"Delete expense attachement"}
                        message={"You want to delete this attachement"}
                        handleDelete={onConfirmDelete}
                        handleClose={() => setShowDeleteExpImg(false)}
                        loader={expLoader}
                    />
                )
            }
        </div >
    );
};

export default AddExpense;
