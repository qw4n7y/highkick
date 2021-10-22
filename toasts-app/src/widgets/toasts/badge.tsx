import React from 'react'
import * as ReactRedux from 'react-redux'

import ReduxState from '../../redux/state'
import Toast, { ToastType } from '../../models/toast'
import List from './list'
import { BellFill } from 'react-bootstrap-icons'

type Props = {
  toasts?: Toast[]
}

function ToastsBadge(props: Props) {
  const toasts = (props.toasts || []).filter(t => t.type === ToastType.Important)
  
  if (toasts.length === 0) { return null }

  return (
    <div className="dropdown">
      <button 
        className="btn btn-outline-dark dropdown-toggle" 
        id="toastsBadge-dropdownMenu" data-toggle="dropdown"
      >
        <BellFill/>&nbsp;{toasts.length}
      </button>
      <div className="dropdown-menu p-0 dropdown-menu-right" aria-labelledby="toastsBadge-dropdownMenu">
        <List toasts={toasts}/>
      </div>
    </div>)
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  toasts: state.toasts.items,
})
const mapDispatchToProps = (dispatch: any) => ({})
const connected = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ToastsBadge)
export default connected