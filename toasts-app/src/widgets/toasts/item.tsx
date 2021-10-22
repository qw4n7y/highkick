import React from 'react'
import * as ReactRedux from 'react-redux'
import { Bell, BellFill } from 'react-bootstrap-icons'

import ReduxState from '../../redux/state'
import Toast, { ToastType } from '../../models/toast'
import * as ToastActions from '../../redux/toasts/actions'

import JobToast from '../highkick/job_toast'

type Props = {
  toast: Toast
  removeToast?: (toast: Toast) => any
}

class ToastItem extends React.Component<Props> {
  render() {
    const { toast } = this.props
    return (
      <div className="toast overflow-auto m-0" role="alert" style={{opacity: 1, maxHeight: 200}}>
        <div className="toast-header" style={{position: 'relative'}}>
          <span className="mr-2">
            { (toast.type === ToastType.Notice) && <Bell/> }
            { (toast.type === ToastType.Important) && <BellFill/> }
          </span>
          
          <div className="mr-auto"
            dangerouslySetInnerHTML={{__html: toast.title}}
          />
          
          <button
            type="button"
            className="ml-2 mb-1 close"
            onClick={() => this.props.removeToast!(this.props.toast)}
            style={{ position: 'absolute', right: '10px' }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        {/* if a string */}
        { (!!toast.content) && (
          <div 
            className="toast-body"
            dangerouslySetInnerHTML={{__html: toast.content!}}
          />
        ) }
        {/* if a component */}
        { (toast.contentComponentName === 'JobToast') && (
          <div className="toast-body">
            {React.createElement(JobToast, toast.contentComponentProps)}
          </div>
        ) }
      </div>)
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any) => ({
  removeToast: (toast: Toast) => dispatch(new ToastActions.RemoveToast(toast))
})
const connected = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ToastItem)
export default connected