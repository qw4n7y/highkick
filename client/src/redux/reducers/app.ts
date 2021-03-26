import * as Actions from '../actions/app'

export type State = {
  viewJSONlikeAPro: boolean
}

const defaultState: State = {
  viewJSONlikeAPro: true
}

type Action = Actions.CHANGE_viewJSONlikeAPro
export default function reducer(state: State = defaultState, action: Action) {
  switch (action.type) {
    case Actions.CHANGE_VIEWJSONLIKEAPRO: {
      const a = action as Actions.CHANGE_viewJSONlikeAPro
      return Object.assign({}, state, {
        viewJSONlikeAPro: a.newValue
      } as Partial<State>)
    }
  }

  return state
}