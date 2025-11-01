import { useEffect, useState } from 'react';
import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/Expenses/ExpenseReimburseDetails.module.css";
import { getDataById, handleDeleteExpense, handleSubmitButton } from '../../actions/Expenses/ExpenseAction';
import { useDispatch, useSelector } from 'react-redux';
import { handleExpenseEnteryItemEdit } from '../../Redux/Expense/ExpenseAction';
import { getExpenseImages } from '../../services/MainExpense/ExpenseService';
import moment from 'moment';
import ConfirmationDialog from '../ConfirmationDialog';
import ImageViewer from '../ImageViewer';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import { setAlertMessage } from '../../common/common';
import style from "../../assets/css/Expenses/ShowExpenseBox.module.css"
import dayjs from 'dayjs';

const ShowExpenseBox = (props) => {
  const dispatch = useDispatch();
  // const { expenseDetail } = useSelector((store) => store.expense);
  // const [dataShow, setDataShow] = useState([]); // Page
  const [activeTab, setActiveTab] = useState("expense");
  const [showDialog, setShowDialog] = useState(false);
  const [confirmLoader, setConfirmLoader] = useState(false);
  const [provideData, setProvideData] = useState([]);//Page
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [itemImages, setItemImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (props.pageType !== 'Report') {
      setExpandedIds([]);
      getDataById(
        props.showData?.expenseId,
        props.setDataShow,
        props.setProvideData,
        setImageData,
        props.selectedEmployee,
        props.employeeView,
        props.ownerPanel,
        props.setExpenseData,
        setTotal
      );
    }

  }, [props.showData?.expenseId, props.renderData, props.selectedEmployee, props.trigger]);

  const handleShowDelete = () => {
    setShowDeleteBox(true);
  };

  const deleteExpenseById = () => {
    handleDeleteExpense(
      props.showData.expenseId,
      props.selectedYear,
      props.selectedMonth,
      setConfirmLoader,
      setShowDeleteBox,
      props.setTrigger
    );
  };

  const handleEdit = (item) => {
    props.setFlag('edit');
    const company = localStorage.getItem('company');
    const empCode = props.employeeView ? props.selectedEmpCode : localStorage.getItem("empCode");

    props.setShowExpenseModal(true);

    getExpenseImages(company, props.showData?.expenseId, empCode).then((response) => {
      if (response.status === 'success') {
        let object = {
          ...props.addExpenseData,
          imageData: response.data.imagesArray,
          items: response.data.itemExpense
        };

        props.setExpense({
          cityName: item.title,
          from: item.dateFrom,
          to: item.dateTo,
          imageData: response.data.imagesArray,
          expenseId: props.showData.expenseId,
          expensePurpose: item.expensePurpose
        });
        dispatch(handleExpenseEnteryItemEdit(object));
      } else {
        props.setProvideData([]);
      }
    });
  };



  const handleSubmitData = () => {
    const totalAmount = props.provideData.reduce((sum, item) => sum + item.amount, 0);
    if (totalAmount === 0) {
      setAlertMessage('error', 'Oops! ₹0 expense item can’t be submit.');
      return;
    }

    if (props.checkReviewer) {
      setConfirmLoader(true);
      handleSubmitButton(
        props.showData?.expenseId,
        props.provideData,
        props.dataShow.dateFrom,
        props.dataShow.dateTo,
        props.selectedYear,
        props.selectedMonth,
        props.showData?.status,
        props.setTrigger,
        setConfirmLoader,
        setShowDialog,
        props.managerEmail,
        props.provideData
      );
    } else {
      setAlertMessage('error', 'Your expense flow is not completed yet. Please contact to Administrator.');
    }
  };
  //  console.log(props.provideData)
  return (
    <>
      <div className={style.expenseCardHeader} style={{ marginTop: 0, paddingTop: 0 }}>
        <span className={styles.titleSection} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>

          {props.dataShow?.title !== undefined
            ? `${props.dataShow.title} Expense Report`
            : 'Expense Report'}
        </span>
        {props.dataShow.status && (
          <span className={`
            ${styles.statusBadge}
            ${props.dataShow.status === 'Approved' ? styles.approved : ''}
            ${props.dataShow.status === 'Submitted' ? styles.submitted : ''}
            ${props.dataShow.status === 'Reimbursed' ? styles.reimbursed : ''}
            ${props.dataShow.status === 'Rejected' ? styles.rejected : ''}
            ${props.dataShow.status === 'Pending Approval' ? styles.pendingApproval : ''}
            ${props.dataShow.status === 'Under Review' ? styles.underReview : ''}
            ${props.dataShow.status === 'Drafted' ? styles.drafted : ''}
          `}>
            {props.dataShow.status}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '6px', flexShrink: 0 }}>
          <span className={styles.statusBadge} style={{ background: '#0d6efd18 ', color: '#0d6efd' }}>
            {props.pageType === 'Report'
              ? (props.dataShow.expenseId ?? "N/A")
              : (props.showData?.expenseId ?? "N/A")
            }
          </span>
        </div>
      </div>

      {props.dataShow?.expensePurpose && (
        <div className={`${style.purposeWrapper} ${styles.purposeWrapper}`}>
          <img src={images.IconSavings} className={style.IconSaving} />
          <div className={styles.purposeTextBlock}>
            <h4 className={style.purposeLabel}>Expense Purpose</h4>
            <p className={style.purposeDescription}>{props.dataShow.expensePurpose}</p>
          </div>
        </div>
      )}
      {props.dataShow?.status === 'Rejected' && props.dataShow.rejectReason && (
        <div className={style.rejectedWrapper2}>
          <img src={images.iconAlertWarning} className={style.Iconwar} />
          <div className={style.purposeTextBlock}>
            <h4 className={style.purposeLabelreject}>Rejected Reason</h4>
            <p className={style.purposeDescriptionrej}>{props.dataShow.rejectReason}</p>
          </div>
        </div>
      )}

      <div className={style.totalAmount}>
        <img src={images.iconRupee} className={`${style.iconRupee}`} />
        {` ${parseFloat(props.dataShow?.totalAmount).toFixed(2)}`}
      </div>

      <div className={styles.dateAttachmentContainer}>
        <span className={styles.dateRange}>
          {`${moment(props.dataShow.dateFrom).format("DD MMM YYYY")} To ${moment(props.dataShow.dateTo).format("DD MMM YYYY")}` || "N/A"}
        </span>
        {(props.dataShow?.status === "Drafted" || props.dataShow?.status === "Rejected") &&
          !props.employeeView &&
          !props.ownerPanel && (
            <div className={styles.buttonStatus}>
              <img
                onClick={() => handleEdit(props.dataShow)}
                src={images.iconEdit}
                className={styles.iconEdit}
                title="Edit"
                alt="icon"
              />
              <img
                onClick={handleShowDelete}
                src={images.iconDeleted}
                className={styles.iconDeleted}
                title="Delete"
                alt="icon"
              />
            </div>
          )}
      </div>
      {props.pageType !== 'Report' && (
        <div className={styles.tabContainer}>
          {["expense", "history"].map(tab => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>
      )}
      {props.pageType === 'Report' && (
        <div className={styles.tabContainer}>
          {["expense"].map(tab => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>
      )}

      {activeTab === "expense" ? (
        <>
          <div className={style.pageScroll}
            style={{
              height: (props.dataShow?.status === 'Rejected' && props.dataShow?.rejectReason) ? 'calc(100vh - 580px)' : 'calc(100vh - 460px)',
              overflow: 'auto',
              marginBottom: '10px',
            }}>
            <div className={style.expenseListWrapper}>
              <div className="accordion" id="accordionExample">
                {props.provideData?.length > 0 ? (
                  [...props.provideData]
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((expense, index) => {
                      const hasDescription = !!expense?.description;
                      return (
                        <div className={`accordion-item ${style.accordionItem}`} key={index}>
                          <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                              className={`${!hasDescription ? 'disabled' : ''} ${style.accordionButton}`}
                              type="button"
                              aria-expanded={expandedIds.includes(index)}
                              onClick={(e) => {
                                if (!hasDescription) {
                                  e.preventDefault();
                                } else {
                                  setExpandedIds(prev =>
                                    prev.includes(index)
                                      ? prev.filter(id => id !== index)
                                      : [...prev, index]
                                  );
                                }
                              }}
                            >
                              <div className='d-flex align-items-center justify-content-between w-100'>
                                <span className={style.titleCategory}>
                                  {expense.subCategory}
                                  <p className={style.dateShow}>{dayjs(expense.date).format('DD MMM YYYY')}</p>
                                </span>
                                <div className={style.expenseAmountBlock}>
                                  <span className={style.expenseAmount}>
                                    <img src={images.iconRupee} className={style.iconRupee1} />
                                    {` ${parseFloat(expense.amount).toFixed(2)}`}
                                  </span>
                                  {expense?.images?.length > 0 && (
                                    <img
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowImageModal(true);
                                        setItemImages(expense?.images || []);
                                      }}
                                      src={images.IconVeiwImg}
                                      className={style.iconVeiwImg}
                                    />
                                  )}
                                  <div style={{ width: '15px' }}>
                                    {hasDescription && (
                                      <img
                                        src={images.rightArrow}
                                        className={style.toggleIcon}
                                        style={{
                                          transform: expandedIds.includes(index) ? 'rotate(-90deg)' : 'rotate(90deg)',
                                          transition: 'transform 0.3s ease',
                                        }}
                                        alt="toggle"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          </h2>

                          {hasDescription && expandedIds.includes(index) && (
                            <div className="accordion-collapse show">
                              <div className={style.accordionBody}>
                                <div className={style.expenseDescription}>
                                  <p className={style.descriptionText}>{expense.description}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 'calc(100vh - 480px)' }}>
                    <img src={images.noUser} className={styles.iconNo} />
                    <p className={styles.textNo}>No expense item available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {props.pageType !== 'Report' && (
            <div className={style.footerFixed}>
              <div className={style.expenseTotal2}>
                <div className={`mb-1 ${styles.subTotal}`}>
                  <h4>Sub Total</h4>
                  <div className={style.priceDiv}>
                    <img src={images.iconRupee} className={style.iconRupee1} />
                    <p>{` ${parseFloat(total).toFixed(2)}`}</p>
                  </div>
                </div>
                <div className={styles.subTotal}>
                  <h4>Expense Total (INR)</h4>
                  <div className={style.priceDiv}>
                    <img src={images.iconRupee} className={style.iconRupee1} />
                    <p>{` ${parseFloat(total).toFixed(2)}`}</p>
                  </div>
                </div>
              </div>
              {(props.dataShow?.status === "Drafted" || props.dataShow?.status === "Rejected") &&
                !props.employeeView &&
                !props.ownerPanel && (
                  <button className={style.reimburseButton} onClick={() => setShowDialog(true)}>
                    Submit
                  </button>
                )}
            </div>
          )
          }

        </>
      ) : (
        <div className={styles.scrollableHistory}>
          {props.historyData.length > 0 ? (
            props.historyData.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.circle}></div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.event}</h3>
                  <p className={styles.details}>
                    {item.by} | {`${moment(item.at).format("DD MMM YYYY HH:mm A")}`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center " style={{ height: '150px' }}>
              <img src={images.noUser} className={styles.iconNo} />
              <p className={styles.textNo}>No history available</p>
            </div>
          )}
        </div>
      )}

      <ConfirmationDialog
        show={showDialog}
        handleClose={() => { setShowDialog(false); setConfirmLoader(false); }}
        handleConfirm={handleSubmitData}
        message={"Are you sure you want to submit this expense?"}
        title={"Expense submit"}
        loader={confirmLoader}
        heading={"Expense submit"}
      />

      <ImageViewer
        files={itemImages}
        selectedFileName={""}
        isOpen={showImageModal}
        onClose={() => { setShowImageModal(false); setItemImages([]); }}
        setLoading={setLoading}
        loading={loading}
      />

      <DeleteDialog
        heading={'Delete Expense'}
        show={showDeleteBox}
        handleClose={() => { setShowDeleteBox(false); setConfirmLoader(false); }}
        handleDelete={deleteExpenseById}
        message={" Are you sure you want to delete this expense?"}
        title={" Delete Expense "}
        loader={confirmLoader}
      />
    </>
  );
};

export default ShowExpenseBox;