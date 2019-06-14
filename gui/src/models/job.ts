import TreeLeaf from './tree_leaf'

export type Status = 'initial' | 'processing' | 'failed' | 'completed'

type Props = {
  id: number
  type: string
  path: string
  sid: string
  input: string
  output: string
  status: Status
  createdAt: string

  childs: Job[]
}

class Job implements Props, TreeLeaf {
  id: number = 0
  type: string = ''
  path: string = ''
  sid: string = ''
  input: string = ''
  output: string = ''
  status: Status = 'initial'
  createdAt: string = ''

  childs: Job[] = []

  constructor(props: Partial<Props>) {
    if(props.id) { this.id = props.id }
    if(props.type) { this.type = props.type }
    if(props.path) { this.path = props.path }
    if(props.sid) { this.sid = props.sid }
    if(props.input) { this.input = props.input }
    if(props.output) { this.output = props.output }
    if(props.status) { this.status = props.status }
    if(props.createdAt) { this.createdAt = props.createdAt }

    if(props.childs) { this.childs = props.childs }
  }

  isRoot() {
    return this.path === ''
  }

  parentID() {
    if (this.isRoot()) {
      return null
    }
    const ids = this.path.split('/').map(i => parseInt(i))
    return ids[ids.length - 1]
  }

  digest() {
    return `${this.id}${this.status}`
  }

  static deserialize(json: any): Job {
    const job = new Job(json as Partial<Props>)
    return job
  }
}

export default Job