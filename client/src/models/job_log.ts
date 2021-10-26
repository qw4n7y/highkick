type Props = {
  id: number
  job_id: number
  content: string
  createdAt: string
}

class JobLog implements Props {
  id: number = 0
  job_id: number = 0
  content: string = ''
  createdAt: string = ''

  constructor(props: Partial<Props>) {
    for(const prop in props) {
      (this as any)[prop] = (props as any)[prop]
    }
  }

  static deserialize(json: any): JobLog {
    const model = new JobLog(json as Partial<Props>)
    return model
  }
}

export default JobLog