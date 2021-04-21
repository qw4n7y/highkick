import React from 'react'
import { XCircle, Play, Check2, Hexagon, HourglassSplit } from 'react-bootstrap-icons'

import { Status } from '../../models/job'

type Props = {
  title?: string
  status: Status
}

const StatusComponent: React.FC<Props> = (props: Props) => {
  const { status } = props

  switch(status) {
    case 'scheduled':
      return <HourglassSplit/>
    case 'initial':
      return <Hexagon/>
    case 'processing':
      return <Play/>
    case 'failed':
      return <XCircle/>
    case 'completed':
      return <Check2/>
  }

  return null
}

export default StatusComponent