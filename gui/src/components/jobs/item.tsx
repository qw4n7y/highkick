import React from 'react'
import { Row, Col, ButtonGroup, Button, Badge, Card } from 'react-bootstrap'

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
  }

  render() {
    const { job } = this.props

    return (
      <>
        <div className="d-flex">
          <div>{job.id}</div>
          <div>{job.type}</div>
          <div className="flex-fill d-flex">
            <code>{job.input}</code>
            <code>{job.output}</code>
          </div>
          <div>{this.renderStatus()}</div>
          <div>
            <ButtonGroup size="sm">
              <Button key="update" onClick={this.updateItem}>Up</Button>
              <Button key="logs" onClick={this.showLogs}>Logs</Button>
              <Button key="retry" onClick={this.retry}>Retry</Button>
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
}

export default JobComponent