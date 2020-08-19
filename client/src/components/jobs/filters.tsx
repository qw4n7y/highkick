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
      <form onChange={this.onChange} className="jumbotron p-2 m-1">
        <div className="form-row">
          <div className="col-1">
            <Funnel/>
          </div>
          <div className="col-6">
            <div className="form-check form-check-inline">
              <input 
                className="form-check-input"
                type="radio"
                name="IsPeriodical"
                id="IsPeriodicalTrue"
                value="1"
                defaultChecked={value.IsPeriodical === true}
              />
              <label className="form-check-label" htmlFor="IsPeriodicalTrue">
                Periodical
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="IsPeriodical"
                id="IsPeriodicalFalse"
                value="0"
                defaultChecked={value.IsPeriodical === false}
              />
              <label className="form-check-label" htmlFor="IsPeriodicalFalse">
                Non periodical
              </label>
            </div>
          </div>
          <div className="col-4">
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
    if (formData.get("IsPeriodical") === "1") { value.IsPeriodical = true }
    if (formData.get("IsPeriodical") === "0") { value.IsPeriodical = false }
    if (formData.get("Type") !== "") { value.Type = formData.get("Type") as string }
    this.props.onChange(value)
  }
}

export default FiltersComponent