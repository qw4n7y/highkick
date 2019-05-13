import React from 'react'

import API from '../lib/api'
import HTTP from '../lib/http'

import Job from '../models/job'
import JobComponent, { JobsTreeLeaf } from './job'

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
      const rootJsons = await HTTP.get(API.URLS.roots)
      const roots = rootJsons.map(Job.deserialize)
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
      <div>
        <ol>
          { roots.map(root => {
            return (
              <JobsTreeLeaf
                item={{job: root}}
                childs={(root.childs || []).map(job => ({job}))}
                builder={(params: {job: Job}) => {
                  return <JobComponent job={params.job}/>
                }}
              />)
          }) }
        </ol>
      </div>)
  }
}

export default RootsList