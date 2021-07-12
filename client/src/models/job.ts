import TreeLeaf from './tree_leaf'
import Moment from 'moment'

export type Status = 'scheduled' | 'initial' | 'processing' | 'failed' | 'completed'

type Props = {
  id: number
  type: string
  path: string
  sid: string
  input: string
  output: string
  status: Status
  treeStatus?: Status
  createdAt: string
  cron?: string
  logsCount: number
  StartedAt: string
  FinishedAt: string

  childs: Job[]
  childrenStatuses: {[status: string]: number}
}

class Job implements Props, TreeLeaf {
  id: number = 0
  type: string = ''
  path: string = ''
  sid: string = ''
  input: string = ''
  output: string = ''
  status: Status = 'initial'
  treeStatus?: Status = undefined
  createdAt: string = ''
  cron?: string = undefined
  logsCount: number = 0
  StartedAt: string = ''
  FinishedAt: string = ''

  childs: Job[] = []
  childrenStatuses: {[status: string]: number} = {}

  constructor(props: Partial<Props>) {
    // super()
    for(const prop in props) {
      (this as any)[prop] = (props as any)[prop]
    }
  }

  isRoot() {
    return this.path === ''
  }

  isPeriodical() {
    return this.cron !== undefined
  }

  parentID() {
    if (this.isRoot()) {
      return null
    }
    const ids = this.path.split('/').map(i => parseInt(i))
    return ids[ids.length - 1]
  }

  // TODO: use hash function
  digest(): string {
    const childsDigest = this.childs.map(c => c.digest()).join()
    return `${this.id}${this.status}${this.treeStatus}${childsDigest}`
  }

  static deserialize(json: any): Job {
    const job = new Job(json as Partial<Props>)
    return job
  }

  durationSeconds() {
    if (!this.StartedAt || !this.FinishedAt) { return 0 }
    var durMilisecs = Moment(this.FinishedAt).diff(Moment(this.StartedAt))
    return durMilisecs / 1000
  }
}

export default Job