import {
  ExpenseEntry,
  ExpenseEntryClear,
  ExpenseEntryDelete,
  ExpenseEntryEdit,
  ExpenseCategoryAdd,
  ExpenseCategoryIdAdd,
  ExpenseImageUriAdd,
  ExpenseImagesAdd,
  ExpenseEntryUpdate,
  ExpenseItemsEdit,
  ExpensePriceUpdateHistory,
  ExpenseItemImagesAdd,
  ExpenseEntryAdd,
  recordPunchInTime,
  recordPunchOutTime
} from './ExpenseType';

// Expense item section
export const handleExpenseEntry = payload => dispatch => {
  dispatch({ type: ExpenseEntry, payload });
};
export const handleExpenseEntryDelete = (id, data) => dispatch => {
  if (!id && id !== 0) return;
  let newData = data.filter((ele, index) => index !== id);
  dispatch({ type: ExpenseEntryDelete, payload: newData });
};

export const handleExpenseEntryEdit = payload => dispatch => {
  dispatch({ type: ExpenseEntryEdit, payload });
};

export const handleExpenseEntryAdd = payload => dispatch => {
  dispatch({ type: ExpenseEntryAdd, payload });
};
export const handleExpenseEntryUpdate = payload => dispatch => {
  dispatch({ type: ExpenseEntryUpdate, payload });
};

// Images section
export const handleExpenseImageUriAdd = payload => dispatch => {
  dispatch({ type: ExpenseImageUriAdd, payload });
};
export const handleExpenseImagesAdd = payload => dispatch => {

  dispatch({ type: ExpenseImagesAdd, payload });
};

// Category section
export const handleExpenseCategoryIdAdd = payload => dispatch => {
  dispatch({ type: ExpenseCategoryIdAdd, payload });
};
export const handleExpenseCategoryData = payload => dispatch => {
  dispatch({ type: ExpenseCategoryAdd, payload });
};

// Clear All
export const handleExpenseAllClear = () => dispatch => {
  dispatch({ type: ExpenseEntryClear, payload: '' });
};
// new
export const handleExpenseEnteryItemEdit = payload => dispatch => {
  dispatch({ type: ExpenseItemsEdit, payload });
};


export const handleUpdateExpenseItemImage = payload => dispatch => {
  dispatch({ type: ExpenseItemImagesAdd, payload });
}

// Upadte history of price change 
export const handleExpenseUpadteHistory = payload => dispatch => {
  dispatch({ type: ExpensePriceUpdateHistory, payload });
};


export const handleSavePunchInTime = payload => dispatch => {
  dispatch({ type: recordPunchInTime, payload });
}

export const handleSavePunchOutTime = payload => dispatch => {
  dispatch({ type: recordPunchOutTime, payload });
}