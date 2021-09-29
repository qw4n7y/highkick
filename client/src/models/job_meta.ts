class JobMeta {
  SID!: string
  // Title!: string
  InputJSONSchema?: string

  constructor(props: Partial<JobMeta>) {
    // super()
    for(const prop in props) {
      (this as any)[prop] = (props as any)[prop]
    }
  }

  static deserialize(json: any): JobMeta {
    const job = new JobMeta(json as Partial<JobMeta>)
    return job
  }
}

export default JobMeta