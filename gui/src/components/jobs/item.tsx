import React from 'react'
import ReactJsonView from 'react-json-view'
import { ButtonGroup, Button, Badge, Card } from 'react-bootstrap'

import Job from '../../models/job'
import JobLog from '../../models/job_log'
import Jobs from '../../services/jobs'
import JobLogs from '../../services/job_logs'

type Props = {
  job: Job
  onItemUpdate: (job: Job) => any
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
    this.destroy = this.destroy.bind(this)
  }

  render() {
    const { job } = this.props
    const input = job.input !== "" ? JSON.parse(job.input) : {}
    const output = job.output !== "" ? JSON.parse(job.output) : {}

    return (
      <>
        <div className="d-flex">
          <div className="mr-2">{job.id}</div>
          <div
            className="font-italic"
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
          <div className="mr-1">{this.renderStatus()}</div>
          <div>
            <ButtonGroup size="sm">
              <Button variant="light" onClick={this.updateItem}>👁</Button>
              <Button variant="light" className="text-muted" onClick={this.showLogs}>Logs</Button>
              <Button variant="light" className="text-success" onClick={this.retry}>↻</Button>
              <Button variant="light" onClick={this.destroy}>🗑</Button>
            </ButtonGroup>
          </div>
        </div>
        { this.renderLogs() }
      </>)
  }

  renderStatus() {
    const { job } = this.props
    const { status } = job

    return <Badge variant={status === 'failed' ? 'danger' : 'info'}>{status}</Badge>
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

    (async () => {
      let updatedJob = await Jobs.updateJob(job)
      this.props.onItemUpdate(updatedJob)
    })()
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

  private destroy() {
    const { job } = this.props;
    if (window.confirm('Do you wanna to destroy this job?') === false) {
      return
    }

    (async () => {
      await Jobs.destroy(job)
    })()
  }
}

export default JobComponent