import ReduxState from '../state'

import HTTP from '../../lib/http'
import API from '../../services/api'
export const CHANGE_VIEWJSONLIKEAPRO = 'CHANGE_VIEWJSONLIKEAPRO'

export class CHANGE_viewJSONlikeAPro {
  type = CHANGE_VIEWJSONLIKEAPRO
  constructor(public newValue: boolean) { }
}

function changeViewJSONlikeAPro(newValue: boolean) {
  return async (dispatch: any, getState: () => ReduxState) => {
    dispatch(new CHANGE_viewJSONlikeAPro(newValue))
  }
}

export type Hello = {
  ServerTime: string
}

function hello() {
  return async (dispatch: any, getState: () => ReduxState) => {
    const response = await HTTP.get(API.URLS.highkick.hello) as Hello
    return response
  }
}

export default { hello, changeViewJSONlikeAPro }