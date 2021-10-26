import Moment from 'moment'

class Worker {
  ID!: number
  SID!: string
  ProcessSID!: string
  Stopped!: boolean
  RunningJobsCount!: number
  HealthcheckedAt!: string
  CreatedAt!: string

  constructor(props: Partial<Worker>) {
      for(const prop in props) {
          (this as any)[prop] = (props as any)[prop]
      }
  }

  isActive() {
    const lastHealthcheckAgo = Moment().diff(Moment.utc(this.HealthcheckedAt), 'seconds')
    return lastHealthcheckAgo < 90 // < 3 mins
  }
}

export default Worker