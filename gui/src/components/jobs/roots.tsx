import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../../redux/state'
import Actions from '../../redux/actions/jobs'

import Job from '../../models/job'
import Leaf from './leaf'
import TreeLeaves from '../tree/leaves'
import Paginator from '../misc/paginator'

type Props = {
  roots?: Job[]
  index?: (params: { page: number }) => any
}
type State = {
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
      maxPage: 1
    }
    
    this.onPageChange = this.onPageChange.bind(this)
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
    const { maxPage } = this.state
    await this.props.index!({ page })
    this.setState({
      loading: false,
      page,
      maxPage: Math.max(maxPage, page + 1),
    })
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  roots: state.jobs
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  index: (params: { page: number }) => dispatch(Actions.index(params)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(RootsList)