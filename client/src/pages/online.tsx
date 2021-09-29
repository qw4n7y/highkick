import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from '../redux/state'
import Actions from '../redux/actions/jobs'
import { Link as RouterLink } from 'react-router-dom'
import { PlayBtn } from 'react-bootstrap-icons'

import Job from '../models/job'
import Filters from '../models/filters'
import Item from '../components/jobs/item'
import TreeLeaves from '../components/tree/leaves'
import FiltersComponent from '../components/jobs/filters'

type Props = {
  loadActiveRoots?: (filters: Filters) => Promise<Job[]>
}
type State = {
  filters: Filters
  loading: boolean
  items: Job[]
}

class RootsList extends React.Component<Props, State> {
  private pollInterval: null | ReturnType<typeof window.setInterval> = null
  private pulseIndicatorEl = React.createRef<HTMLDivElement>()

  constructor(props: Props) {
    super(props)

    this.state = {
      loading: true,
      filters: {},
      items: [],
    }
    
    this.loadItems = this.loadItems.bind(this)
    this.touchPulseIndicator = this.touchPulseIndicator.bind(this)
    this.onFiltersChange = this.onFiltersChange.bind(this)
  }

  componentDidMount() {
    this.loadItems()
    this.pollInterval = window.setInterval(this.loadItems, 2000) as any
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval as any)
  }

  render() {
    return (
      <>
        <div className="jumbotron p-2 m-1 d-flex align-items-center">
          <p className="flex-fill m-0 lead text-monospace font-weight-bold">
            Online&nbsp;
            <div 
              className="d-inline-block pulse-indicator"
              ref={this.pulseIndicatorEl}
            ></div>
          </p>
          <div className="flex-fill">
            <FiltersComponent
              value={this.state.filters}
              onChange={this.onFiltersChange}
            />
          </div>
          <RouterLink to={"/new"} className="btn btn-success ml-4">
            <PlayBtn/>
          </RouterLink>
        </div>
        
        { this.renderPage() }
      </>)
  }

  renderPage() {
    if (this.state.loading) {
      return (
        <div className="d-flex w-100 h-100">
          <div className="m-auto">Loading</div>
        </div>
      )
    }

    return (
      (this.state.items! || []).map(onlineRoot => (
        <TreeLeaves
          items={[onlineRoot]}
          builder={Item}
        />
      ))
    )
  }

  private async loadItems() {
    const items = await this.props.loadActiveRoots!(this.state.filters)
    this.setState({ 
      loading: false, 
      items,
    }, this.touchPulseIndicator)
  }

  private touchPulseIndicator() {
    this.pulseIndicatorEl.current?.classList.add("active")
    setTimeout(() => {
      this.pulseIndicatorEl.current?.classList.remove("active")
    }, 500)
  }

  private onFiltersChange(filters: Filters) {
    this.setState({
      filters
    })
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  loadActiveRoots: (filters: Filters) => dispatch(Actions.loadActiveRoots(filters)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RootsList)