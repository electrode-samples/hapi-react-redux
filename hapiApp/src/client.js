import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from 'react-router'
import configureStore from "./store.js";
import { Provider } from 'react-redux';
import routes from "./routes";
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore(window.__INITIAL_STATE__);
delete window.__INITIAL_STATE__;
const history = syncHistoryWithStore(browserHistory, store)

const reactRoot = window.document.getElementById("react-root");

window.webappStart = () => {
	ReactDOM.render(
    <Provider store={store}>
      <Router routes={routes} history={history} />
    </Provider>,
    reactRoot
	);
};