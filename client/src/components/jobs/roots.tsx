import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../../redux/state'
import Actions from '../../redux/actions/jobs'

import Job from '../../models/job'
import Filters from '../../models/filters'
import Leaf from './leaf'
import TreeLeaves from '../tree/leaves'
import Paginator from '../misc/paginator'
import FiltersComponent from './filters'

type Props = {
  roots?: Job[]
  index?: (filters: Filters, params: { page: number }) => any
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
      filters: {
        IsPeriodical: false
      }
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
        <FiltersComponent
          value={this.state.filters}
          onChange={this.onFiltersChange}
        />
        <TreeLeaves
          items={roots! || []}
          builder={Leaf.builder}
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
  roots: state.jobs
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  index: (filters: Filters, params: { page: number }) => dispatch(Actions.index(filters, params)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RootsList)