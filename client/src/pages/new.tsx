import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../redux/state'

import JobMeta from '../models/job_meta'
import { Form, Button } from 'react-bootstrap'
import JsonEditor from './../components/misc/json_editor'

import Actions from '../redux/actions/jobs'

type Props = {
  jobMetas?: JobMeta[]
  runJob?: (sid: string, input: any) => Promise<any>
}

type State = {
  jobSID?: string
  input?: any
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
    this.onJobSIDChange = this.onJobSIDChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const sortedJobMetas = (this.props.jobMetas || []).sort(function (a, b) {
      return a.Title.localeCompare(b.Title);
    })

    return (
      <>
        <h3>Run new job</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label>SID</Form.Label>
            <Form.Control as="select" custom
              onChange={this.onJobSIDChange}
            >
              <option className="text-muted" value="">Choose job to create</option>
              {sortedJobMetas.map(jobMeta => {
                return (<option value={jobMeta.SID}>{jobMeta.Title}</option>)
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            {this.renderInputEditor()}

            <blockquote className="blockquote">
              <p className="mb-0">{JSON.stringify(this.state.input)}</p>
              <footer className="blockquote-footer">would be sent as job input</footer>
            </blockquote>
            
          </Form.Group>
          <Button variant="light" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </>
    );
  }

  renderInputEditor() {
    const { jobSID } = this.state
    const jobMeta = (this.props.jobMetas || []).find(c => c.SID === jobSID)
    if (!jobMeta) { return }

    if (!jobMeta.InputJSONSchema) {
      return (
        <div className="alert alert-primary">
          No input JSON schema defined for this Job
        </div>
      )
    }

    const jsonSchema = JSON.parse(jobMeta.InputJSONSchema!)
    return (
      <JsonEditor
        label="Input"
        jsonSchema={jsonSchema}
        defaultValue={this.state.input}
        onChange={newValue => {
          this.setState({
            input: newValue
          })
        }}
      />
    )
  }

  private async onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const response = await this.props.runJob!(this.state.jobSID!, this.state.input)
    alert(JSON.stringify(response))
    window.location.reload()
    
    return false
  }

  private onJobSIDChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const jobSID = event.target.value
    if (jobSID === "") {
      this.setState({ jobSID: undefined })
    } else {
      this.setState({ jobSID })
    }
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  jobMetas: state.jobMetas,
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  runJob: (sid: string, input: any) => dispatch(Actions.run(sid, input)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)
