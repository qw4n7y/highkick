import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from '../redux/state'
import * as ReactRouter from 'react-router'

import Job from '../models/job'
import JobMeta from '../models/job_meta'
import { Form, Button } from 'react-bootstrap'
import JsonEditor from '../components/misc/json_editor'

import Actions from '../redux/actions/jobs'

type Props = {
  jobMetas?: JobMeta[]
  show?: (id: number) => Promise<Job>
  getInput?: (job: Job) => Promise<any>
  update?: (job: Job) => Promise<any>
  updateInput: (job: Job, newInput: any) => Promise<any>
} & ReactRouter.RouteComponentProps<{
  id: string
}>

type State = {
  model: Job
  meta?: JobMeta
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      model: new Job({}),
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  async componentDidMount() {
    const idStr = this.props.match.params.id
    const id = parseInt(idStr, 10)
    const model = await this.props.show!(id)
    const input = await this.props.getInput!(model)
    model.input = input
    this.setState({ model })
    const meta = (this.props.jobMetas || []).find(m => m.SID === model.type)
    this.setState({ meta })
  }

  render() {
    const { model, meta } = this.state

    if (model.id === 0) {
      return (<h3>Loading</h3>)
    }
    if (!meta) {
      return (<h3>No meta</h3>)
    }
    if (!!meta && !meta.InputJSONSchema) {
      return (<h3>No schema defined for this job</h3>)
    }

    return (
      <>
        <h3>Update job</h3>
        <p className="lead bg-warning">That should be run only by experienced user</p>
        <Form onSubmit={e => this.onSubmit(e as any)}>
          <Form.Group>
            <JsonEditor
              label="Input"
              jsonSchema={JSON.parse(meta.InputJSONSchema!)}
              defaultValue={model.input || {}}
              onChange={newValue => {
                model.input = !!newValue ? JSON.stringify(newValue) : ""
                this.onChange(model)
              }}
            />
          </Form.Group>
          <Button variant="light" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </>
    );
  }

  onChange(model: Job) {
    const clone = new Job(model)
    this.setState({ model: clone })
  }

  private async onSubmit(event: Event) {
    event.stopPropagation()
    event.preventDefault()

    const { model } = this.state
    await this.props.updateInput!(model, JSON.parse(model.input))
    alert("Done, sir!")
    this.props.history.push(`/index`)
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
  jobMetas: state.jobMetas,
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  show: (id: number) => dispatch(Actions.show(id)),
  getInput: (job: Job) => dispatch(Actions.getInput(job)),
  update: (job: Job) => dispatch(Actions.update(job)),
  updateInput: (job: Job, newInput: any) => dispatch(Actions.updateInput(job, newInput)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)
