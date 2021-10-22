enum ToastType {
  Important = 'Important',
  Notice = 'Notice'
}

// We need this model to be fully serializable (since it used in tabs sync)
//
type Toast = {
  id?: Number
  type: ToastType

  title: string

  content?: string
  contentComponentName?: string
  contentComponentProps?: any
  
  autoClose?: boolean
}

function toastKey(toast: Toast) {
  var contentPart = `${toast.content}${toast.contentComponentName}${JSON.stringify(toast.contentComponentProps)}`
  return `${toast.id}${toast.title}${contentPart}`
}

export default Toast
export { toastKey, ToastType }