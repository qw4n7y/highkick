import { State as toasts } from "./toasts/reducer"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"

type ReduxState = {
  toasts: toasts
}
export type AppDispatch = ThunkDispatch<ReduxState, any, AnyAction>

export default ReduxState
