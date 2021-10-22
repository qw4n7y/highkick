export enum Status {
  'scheduled' = 'scheduled',
  'initial' = 'initial',
  'processing' = 'processing',
  'failed' = 'failed',
  'completed' = 'completed',
}

type HighkickJob = {
  id: number
  type: string
  status: Status
  output: string | null
  StartedAt: string

  ChildrenStatuses?: {[status: string]: number}
}

export default HighkickJob