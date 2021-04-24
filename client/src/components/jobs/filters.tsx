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
    const { jobMetas, value } = this.props
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

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  jobMetas: state.jobMetas,
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({})
export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(FiltersComponent)