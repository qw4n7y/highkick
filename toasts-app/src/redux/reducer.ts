import { combineReducers } from "redux"

import toasts from "./toasts/reducer"

const rootReducer = () =>
  combineReducers({
    toasts,
  })

export default rootReducer
