import React from 'react'
import * as ReactRedux from 'react-redux'
import Moment from 'moment'

import ReduxState from './../../redux/state'
import Actions from '../../redux/actions/jobs'

import ReactJsonView from 'react-json-view'
import { Button, Card } from 'react-bootstrap'
import { 
  ArrowRight, ArrowDown, ArrowClockwise, Trash,
  ReceiptCutoff, BoxArrowInRight, BoxArrowRight,
  ArrowLeftRight,
} from 'react-bootstrap-icons'

import StatusComponent from './status'

import Job from '../../models/job'
import JobMeta from '../../models/job_meta'
import JobLog from '../../models/job_log'
import Jobs from '../../services/jobs'
import JobLogs from '../../services/job_logs'

type Props = {
  item: Job
  onExpand: (expanded: boolean) => any
  expanded: boolean

  jobMetas?: JobMeta[]
  loadSubtree?: (job: Job) => Promise<any>
  destroy?: () => any
  getInput?: () => Promise<any>
}

type State = {
  showLogs: boolean
  jobLogs: JobLog[]
  input: any
  showInputOutput: boolean
}

class JobComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      showLogs: false,
      jobLogs: [],
      input: null,
      showInputOutput: false,
    }

    this.loadItem = this.loadItem.bind(this)
    this.showLogs = this.showLogs.bind(this)
    this.retry = this.retry.bind(this)
    this.retryFailedLeaves = this.retryFailedLeaves.bind(this)
    this.destroy = this.destroy.bind(this)
    this.showInputOutput = this.showInputOutput.bind(this)
  }

  render() {
    const { item, expanded, jobMetas } = this.props
    const { input, jobLogs } = this.state
    const output = item.output !== "" ? JSON.parse(item.output) : {}
    const jobMeta = (jobMetas || []).find(candidate => candidate.SID === item.type)

    const treeStatus = Jobs.treeStatus(item)

    return (
      <div 
        className="p-0 m-0"
        style={{
          display: "grid",
          gridTemplateAreas: "'header actions' 'details details'",
          gridTemplateColumns: "1fr 170px",
          gridGap: "2px",
          background: treeStatus === "failed" ? "#fcede8" : treeStatus === "processing" ? "#e8f4fc" : "#f8f9fa",
        }}
        key={JSON.stringify(jobMeta)}
      >
        <div 
          style={{
            gridArea: "header",
            cursor: 'pointer'
          }}
          onClick={this.loadItem}
          className="d-flex align-items-center"
        >
          {this.renderStatus()}
          <span className="ml-1 mr-1">
            {jobMeta?.Title || item.sid}
          </span>
          <small className="text-muted ml-2 mr-2">
            {item.id}
          </small>
          <span className="flex-fill">
            { expanded ? <ArrowDown/> : <ArrowRight/> }
          </span>
          <small className="text-muted">
            {Moment(item.createdAt).fromNow()}
          </small>
        </div>

        <div style={{ gridArea: "actions" }}
          className="btn-group btn-group-sm"
        >
          <Button variant="light" 
            className={this.state.showInputOutput ? undefined : "text-muted"}
            onClick={() => this.showInputOutput(!this.state.showInputOutput)}
          ><ArrowLeftRight/></Button>
          { (item.logsCount > 0) && (
            <Button variant="light" 
              className={this.state.showLogs ? undefined : "text-muted"}
              onClick={() => this.showLogs(!this.state.showLogs)}
            ><ReceiptCutoff/></Button>) }
          <Button variant="light"
            onClick={this.retry}
          ><ArrowClockwise/></Button>
          <Button variant="light" onClick={this.destroy}
          ><Trash/></Button>
        </div>

        <div
          style={{ 
            gridArea: "details",
          }}
          className="d-flex flex-column"
        >
          <div
            style={{
              display: this.state.showInputOutput ? 'flex' : 'none'
            }}
          >
            <div className="d-flex align-items-center">
              <BoxArrowInRight className="m-2" style={{zoom: 1.5}}/>
              <ReactJsonView src={input} collapsed={false} style={{fontSize: 10}} displayDataTypes={false}/>
            </div>
            <div className="d-flex align-items-center">
              <BoxArrowRight className="m-2" style={{zoom: 1.5}}/>
              <ReactJsonView src={output} collapsed={false} style={{fontSize: 10}} displayDataTypes={false}/>
            </div>
          </div>
          
          <div
            style={{
              display: this.state.showLogs ? 'block' : 'none'
            }}
          >
            { jobLogs.map(jobLog => {
              return (
                <div className="alert alert-primary p-0 d-flex" key={jobLog.id}>
                  <small className="text-muted mr-2">{jobLog.createdAt}</small>
                  <code className="flex-fill">{jobLog.content}</code>
                </div>)
            }) }
          </div>
        </div>
      </div>)
  }

  private renderStatus() {
    const { item } = this.props
    const treeStatus = Jobs.treeStatus(item)

    if (item.status === treeStatus) {
      return <StatusComponent status={item.status}/>
    }

    return [
      <StatusComponent status={treeStatus}/>,
      <StatusComponent status={item.status}/>
    ]
  }

  private async loadItem() {
    const { item, expanded } = this.props
    if (!expanded) {
      await this.props.loadSubtree!(item)
      this.props.onExpand(true)
    } else {
      this.props.onExpand(false)
    }
  }

  private async showLogs(showLogs: boolean) {
    const { item } = this.props
    if (showLogs) {
      let jobLogs = await JobLogs.loadLogs(item)
      this.setState({ showLogs, jobLogs })
    } else {
      this.setState({ showLogs })
    }
  }

  private retry() {
    const { item } = this.props;
    if (window.confirm('Do you wanna to retry this job?') === false) {
      return
    }

    (async () => {
      await Jobs.retry(item)
    })()
  }

  private retryFailedLeaves() {
    const { item } = this.props;
    if (window.confirm('Do you wanna to retry failed children of this job?') === false) {
      return
    }

    (async () => {
      await Jobs.retryFailedLeaves(item)
    })()
  }

  private destroy() {
    if (window.confirm('Do you wanna to destroy this job?') === false) {
      return
    }
    this.props.destroy!()
  }

  private async showInputOutput(showInputOutput: boolean) {
    if (showInputOutput === true) {
      const input = await this.props.getInput!()
      this.setState({ input })
    }
    this.setState({ showInputOutput })
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  jobMetas: state.jobMetas,
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => {
  const { item } = ownProps
  return {
    loadSubtree: (job: Job) => dispatch(Actions.loadSubtree(job)),
    destroy: () => dispatch(Actions.destroy(item)),
    getInput: () => dispatch(Actions.getInput(item)),
  }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(JobComponent)