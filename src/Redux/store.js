import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import { ExpenseReducer } from './Expense/ExpenseReducer';

import { thunk } from 'redux-thunk';

const AllReducers = combineReducers({ expense: ExpenseReducer });

export const store = legacy_createStore(AllReducers, applyMiddleware(thunk));
