import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Filters from '../../models/filters'
import { Funnel, PlusCircle } from 'react-bootstrap-icons'

type Props = {
  value: Filters
  onChange: (value: Filters) => any
}

class FiltersComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  render() {
    const { value } = this.props
    return (
      <form onChange={this.onChange}>
        <div className="form-row">
          <div className="col-1">
            <Funnel/>
          </div>
          <div className="col-10">
            <input
              type="text"
              className="form-control form-control-sm"
              name="Type"
              placeholder="Job"
              value={value.Type}
            />
          </div>
          <div className="col-1">
            <RouterLink to={"/new"} className="btn btn-light">
              <PlusCircle/>
            </RouterLink>
          </div>
        </div>
      </form>
    )
  }

  private onChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const value: Filters = {}
    if (formData.get("Type") !== "") { value.Type = formData.get("Type") as string }
    this.props.onChange(value)
  }
}

export default FiltersComponent