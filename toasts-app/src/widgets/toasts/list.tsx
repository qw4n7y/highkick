import React from 'react'
import * as ReactRedux from 'react-redux'

import ReduxState from '../../redux/state'
import Toast, { toastKey } from '../../models/toast'
import Item from './item'

type Props = {
  toasts: Toast[]
}

function ToastsList(props: Props) {
  return (
    <div className="d-flex flex-column-reverse">
      { props.toasts!.map(toast => <Item toast={toast} key={toastKey(toast)}/>)}
    </div>
  )
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any) => ({})
const connected = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ToastsList)
export default connected