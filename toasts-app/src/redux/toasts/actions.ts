import Toast, { ToastType } from '../../models/toast'

// Types

export const ADD_TOAST = 'TOASTS/ADD'
export const REMOVE_TOAST = 'TOASTS/REMOVE'
export const UPDATE_TOAST = 'TOASTS/UPDATE'
export const SNOOZE_TOASTS = 'TOASTS/SNOOZE'

// Actions

export class AddToast {
  type = ADD_TOAST
  constructor(public item: Toast) { }
}

export class RemoveToast {
  type = REMOVE_TOAST
  constructor(public item: Toast) { }
}

export class UpdateToast {
  type = UPDATE_TOAST
  constructor(public item: Toast) { }
}

export class SnoozeToasts {
  type = SNOOZE_TOASTS
  constructor(public snoozed: boolean) { }
}

// Action creators

function addToast(toast: Toast) {
  toast.id = Math.random() // since we sync between tabs global id should be random or synced as well
  
  return async (dispatch: any) => {
    dispatch(new AddToast(toast))

    if (toast.autoClose || toast.type === ToastType.Notice) {
      setTimeout(() => {
        dispatch(new RemoveToast(toast))
      }, 5000)
    }
    
    return toast
  }
}

export default { addToast }