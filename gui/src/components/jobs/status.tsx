import React from 'react'
import { Badge } from 'react-bootstrap'

import { Status } from '../../models/job'

type Props = {
  title?: string
  status: Status
}

const StatusComponent: React.FC<Props> = (props: Props) => {
  const { title, status } = props

  const variant = (status === 'completed') ? 'success' : ((status === 'failed') ? 'danger' : 'info' )
  const sign = (status === 'completed') ? '✌' : ((status === 'failed') ? '✘' : '༗' )
  return (
    <h5 className="m-0 p-0">
      <Badge variant={variant}>{title}{sign}</Badge>
    </h5>)
}

export default StatusComponent