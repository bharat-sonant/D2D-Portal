import {
  ExpenseAdd,
  ExpenseCategoryAdd,
  ExpenseCategoryIdAdd,
  ExpenseEntry,
  ExpenseEntryClear,
  ExpenseEntryDelete,
  ExpenseEntryEdit,
  ExpenseEntryUpdate,
  ExpenseImageUriAdd,
  ExpenseImagesAdd,
  ExpenseImagesDelete,
  ExpenseItemsEdit,
  LoadingON,
  ExpenseItemImagesAdd,
  ExpensePriceUpdateHistory,
  ExpenseEntryAdd,
  recordPunchInTime,
  recordPunchOutTime
} from './ExpenseType';

const initialState = {
  loading: false,
  message: '',
  categoryId: '',
  imageUri: '',
  punchInTime: '',
  punchoutTime: '',
  expenseItem: {
    id: '',
    name: '',
    amount: '',
    date: '',
    images: [],
    subCategoryId: "",
    subCategory: "",
    description: "",
    paymentMethod: "Online"
  },
  expenseDetail: {
    title: '',
    from: '',
    to: '',
    imageData: [],
    items: [],
    totalAmount: 0,
  },
  expenseData: [],
  categoryData: [],
  event: '',
};

export const ExpenseReducer = (state = initialState, { type, payload }) => {
  // console.log('In Reducer => payload:', {type, payload});
  // console.log('In Reducer => state:', state.expenseItem);
  // console.log('In Reducer => stateItem:', state.expenseItem);
  // console.log('In Reducer => stateItemArray:', state.expenseDetail.items);
  switch (type) {

    case LoadingON: {
      return { ...state, LoadingON: true };
    }

    case ExpenseItemsEdit: {
      return {
        ...state,
        expenseDetail: payload,
      };
    }

    case ExpenseCategoryIdAdd: {
      return {
        ...state,
        categoryId: payload,
      };
    }

    case ExpenseImageUriAdd: {
      return {
        ...state,
        imageUri: payload,
      };
    }

    case ExpenseImagesAdd: {
      return {
        ...state,
        expenseDetail: { ...state.expenseDetail, imageData: payload },
      };
    }

    // Add Images in Expense Item 
    case ExpenseItemImagesAdd: {
      const obj = {
        ...state,
        expenseDetail: {
          ...state.expenseDetail,
          items: payload,
        },
      }
      return obj
    }

    case ExpenseEntry: {
      return {
        ...state,
        expenseDetail: {
          ...state.expenseDetail,
          items: [...state.expenseDetail.items, payload],
        },
      };
    }

    case ExpenseEntryDelete: {
      return {
        ...state,
        expenseDetail: {
          ...state.expenseDetail,
          items: [...payload],
        },
      };
    }

    case ExpenseEntryUpdate: {
      let id = +state.expenseItem?.id;
      let newExpenseList = state.expenseDetail?.items.map((ele, index) =>
        index === id ? payload : ele,
      );

      return {
        ...state,
        expenseDetail: {
          ...state.expenseDetail,
          items: newExpenseList,
        },
      };


    }

    case ExpenseCategoryAdd: {
      return { ...state, categoryData: payload };
    }

    case ExpenseAdd: {
      return state;
    }

    case ExpenseImagesDelete: {
      return state;
    }

    case ExpenseEntryClear: {
      return {
        ...state,
        imageUri: '',
        expenseItem: {
          name: '',
          amount: '',
          date: '',
          images: []
        },
        expenseDetail: {
          title: '',
          from: '',
          to: '',
          imageData: [],
          items: [],
          totalAmount: 0,
        },
        // expenseDetail: {
        //   ...state.expenseDetail,
        //   imageData: [],
        //   items: [],
        //   totalAmount: 0,
        // },
      };
    }

    case ExpenseEntryEdit: {
      return { ...state, expenseItem: payload };
    }

    case ExpenseEntryAdd: {
      return { ...state, expenseItem: payload };
    }

    case ExpensePriceUpdateHistory: {
      return {
        ...state,
        event: payload
      }
    }

    case recordPunchInTime: {
      return {
        ...state,
        punchInTime: payload
      }
    }

    case recordPunchOutTime: {
      return {
        ...state,
        punchoutTime: payload
      }
    }

    default: {
      return state;
    }
  }
};
