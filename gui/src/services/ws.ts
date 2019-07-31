import * as WSIO from 'ws.io'
import { store } from '../redux/store'

import API from './api'
import Job from '../models/job'
import * as JobActions from '../redux/actions/jobs'
import EventEmitter from './event_emitter'

function handle() {
  const socket = WSIO.Socket.connect(API.URLS.ws)
  socket.on('open', () => {
    console.log('[WS] Connected')

    const subscriptionManager = new WSIO.SubscriptionManager(socket)
    
    subscriptionManager.subscribe('time').then(subscription => {
      console.log('[WS] Subscribed on `time`')
      subscription.on('message', message => {
        console.log('[WS] [time]', message)
      })
    })

    subscriptionManager.subscribe('jobs').then(subscription => {
      console.log('[WS] Subscribed on `jobs`: ', subscription)
      subscription.on('message', (message: WSIO.Message) => {
        console.log('[WS] [jobs]', message)
        const job = Job.deserialize(message.payload.job)

        // Update redux
        store.dispatch(new JobActions.Update(job))

        // Notify via event emitter
        const status = job.treeStatus || job.status
        if (status === 'completed') {
          EventEmitter.notifyJobCompleted(job)
        } else if (status === 'failed') {
          EventEmitter.notifyJobFailed(job)
        }
      })
    })
  })

  socket.on('error', (error) => {
    console.error(`Socket error ${error && error.message ? error.message : error}`)
  })

  socket.on('dead', () => {
    console.error(`[WS] Socket become dead`)
  })

  socket.on('close', (code, reason) => {
    console.error(`[WS] Socket closed ${code} ${reason}`)
  })

  socket.on('message', (message) => {
    console.log(`[WS] Got message ${JSON.stringify(message)}`)
  })
}

export default { handle }