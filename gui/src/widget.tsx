import React from 'react'
import * as ReactRedux from 'react-redux'

import ReduxState from './redux/state'
import Actions from './redux/actions/jobs'

import Layout from './components/layout'
import StatusComponent from './components/jobs/status'
import Job, { Status } from './models/job'

type Props = {
  roots?: Job[]
  index?: (params: { page: number }) => any
}

type State  = {
  statuses: { [id: string]: Status }
}

class Widget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      statuses: {},
    }
  }

  componentDidMount() {
    this.props.index!({ page: 1 })
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: State = Object.assign({}, state)

    for(let i = 0; i < props.roots!.length; i++) {
      const job = props.roots![i]
      if (!state.statuses[job.id]) {
        if (job.treeStatus! != 'completed') {
          newState.statuses[job.id] = job.treeStatus!
        }
        continue
      }
      newState.statuses[job.id] = job.treeStatus! || (() => { throw new Error(`No treeStatus for root job : ${job}`) })()
    }

    return newState
  }

  render() {
    const { roots } = this.props
    const { statuses } = this.state

    return (
      <div style={{position: 'fixed', bottom: 30, right: 30 }}>
        <Layout widget>
          <ul className={"list-group p-0"}>
            { roots!.map(job => {
              const status = statuses[job.id]
              if (!status) {
                return null
              }

              const treeStatus = job.treeStatus 
              return (
                <li className="list-group-item p-0" key={job.id}>
                  <div className="d-flex">
                    <div className="mr-1 text-muted" style={{ fontSize: 12 }}>{job.id}</div>
                    <div
                      className="mr-1 font-italic flex-fill"
                      style={{fontSize: '12px', maxWidth: '150px', overflow: 'scroll'}}
                    >{job.type}</div>
                    <div className="mr-1">
                      <StatusComponent status={status}/>
                    </div>
                  </div>
                </li>)
            })}
          </ul>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  roots: state.jobs
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  index: (params: { page: number }) => dispatch(Actions.index(params)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Widget)
