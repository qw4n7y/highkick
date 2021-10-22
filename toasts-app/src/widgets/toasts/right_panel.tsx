import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from '../../redux/state'

import Actions, { SnoozeToasts } from '../../redux/toasts/actions'
import Toast, { ToastType } from '../../models/toast'
import List from './list'
import { Bell } from 'react-bootstrap-icons'

type Props = {
  toasts?: Toast[]
  snoozed?: boolean
  addToast?: (toast: Toast) => any
  snoozeToasts?: (snoozed: boolean) => any
}

function RightToastsPanel(props: Props) {
  let toasts = props.toasts || []
  let importantToasts = toasts.filter(t => t.type === ToastType.Important)
  let noticeToasts = toasts.filter(t => t.type === ToastType.Notice)

  return (
    <div 
      className="d-flex flex-column" 
      style={{ 
        position: 'fixed', 
        bottom: 20, right: 20, 
        width: 200, maxHeight: '90vh', 
        overflowY: 'scroll',
        zIndex: 1000,
      }}
    >
      <List toasts={noticeToasts}/>
      { !props.snoozed && <List toasts={importantToasts}/> }
      {/* <button
        onClick={() => props.addToast!({ type: ToastType.Important, title: 'Test toast', content: 'Wazza', autoClose: false })}
      >Add toast</button> */}
      { toasts.length > 0 && (
        <button className="btn btn-light"
          onClick={() => props.snoozeToasts!(!props.snoozed)}
        ><Bell/>&nbsp;{ props.snoozed ? 'Unsnooze' : 'Snooze' }</button>
      ) }
    </div>
  )
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  toasts: state.toasts.items,
  snoozed: state.toasts.snoozed,
})
const mapDispatchToProps = (dispatch: any) => ({
  addToast: (toast: Toast) => dispatch(Actions.addToast(toast)),
  snoozeToasts: (snoozed: boolean) => dispatch(new SnoozeToasts(snoozed)),
})
const connected = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RightToastsPanel)
export default connected