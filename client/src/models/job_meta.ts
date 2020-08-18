type Props = {
  SID: string
  Title: string
  InputJSONSchema?: string
}

class JobMeta implements Props {
  SID!: string
  Title!: string
  InputJSONSchema?: string

  constructor(props: Partial<Props>) {
    // super()
    for(const prop in props) {
      (this as any)[prop] = (props as any)[prop]
    }
  }

  static deserialize(json: any): JobMeta {
    const job = new JobMeta(json as Partial<Props>)
    return job
  }
}

export default JobMeta