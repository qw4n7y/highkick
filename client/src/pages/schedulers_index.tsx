import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../redux/state'

import {Link as RouterLink, Link} from 'react-router-dom'
import { Plus } from 'react-bootstrap-icons'

import SchedulerActions from '../redux/actions/schedulers'
import Scheduler from "../models/scheduler"

import ItemComponent from '../components/schedulers/item'

type Props = {
    indexSchedulers?: () => Promise<Scheduler[]>
}
type State = {
    schedulers: Scheduler[]
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            schedulers: []
        }
    }

    async componentDidMount() {
        const schedulers = await this.props.indexSchedulers!()
        this.setState({ schedulers })
    }

    render() {
        const { schedulers } = this.state


        return (
            <>
                <div className="jumbotron p-2 m-1 d-flex align-items-center">
                    <p className="m-0 lead text-monospace font-weight-bold mr-4 flex-fill">Schedulers</p>
                    <RouterLink to={"/schedulers/new"} className="btn btn-success ml-4 font-weight-bold">
                        <Plus/>
                    </RouterLink>
                </div>
                { schedulers.map(scheduler => (
                    <ItemComponent item={scheduler}/>
                )) }
            </>
        );
    }
};

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
    indexSchedulers: () => dispatch(SchedulerActions.index())
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)
