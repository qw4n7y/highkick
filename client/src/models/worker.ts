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
}

export default Worker