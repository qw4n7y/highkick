import React from 'react'
import Moment from 'moment'
import * as ReactRedux from 'react-redux'
import { Link } from 'react-router-dom'

import ReduxState from '../../redux/state'
import WorkerActions from '../../redux/actions/workers'

import { Trash, PencilSquare, CircleFill, StopFill, PlayCircle } from 'react-bootstrap-icons'

import Worker from '../../models/worker'

type Props = {
    item: Worker
    destroy?: (item: Worker) => any
}

type State = {}

class WorkerComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {}

        this.destroy = this.destroy.bind(this)
    }

    render() {
        const { item } = this.props
        
        return (
            <tr>
                <td>
                    {item.ID}
                </td>
                <td>
                    {item.SID}
                </td>
                <td>
                    {item.ProcessSID}
                </td>
                <td>
                    {/* {item.RunningJobsCount} */}
                    <div className="progress" style={{width: 100}}>
                        {item.RunningJobsCount > 0 ? (
                            <div className="progress-bar w-100" role="progressbar">{item.RunningJobsCount}</div>
                        ) : null}
                    </div>
                </td>
                <td>
                    {item.Stopped ? 
                        <span className="text-secondary"><StopFill/></span> :
                        <span className="text-success"><PlayCircle/></span> }
                </td>
                <td>
                    <span className={item.isActive() ? "text-success" : "text-secondary"}><CircleFill/></span>
                    {Moment(item.HealthcheckedAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td>
                    {Moment(item.CreatedAt).format("MM-DD HH:mm:ss")}
                </td>
                <td>
                    <Link className="btn btn-sm" to={`/workers/edit/${item.ID}`}><PencilSquare/></Link>
                </td>
                <td>
                    <button className="btn btn-sm" onClick={this.destroy}
                    ><Trash/></button>
                </td>
            </tr>)
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
    destroy: (item: Worker) => dispatch(WorkerActions.destroy(item))
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(WorkerComponent)