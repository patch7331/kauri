/** @format */

import "styles/application.scss";

import { h, render } from "preact";
import { Provider } from "react-redux";

import Application from "components/App";
import store from "redux/store";
store.subscribe(() => console.log(store.getState()));

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.body
);
