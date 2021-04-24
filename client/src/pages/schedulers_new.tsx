import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../redux/state'
import * as ReactRouter from 'react-router'

import { Button } from 'react-bootstrap'

import Form from '../components/schedulers/form'

import Actions from '../redux/actions/schedulers'
import Scheduler from "../models/scheduler";

type Props = {
  create?: (scheduler: Scheduler) => Promise<any>
} & ReactRouter.RouteComponentProps<{}>

type State = {
  model: Scheduler
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      model: new Scheduler({
        Stopped: false
      })
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  render() {
    const { model } = this.state

    return (
      <>
        <h3>Create scheduler</h3>
        <Form
          value={model}
          onChange={this.onChange}
        />
        <Button variant="light" className="w-100"
          onClick={this.onSubmit}
        >
          Create
        </Button>
      </>
    );
  }

  onChange(model: Scheduler) {
    this.setState({
      model
    })
  }

  private async onSubmit() {
    await this.props.create!(this.state.model)
    alert("Done, sir!")
    this.props.history.push(`/schedulers/index`)
  }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  create: (scheduler: Scheduler) => dispatch(Actions.create(scheduler)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)
