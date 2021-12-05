import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../../redux/state'

import Filters from '../../models/filters'
import { Funnel } from 'react-bootstrap-icons'
import JobMeta from '../../models/job_meta'

type Props = {
  jobMetas?: JobMeta[]
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
    const jobMetas = (this.props.jobMetas || []).sort((a, b) => {
      return a.SID > b.SID ? 1 : -1
    })

    return (
      <form onChange={this.onChange}>
        <div className="d-flex align-items-center">
          <Funnel/>
          <select 
            className="form-control form-control-sm"
            name="Type"
            value={value.Type}
          >
            <option></option>
            { (jobMetas || []).map(jobMeta => (
              <option value={jobMeta.SID}>{jobMeta.SID}</option>
            ))}
          </select>
          <select 
            className="form-control form-control-sm"
            name="Status"
            value={value.Status}
          >
            <option></option>
            { ["scheduled", "initial", "processing", "failed", "completed"].map(status => (
              <option value={status}>{status}</option>
            ))}
          </select>
        </div>
      </form>
    )
  }

  private onChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const value: Filters = {}
    if (formData.get("Type") !== "") { value.Type = formData.get("Type") as string }
    if (formData.get("Status") !== "") { value.Status = formData.get("Status") as string }
    this.props.onChange(value)
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  jobMetas: state.jobMetas,
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({})
export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FiltersComponent)