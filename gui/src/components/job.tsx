import React from 'react'

import Job from '../models/job'
import TreeLeaf from './tree_leaf'

type Props = {
  job: Job
}

const JobComponent: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <p>{ JSON.stringify(props.job) }</p>
    </div>)
}

class JobsTreeLeaf extends TreeLeaf<Props> {}

export default JobComponent
export { JobsTreeLeaf }