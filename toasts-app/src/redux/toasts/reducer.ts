import * as Actions from './actions'
import Toast from '../../models/toast'

export type State = {
  items: Toast[]
  snoozed: boolean
}

const defaultState: State = {
  items: [],
  snoozed: false,
}

type Action = Actions.AddToast | Actions.RemoveToast | Actions.SnoozeToasts

export default function reducer(state: State = defaultState, action: Action) {
  switch (action.type) {
    case Actions.ADD_TOAST: {
      const a = action as Actions.AddToast
      let items = [...state.items]
      items.push(a.item)
      const diff: Partial<State> = { items }
      return Object.assign({}, state, diff)
    }

    case Actions.UPDATE_TOAST: {
      const a = action as Actions.UpdateToast
      let items = state.items.slice(0)
      const idx = items.findIndex(i => i.id === a.item.id)
      items[idx] = a.item
      const diff: Partial<State> = { items }
      return Object.assign({}, state, diff)
    }

    case Actions.REMOVE_TOAST: {
      const a = action as Actions.RemoveToast
      let items = [...state.items]
      items = items.filter(i => i.id !== a.item.id)
      const diff: Partial<State> = { items }
      return Object.assign({}, state, diff)
    }

    case Actions.SNOOZE_TOASTS: {
      const a = action as Actions.SnoozeToasts
      const diff: Partial<State> = { snoozed: a.snoozed }
      return Object.assign({}, state, diff)
    }
  }

  return state
}