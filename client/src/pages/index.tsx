import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from '../redux/state'
import Actions from '../redux/actions/jobs'
import AppActions from '../redux/actions/app'
import { Link as RouterLink } from 'react-router-dom'
import { Plus } from 'react-bootstrap-icons'

import Job from '../models/job'
import JobMeta from '../models/job_meta'
import Filters from '../models/filters'
import Item from '../components/jobs/item'
import TreeLeaves from '../components/tree/leaves'
import Paginator from '../components/misc/paginator'
import FiltersComponent from '../components/jobs/filters'

type Props = {
  viewJSONlikeAPro?: boolean
  jobMetas?: JobMeta[]
  roots?: Job[]
  index?: (filters: Filters, params: { page: number }) => any
  changeViewJSONlikeAPro?: (newValue: boolean) => any
}
type State = {
  filters: Filters
  loading: boolean
  page: number
  maxPage: number
}

class RootsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: true,
      page: 1,
      maxPage: 1,
      filters: {}
    }
    
    this.onPageChange = this.onPageChange.bind(this)
    this.onFiltersChange = this.onFiltersChange.bind(this)
  }

  componentDidMount() {
    this.loadItems(1).then(() => {})
  }

  render() {
    const { roots } = this.props
    const { loading, page, maxPage } = this.state

    if (loading) {
      return (
        <div className="d-flex w-100 h-100">
          <div className="m-auto">Loading</div>
        </div>
      )
    }

    return (
      <>
        <div className="jumbotron p-2 m-1 d-flex align-items-center">
          <p className="m-0 lead text-monospace font-weight-bold mr-4">Jobs</p>
          <div className="form-check form-check-inline flex-fill">
            <input 
              className="form-check-input"
              type="checkbox"
              defaultChecked={this.props.viewJSONlikeAPro}
              id="viewJSONlikeAPro"
              onChange={event => {
                this.props.changeViewJSONlikeAPro!(event.currentTarget.checked)
              }}
            />
            <label className="form-check-label" htmlFor="viewJSONlikeAPro">
              View JSON like a pro
            </label>
          </div>
          <div className="flex-fill">
            <FiltersComponent
              value={this.state.filters}
              onChange={this.onFiltersChange}
            /> 
          </div>
          <RouterLink to={"/new"} className="btn btn-success ml-4 font-weight-bold">
            <Plus/>
          </RouterLink>
        </div>
        
        <TreeLeaves
          items={roots! || []}
          builder={Item}
        />
        <Paginator page={page} maxPage={maxPage} onPageChange={this.onPageChange}/>
      </>)
  }

  private onPageChange(newPage: number) {
    this.loadItems(newPage).then(() => {})
  }

  private async loadItems(page: number) {
    const { filters, maxPage } = this.state
    await this.props.index!(filters, { page })
    this.setState({
      loading: false,
      page,
      maxPage: Math.max(maxPage, page + 1),
    })
  }

  private onFiltersChange(filters: Filters) {
    this.setState({
      filters
    }, () => {
      this.loadItems(1).then(() => {})
    })
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  roots: state.jobs,
  jobMetas: state.jobMetas,
  viewJSONlikeAPro: state.app.viewJSONlikeAPro,
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  index: (filters: Filters, params: { page: number }) => dispatch(Actions.index(filters, params)),
  changeViewJSONlikeAPro: (newValue: boolean) => dispatch(AppActions.changeViewJSONlikeAPro(newValue))
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RootsList)