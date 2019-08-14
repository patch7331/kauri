/** @format */

import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import allReducers from "./reducers/index";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  allReducers,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);
