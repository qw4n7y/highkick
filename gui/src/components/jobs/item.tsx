import React from 'react'
import { Row, Col, ButtonGroup, Button, Badge, Table } from 'react-bootstrap'

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
        <Row>
          <Col md={1}>{job.id}</Col>
          <Col md={3}>{job.type}</Col>
          <Col md={2}>
            <code>{job.input}</code>
          </Col>
          <Col md={2}>
            <code>{job.output}</code>
          </Col>
          <Col md={2}>
            <Badge variant="primary">{job.status}</Badge>
          </Col>
          <Col md={2}>
            <ButtonGroup size="sm">
              <Button key="update" onClick={this.updateItem}>Up</Button>
              <Button key="logs" onClick={this.showLogs}>Logs</Button>
              <Button key="retry" onClick={this.retry}>Retry</Button>
            </ButtonGroup>
          </Col>
        </Row>
        { this.renderLogs() }
      </>)
  }

  renderLogs() {
    const { showLogs, jobLogs } = this.state

    if (!showLogs) { return null }
    return (
      <div style={{ fontSize: '12px', overflowY: 'scroll' }}>
        <Table size="sm">
          { jobLogs.map(jobLog => {
            return (
              <tr key={jobLog.id}>
                <td>{jobLog.createdAt}</td>
                <td>{jobLog.content}</td>
              </tr>)
          }) }
        </Table>
      </div>
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