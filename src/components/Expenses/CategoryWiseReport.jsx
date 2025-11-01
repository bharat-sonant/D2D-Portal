import { useEffect, useState } from "react";
import style from "../../assets/css/Designation/DesignationList.module.css";
import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/Expenses/ShowExpenseBox.module.css"
const CategoryWiseReport = (props) => {
  const [data, setData] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    if (props.expenseData) {
      const grouped = Object.values(
        props.expenseData.reduce((acc, item) => {

          if (!acc[item.name]) {
            acc[item.name] = {
              name: item.name,
              amount: 0,
              items: []
            };
          }
          acc[item.name].amount += item.amount;
          acc[item.name].items.push(item);
          return acc;
        }, {})
      );
      setData(grouped)
    }
  }, [props.expenseData])


  return (
    <div className={style.Detailscard} >
      <div className={style.card_header}>
        <h5 className={style.heading}>Expense Summary</h5>
      </div>
      <div className={style.Scroll_List}
        style={{
          minHeight: '200px',
          maxHeight: 'calc(100vh - 170px)',
          overflowY: 'auto',
        }}
      >
        {data && data.length > 0 ? (
          <ul className={style.listLine}>
            {data.map((expense, i) => {
              return (
                <div className={`accordion-item ${styles.accordionItem}`} key={i}>
                  <h2 className="accordion-header" id={`heading${i}`}>
                    <button
                      className={`${styles.accordionButton}`}
                      type="button"
                      data-bs-target={`#collapse${i}`}
                      aria-expanded="false"
                      aria-controls={`collapse${i}`}
                      onClick={(e) => {
                        setExpanded(prev => (prev === i ? null : i));
                        setSelectedName(selectedName === expense.name ? null : expense.name)
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <div>
                          <span className={styles.titleCategory}>
                            {expense.name}
                          </span>
                        </div>
                        <div className={styles.expenseAmountBlock}>
                          {/* You can uncomment this if amount is needed */}
                          <span className={styles.expenseAmount}>
                            <img
                              src={images.iconRupee}
                              className={styles.iconRupee1}
                              alt="rupee"
                            />
                            {` ${parseFloat(expense.amount).toFixed(2)}`}
                          </span>
                          <div style={{ width: '15px' }}>
                            {/* Optional icon toggle */}
                            <img
                              src={images.rightArrow}
                              className={styles.toggleIcon}
                              style={{
                                transform: expanded === i ? 'rotate(-90deg)' : 'rotate(90deg)',

                                transition: 'transform 0.3s ease',
                              }}
                              alt="toggle"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </h2>


                  {expanded === i && (
                    <div
                      className="accordion-collapse collapse show"
                      aria-labelledby={`heading${i}`}
                    >
                      <div className={styles.accordionBody}>
                        <div className={styles.expenseDescription}>
                          {selectedName === expense.name &&
                            expense.items.map((item, t) => (
                              <div
                                key={t}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  margin: '8px 0',
                                  fontSize:'14px' 
                                }}
                              >
                                <span className={styles.descriptionText}>{item.subCategory}</span>
                                <span className={styles.expenseAmount}>   <img src={images.iconRupee} className={styles.iconRupee1} />{item.amount}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              );
            })}
          </ul>
        ) : (
          <div className={style.dropdownItemNot}>
            <img src={images.imgComingSoon} className={style.foundNot} alt="Not found" />
            No summary found
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryWiseReport;
