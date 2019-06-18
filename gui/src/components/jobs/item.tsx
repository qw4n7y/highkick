import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../../redux/state'
import Actions from '../../redux/actions/jobs'

import ReactJsonView from 'react-json-view'
import { ButtonGroup, Button, Card } from 'react-bootstrap'

import StatusComponent from './status'

import Job from '../../models/job'
import JobLog from '../../models/job_log'
import Jobs from '../../services/jobs'
import JobLogs from '../../services/job_logs'

type Props = {
  job: Job
  expandTreeLeaf: () => any

  update?: (job: Job) => any
  destroy?: (job: Job) => any
}

type State = {
  showLogs: boolean
  jobLogs: JobLog[]
}

class JobComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      showLogs: false,
      jobLogs: []
    }

    this.updateItem = this.updateItem.bind(this)
    this.showLogs = this.showLogs.bind(this)
    this.retry = this.retry.bind(this)
    this.retryFailedChildren = this.retryFailedChildren.bind(this)
    this.destroy = this.destroy.bind(this)
  }

  render() {
    const { job } = this.props
    const treeStatus = job.treeStatus || Jobs.treeStatus(job)
    const input = job.input !== "" ? JSON.parse(job.input) : {}
    const output = job.output !== "" ? JSON.parse(job.output) : {}

    return (
      <>
        <div className="d-flex">
          <div className="mr-1 text-muted" style={{ fontSize: 12 }}>{job.id}</div>
          <div
            className="mr-1 font-italic"
            style={{fontSize: '12px', maxWidth: '150px', overflow: 'scroll'}}
          >{job.type}</div>
          <div className="flex-fill d-flex flex-column">
            <ReactJsonView
              src={input}
              collapsed={true}
              displayDataTypes={false}
              enableClipboard={false}
              style={{fontSize: 10}}
            />
            <ReactJsonView
              src={output}
              collapsed={true}
              displayDataTypes={false}
              enableClipboard={false}
              style={{fontSize: 10}}
            />
          </div>
          <div className="mr-1">
            <StatusComponent status={job.status}/>
          </div>
          <div className="mr-1">
            {(job.childs.length > 0 || job.isRoot()) && <StatusComponent status={treeStatus} title="🌳"/>}
          </div>
          <div>
            <ButtonGroup size="sm">
              <Button variant="light" onClick={this.updateItem}>👁</Button>
              <Button variant="light" className="text-muted" onClick={this.showLogs}>Logs</Button>
              <Button variant="light" className="text-success" onClick={this.retry}>↻</Button>
              { (treeStatus !== 'completed' && (job.childs.length > 0 || job.isRoot())) && <Button variant="light" className="text-success" onClick={this.retryFailedChildren}>↻ 🍂</Button> }
              <Button variant="light" onClick={this.destroy}>🗑</Button>
            </ButtonGroup>
          </div>
        </div>
        { this.renderLogs() }
      </>)
  }

  renderLogs() {
    const { showLogs, jobLogs } = this.state

    if (!showLogs) { return null }
    return (
      <Card className="mt-2 mb-2 bg-light" style={{ fontSize: '12px', overflowY: 'scroll' }}>
        { jobLogs.map(jobLog => {
          return (
            <div className="d-flex" key={jobLog.id}>
              <div style={{width: 150}}>{jobLog.createdAt}</div>
              <div className="flex-fill">{jobLog.content}</div>
            </div>)
        }) }
      </Card>
    )
  }

  private updateItem() {
    const { job } = this.props;
    this.props.update!(job)
    this.props.expandTreeLeaf()
  }

  private showLogs() {
    const { job } = this.props
    const { showLogs } = this.state

    if (showLogs) {
      this.setState({ showLogs: false })
      return
    }

    (async () => {
      let jobLogs = await JobLogs.loadLogs(job)
      this.setState({ showLogs: true, jobLogs })
    })()
  }

  private retry() {
    const { job } = this.props;
    if (window.confirm('Do you wanna to retry this job?') === false) {
      return
    }

    (async () => {
      await Jobs.retry(job)
    })()
  }

  private retryFailedChildren() {
    const { job } = this.props;
    if (window.confirm('Do you wanna to retry failed children of this job?') === false) {
      return
    }

    (async () => {
      await Jobs.retryFailedChildren(job)
    })()
  }

  private destroy() {
    const { job } = this.props;
    if (window.confirm('Do you wanna to destroy this job?') === false) {
      return
    }

    this.props.destroy!(job)
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  update: (job: Job) => dispatch(Actions.update(job)),
  destroy: (job: Job) => dispatch(Actions.destroy(job)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(JobComponent)