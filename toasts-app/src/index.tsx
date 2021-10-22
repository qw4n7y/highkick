import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import HighkickActions from './redux/highkick/actions'

import { store } from "./redux/store"

import ToastsRightPanel from "./widgets/toasts/right_panel"

// API exposing. via window global var
;(window as any).HIGHKICK_TOASTS_APP_REDUX_STORE = store
;(window as any).HIGHKICK_TOASTS_APP_POLL_JOB_STATUS = (jobId: number) => {
  store.dispatch(HighkickActions.pollJobStatus(jobId)) 
}

var rootEl = document.getElementById("highkick-toasts-app")
if (!!rootEl) {
  ReactDOM.render(
    <Provider store={store}>
      <ToastsRightPanel />
    </Provider>,
    rootEl)
}

var rootEl2 = document.getElementById("highkick-toasts-app-sample-button")
if (!!rootEl2) {
  ReactDOM.render(
    <button
      onClick={() => {
        debugger;
        (window as any).HIGHKICK_TOASTS_APP_POLL_JOB_STATUS(999);
      }}
    >Click me</button>,
    rootEl2)
}

