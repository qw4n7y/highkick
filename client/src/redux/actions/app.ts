import ReduxState from '../state'

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

export default { changeViewJSONlikeAPro }