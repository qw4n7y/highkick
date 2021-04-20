import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../redux/state'
import * as ReactRouter from 'react-router'

import { Button } from 'react-bootstrap'

import Form from '../components/schedulers/form'

import Actions from '../redux/actions/schedulers'
import Scheduler from "../models/scheduler";

type Props = {
    show?: (id: number) => Promise<Scheduler>
    update?: (scheduler: Scheduler) => Promise<any>
} & ReactRouter.RouteComponentProps<{
    id: string
}>

type State = {
    model: Scheduler
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            model: new Scheduler({})
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    async componentDidMount() {
        const idStr = this.props.match.params.id
        const id = parseInt(idStr, 10)
        const model = await this.props.show!(id)
        this.setState({ model })
    }

    render() {
        const { model } = this.state

        return (
            <>
                <h3>Update scheduler</h3>
                <Form
                    value={model}
                    onChange={this.onChange}
                />
                <Button variant="light" className="w-100"
                        onClick={this.onSubmit}
                >
                    Update
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
        await this.props.update!(this.state.model)
        alert("Done, sir!")
    }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
    show: (id: number) => dispatch(Actions.show(id)),
    update: (scheduler: Scheduler) => dispatch(Actions.update(scheduler)),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)