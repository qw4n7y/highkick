import React from 'react'
import { XCircle, Play, Check2, Hexagon } from 'react-bootstrap-icons'

import { Status } from '../../models/job'

type Props = {
  title?: string
  status: Status
}

const StatusComponent: React.FC<Props> = (props: Props) => {
  const { status } = props

  switch(status) {
    case 'initial':
      return <Hexagon/>
    case 'processing':
      return <Play/>
    case 'failed':
      return <XCircle/>
    case 'completed':
      return <Check2/>
  }
}

export default StatusComponent