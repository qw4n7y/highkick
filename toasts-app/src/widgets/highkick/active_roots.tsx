import React from 'react'
import Moment from 'moment'

import * as ReactRedux from 'react-redux'
import ReduxState from '../../redux/state'

import * as HighkickActions from '../../redux/highkick/actions'
import HighkickJob from '../../models/highkick_job'

type Props = {
  filters: HighkickActions.Filters

  fetchActiveRoots?: (filters: HighkickActions.Filters) => Promise<HighkickJob[]>
}

type State = {
  activeRoots: HighkickJob[]
}
class HighkickActiveRoots extends React.Component<Props, State> {
  private pollDataInterval: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      activeRoots: [],
    }
    this.loadData = this.loadData.bind(this)
  }

  componentDidMount() {
    this.pollDataInterval = window.setInterval(this.loadData, 2000) as any
  }

  componentWillUnmount() {
    window.clearInterval(this.pollDataInterval as any)
  }

  render() {
    return (
      <div className="d-flex">
        { this.state.activeRoots.map(job => (
          <span className="badge badge-secondary font-weight-lighter">
            <span className="pulse-indicator active"></span>&nbsp;
            {job.type}&nbsp;
            <span className="badge badge-primary font-weight-lighter">{Moment(job.StartedAt).fromNow(true)}</span>
          </span>
        )) }
      </div>)
  }

  private async loadData() {
    const items = await this.props.fetchActiveRoots!(this.props.filters)
    this.setState({
      activeRoots: items,
    })
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  fetchActiveRoots: (filters: HighkickActions.Filters) => dispatch(HighkickActions.default.getActiveRoots(filters))
})
const connected = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(HighkickActiveRoots)
export default connected