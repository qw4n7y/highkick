import React from 'react'
import Moment from 'moment'
import * as ReactRedux from 'react-redux'
import { Link } from 'react-router-dom'

import ReduxState from '../../redux/state'
import WorkerActions from '../../redux/actions/workers'

import { Button } from 'react-bootstrap'
import { Trash, PencilSquare } from 'react-bootstrap-icons'

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
                    {item.RunningJobsCount}
                </td>
                <td>
                    {item.Stopped ? "Stopped" : "Active"}
                </td>
                <td>
                    {Moment(item.CreatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td>
                    <Link to={`/workers/edit/${item.ID}`}><PencilSquare/></Link>
                </td>
                <td>
                    <Button size="sm" variant="light" onClick={this.destroy}
                    ><Trash/></Button>
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