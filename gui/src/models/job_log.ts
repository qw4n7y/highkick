type Props = {
  id: number
  content: string
  createdAt: string
}

class JobLog implements Props {
  id: number = 0
  content: string = ''
  createdAt: string = ''

  constructor(props: Partial<Props>) {
    if(props.id) { this.id = props.id }
    if(props.content) { this.content = props.content }
    if(props.createdAt) { this.createdAt = props.createdAt }
  }

  static deserialize(json: any): JobLog {
    const model = new JobLog(json as Partial<Props>)
    return model
  }
}

export default JobLog