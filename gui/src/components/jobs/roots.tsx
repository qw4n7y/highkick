import React from 'react'

import Jobs from '../../services/jobs'

import Job from '../../models/job'
import Leaf from './leaf'
import TreeLeaves from '../tree/leaves'
import Paginator from '../misc/paginator'

type Props = {}
type State = {
  loading: boolean
  page: number
  maxPage: number
  roots: Job[]
}

class RootsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      loading: true,
      page: 1,
      maxPage: 1,
      roots: []
    }
    
    this.onPageChange = this.onPageChange.bind(this)
  }

  componentDidMount() {
    this.loadItems(1).then(() => {})
  }

  render() {
    const { loading, roots, page, maxPage } = this.state

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
          items={roots}
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
    const roots = await Jobs.loadRoots({ page })
    this.setState({
      loading: false,
      page,
      roots,
      maxPage: Math.max(maxPage, page + 1),
    })
  }
}

export default RootsList