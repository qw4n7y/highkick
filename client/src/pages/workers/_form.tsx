import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from '../../redux/state'

import { Form } from 'react-bootstrap'

import Worker from "../../models/worker";

type Props = {
    value: Worker
    onChange: (newValue: Worker) => any
}

type State = {}

class WorkerForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
        this.onChange = this.onChange.bind(this)
    }

    render() {
        const { value } = this.props

        return (
            <div>
                <Form.Group>
                    <Form.Label>SID</Form.Label>
                    <Form.Control readOnly value={value.SID}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>ProcessSID</Form.Label>
                    <Form.Control readOnly value={value.ProcessSID}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>CreatedAt</Form.Label>
                    <Form.Control readOnly value={value.CreatedAt}/>
                </Form.Group>
                
                <Form.Group>
                    <Form.Check type="checkbox" label="Stopped"
                        checked={value.Stopped}
                        onChange={e => {
                            value.Stopped = e.currentTarget.checked
                            this.onChange(value)
                        }}
                    />
                </Form.Group>
            </div>
        );
    }

    onChange(model: Worker) {
        const clone = new Worker(model)
        this.props.onChange(clone)
    }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(WorkerForm)
