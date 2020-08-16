import Job from '../models/job'

class EventEmitter extends EventTarget {
  notifyJobCompleted(job: Job) {
    this.dispatchEvent(
      new CustomEvent('onJobCompleted', { detail: { job } })
    )
  }
  notifyJobFailed(job: Job) {
    this.dispatchEvent(
      new CustomEvent('onJobFailed', { detail: { job } })
    )
  }
}

const eventEmitterInstance = new EventEmitter()

export default eventEmitterInstance