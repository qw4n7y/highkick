import React from 'react'

import Filters from '../../models/filters'

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
      <form onChange={this.onChange} className="alert alert-info">
        <div className="form-row">
          <div className="col-7">
            <div className="form-check form-check-inline">
              <input 
                className="form-check-input"
                type="radio"
                name="IsPeriodical"
                id="IsPeriodicalTrue"
                value="1"
                checked={value.IsPeriodical === true}
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
                checked={value.IsPeriodical === false}
              />
              <label className="form-check-label" htmlFor="IsPeriodicalFalse">
                Non periodical
              </label>
            </div>
          </div>
          <div className="col-5">
            <input
              type="text"
              className="form-control"
              name="Type"
              placeholder="Job"
              value={value.Type}
            />
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