import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../../redux/state'

import WorkerActions from '../../redux/actions/workers'
import Worker from "../../models/worker"

import ItemComponent from './_item'

type Props = {
    indexWorkers?: () => Promise<Worker[]>
}
type State = {
    workers: Worker[]
}

class App extends React.Component<Props, State> {
    private pollInterval: null | ReturnType<typeof window.setInterval> = null
    private pulseIndicatorEl = React.createRef<HTMLDivElement>()

    constructor(props: Props) {
        super(props);
        this.state = {
            workers: [],
        }
        this.loadItems = this.loadItems.bind(this)
        this.touchPulseIndicator = this.touchPulseIndicator.bind(this)
    }

    componentDidMount() {
        this.loadItems()
        this.pollInterval = window.setInterval(this.loadItems, 2000) as any
    }

    componentWillUnmount() {
        clearInterval(this.pollInterval as any)
    }
    
    private async loadItems() {
        const workers = await this.props.indexWorkers!()
        this.setState({ workers }, this.touchPulseIndicator)
    }

    render() {
        const { workers } = this.state

        return (
            <>
                <div className="jumbotron p-2 m-1 d-flex align-items-center">
                    <p className="m-0 lead text-monospace font-weight-bold mr-4 flex-fill">
                        Workers&nbsp;
                    <div 
                    className="d-inline-block pulse-indicator"
                    ref={this.pulseIndicatorEl}
                    ></div></p>
                </div>
                <table className="table table-sm">
                    { workers.map(worker => (
                        <ItemComponent 
                            item={worker}                           
                        />
                    )) }
                </table>
            </>
        );
    }

    private touchPulseIndicator() {
        this.pulseIndicatorEl.current?.classList.add("active")
        setTimeout(() => {
            this.pulseIndicatorEl.current?.classList.remove("active")
        }, 500)
    }
};

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
    indexWorkers: () => dispatch(WorkerActions.index()),
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App)
