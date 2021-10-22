import React from 'react'
import ReactDOMServer from 'react-dom/server'

import Toast, { ToastType } from '../../models/toast'
import ToastsActions, * as ToastsActionsScope from './../toasts/actions'
import URLS from '../../urls'
import HTTP from '../../lib/http'
import HighkickJob, { Status } from '../../models/highkick_job'
import { Tools } from 'react-bootstrap-icons'

export type Filters = Partial<{
  JobTypes: string[]
}>

function subscribeToHighkickEventEmitter(eventEmitter: EventTarget) {
  return async (dispatch: any) => {
    eventEmitter.addEventListener('onJobCompleted', event => {
      const job = (event as any).detail.job as HighkickJob
      dispatch(ToastsActions.addToast({
        type: ToastType.Notice,
        title: 'Job completed',
        content: job.type
      }))
    })
  
    eventEmitter.addEventListener('onJobFailed', event => {
      const job = (event as any).detail.job as HighkickJob
      dispatch(ToastsActions.addToast({
        type: ToastType.Notice,
        title: 'Job failed',
        content: job.type
      }))
    })
  }
}

function pollJobStatus(jobId: number) {
  const POLL_INTERVAL = 2000
  const pause = () => new Promise((res) => setTimeout(res, POLL_INTERVAL))
 
  type PollResponse = {
    job: HighkickJob
    siblings: {[key: string]: number}
  }

  let toast: Toast = {
    type: ToastType.Important,
    title: `${jobId}: Running...`,
    autoClose: false,
  }
  
  return async (dispatch: any) => {
    toast = await dispatch(ToastsActions.addToast(toast))

    const url = URLS.highkick.job(jobId)
    while(true) {
      const response = await HTTP.get(url) as PollResponse
      
      toast.title = ReactDOMServer.renderToString(<div><Tools/>&nbsp;{jobId}&nbsp;<span className="badge badge-dark">{response.job.status}</span></div>)
      toast.contentComponentName = 'JobToast'
      toast.contentComponentProps = { job: response.job, siblings: response.siblings }
        
      await dispatch(new ToastsActionsScope.UpdateToast(toast))
      await pause()

      // Check to unsciscribe and callback
      {
        const isScheduled = response.job.status === Status.scheduled
        const isProcessing = response.job.status === Status.processing || (response.siblings[Status.processing] || 0 > 0)
        const isFailed = response.job.status === Status.failed || (response.siblings[Status.failed] || 0) > 0
        const isCompleted = !isScheduled && !isProcessing
        if (isCompleted && !isFailed) {
          // window.setTimeout(async () => {
          //   await dispatch(new ToastsActionsScope.RemoveToast(toast))
          // }, 60000) // 60 seconds to auto-close
          break
        }
      }
    }
  }
}

function getActiveRoots(filters: Filters) {
  return async (dispatch: any) => {
    const url = URLS.highkick.activeJobRoots + "?filters=" + JSON.stringify(filters)
    const response = await HTTP.get(url) as {
      Items: HighkickJob[],
      ChildrenStats: {RootID: number, ChildrenStatuses: {[status: string]: number}}[]
    }
    return response.Items.map(item => {
      item.ChildrenStatuses = response.ChildrenStats.find(cs => cs.RootID === item.id)?.ChildrenStatuses || {}
      return item
    })
  }
}

export default { subscribeToHighkickEventEmitter, pollJobStatus, getActiveRoots }