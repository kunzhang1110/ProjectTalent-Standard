import React from 'react'
import { Form, Radio } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment';


export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        const jobSeekingStatus = props.jobSeekingStatus
            ? props.jobSeekingStatus
            : {
                status: "",
                availableDate: moment()
            };

        this.state = {
            showEditSection: false,
            jobSeekingStatus
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.saveTalentStatus = this.saveTalentStatus.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }


    openEdit() {
        this.setState({
            showEditSection: true,
            jobSeekingStatus: this.props.jobSeekingStatus,
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    changeHandler(e, { name, value }) {
        var newJobSeekingStatus = Object.assign({}, this.state.jobSeekingStatus)
        newJobSeekingStatus[name] = value;
        this.setState({
            jobSeekingStatus: newJobSeekingStatus
        })
    }

    saveTalentStatus() {
        const data = Object.assign({}, { jobSeekingStatus: this.state.jobSeekingStatus })
        this.props.saveProfileData(data)
        this.closeEdit()
    }


    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        let status = this.props.jobSeekingStatus ? this.props.jobSeekingStatus.status : "";

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>{status}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div >
        )
    }

    renderEdit() {
        let status = this.state.jobSeekingStatus ? this.state.jobSeekingStatus.status : "";

        return (
            <div className='ui sixteen wide column'>
                <Form.Field>
                    Current Status
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Actively looking for a job'
                        name='status'
                        value='Actively looking for a job'
                        checked={status === 'Actively looking for a job'}
                        onChange={this.changeHandler}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Not looking for a job at the moment'
                        name='status'
                        value='Not looking for a job at the moment'
                        checked={status === 'Not looking for a job at the moment'}
                        onChange={this.changeHandler}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Currently employed but open to offers'
                        name='status'
                        value='Currently employed but open to offers'
                        checked={status === 'Currently employed but open to offers'}
                        onChange={this.changeHandler}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Will be availabe on later date'
                        name='status'
                        value='Will be availabe on later date'
                        checked={status === 'Will be availabe on later date'}
                        onChange={this.changeHandler}
                    />
                </Form.Field>

                <button type="button" className="ui teal button right floated" onClick={this.saveTalentStatus}>Save</button>
                <button type="button" className="ui button right floated" onClick={this.closeEdit}>Cancel</button>
            </div>

        );
    }
}