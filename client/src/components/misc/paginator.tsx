import React from 'react'

type Props = {
  page: number
  maxPage: number
  onPageChange: (page: number) => any
}

class Paginator extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.onPageLinkClick = this.onPageLinkClick.bind(this)
  }

  render() {
    const { maxPage } = this.props

    return (
      <nav>
        <ul className="pagination pagination-sm justify-content-center m-1">
          { Array.apply(null, Array(maxPage)).map((v, i) => {
            return this.renderPageLink(i + 1)
          }) }
        </ul>
      </nav>)
  }

  private renderPageLink(pageNumber: number) {
    const { page } = this.props
    const current = page === pageNumber

    return (
      <li 
        className="page-item" key={pageNumber}
        style={{cursor: 'pointer'}}
      >
        { current && (
            <span 
              className="page-link text-muted"
              style={{border: 'none'}}
            >{pageNumber}</span>) }
      
        { !current && (
            <a 
              className="page-link"
              style={{border: 'none'}}
              href="#"
              onClick={(event) => this.onPageLinkClick(event, pageNumber)}
            >{pageNumber}</a>) }
      </li>)
  }

  private onPageLinkClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, page: number) {
    event.preventDefault()
    this.props.onPageChange(page)
  }
}

export default Paginator