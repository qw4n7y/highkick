import React from 'react'
import * as ReactRedux from 'react-redux'
import ReduxState from './../../redux/state'

import JobMeta from '../../models/job_meta'
import { Form, Button } from 'react-bootstrap'
import JsonEditor from '../misc/json_editor'

import Scheduler from "../../models/scheduler";

type Props = {
    jobMetas?: JobMeta[]
    value: Scheduler
    onChange: (newValue: Scheduler) => any
}

type State = {}

class SchedulerForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
        this.onChange = this.onChange.bind(this)
    }

    render() {
        const { value } = this.props
        const sortedJobMetas = (this.props.jobMetas || []).sort(function (a, b) {
            return a.Title.localeCompare(b.Title);
        })

        return (
            <div>
                <Form.Group>
                    <Form.Label>SID</Form.Label>
                    <Form.Control as="select" custom
                                  value={value.JobType}
                                  onChange={e => {
                                      value.JobType = e.currentTarget.value
                                      this.onChange(value)
                                  }}
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
                        <p className="mb-0">{JSON.stringify(value.JobInput)}</p>
                        <footer className="blockquote-footer">job input</footer>
                    </blockquote>

                </Form.Group>
                <Form.Group>
                    <Form.Label>RunEverySeconds</Form.Label>
                    <Form.Control type="number"
                                  value={value.RunEverySeconds}
                                  onChange={e => {
                                      value.RunEverySeconds = parseInt(e.currentTarget.value, 10)
                                      this.onChange(value)
                                  }}
                    />
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

    renderInputEditor() {
        const { value } = this.props
        if (!value.JobType) { return null }

        const jobMeta = (this.props.jobMetas || []).find(c => c.SID === value.JobType)
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
                key={value.ID}
                label="Input"
                jsonSchema={jsonSchema}
                defaultValue={JSON.parse(value.JobInput || "{}")}
                onChange={newValue => {
                    value.JobInput = JSON.stringify(newValue)
                    this.onChange(value)
                }}
            />
        )
    }

    onChange(model: Scheduler) {
        const clone = new Scheduler(model)
        this.props.onChange(clone)
    }
}

const mapStateToProps = (state: ReduxState, ownProps: Props) => ({
    jobMetas: state.jobMetas,
})
const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SchedulerForm)
