import React from 'react'
import * as ReactRedux from 'react-redux'
import { Link } from 'react-router-dom'

import ReduxState from './../../redux/state'
import Actions from '../../redux/actions/schedulers'

import ReactJsonView from 'react-json-view'
import { Button } from 'react-bootstrap'
import { Trash, PauseCircle, PencilSquare } from 'react-bootstrap-icons'
import HumanDuration from '../../components/misc/human_duration'

import Scheduler from '../../models/scheduler'

type Props = {
    item: Scheduler
    destroy?: (item: Scheduler) => any
}

type State = {}

class JobComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {}

        this.destroy = this.destroy.bind(this)
    }

    render() {
        const { item } = this.props
        const input = JSON.parse(item.JobInput)

        return (
            <div className="card w-100">
                <div className="card-body d-flex align-items-center">
                    <span>{item.JobType} every <HumanDuration seconds={item.RunEverySeconds}/></span>
                    <div className="flex-fill">
                        <ReactJsonView src={input} collapsed={true} style={{fontSize: 10}} displayDataTypes={false}/>
                    </div>
                    { !!item.Stopped && <PauseCircle/> }
                    <span>{item.LastRunAt}</span>
                    { !!item.LastError && <div className="alert alert-danger">{item.LastError}</div> }

                    <Link to={`/schedulers/edit/${item.ID}`}><PencilSquare/></Link>

                    <Button variant="light" onClick={this.destroy}
                    ><Trash/></Button>
                </div>
            </div>)
    }

    private destroy() {
        if (window.confirm('Do you wanna to destroy?') === false) {
            return
        }
        this.props.destroy!(this.props.item)
    }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
    destroy: (item: Scheduler) => dispatch(Actions.destroy(item))
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(JobComponent)