import React from 'react'

import Jobs from '../../services/jobs'

import Job from '../../models/job'
import Leaf from './leaf'
import TreeLeaves from '../tree/leaves'

type Props = {}
type State = {
  loading: boolean
  roots: Job[]
}

class RootsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: true,
      roots: []
    }
  }

  componentDidMount() {
    (async () => {
      const roots = await Jobs.loadRoots()
      this.setState({ loading: false, roots })
    })()
  }

  render() {
    const { loading, roots } = this.state

    if (loading) {
      return (
        <div className="d-flex w-100 h-100">
          <div className="m-auto">Loading</div>
        </div>
      )
    }

    return (
      <TreeLeaves
        items={roots}
        builder={Leaf.builder}
      />)
  }
}

export default RootsList