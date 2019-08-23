import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import { Icon, Button, Input, Dropdown, Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export const visaOptions = [
    {
        key: 'Citizen',
        text: 'Citizen',
        value: 'Citizen',
    },
    {
        key: 'Permanent Resident',
        text: 'Permanent Resident',
        value: 'Permanent Resident',
    },
    {
        key: 'Work Visa',
        text: 'Work Visa',
        value: 'Work Visa',
    },
    {
        key: 'Student Visa',
        text: 'Student Visa',
        value: 'Student Visa',
    }
]


export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props);

        const newVisaStatus = props.visaStatus ? props.visaStatus : "";
        const newVisaExpiryDate = props.visaExpiryDate ? props.visaExpiryDate : "";

        this.state = {
            showEditSection: false,
            newVisaStatus,
            newVisaExpiryDate
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.saveVisaStatus = this.saveVisaStatus.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }


    openEdit() {
        this.setState({
            showEditSection: true,
            newVisaStatus: this.props.visaStatus,
            newVisaExpiryDate: this.props.visaExpiryDate
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    changeHandler(e, { name, value }) {
        this.setState({
            [name]: value
        })
    }

    dateChangeHandler(date, name) {
        this.setState({
            [name]: date
        })
    }

    saveVisaStatus() {
        const data = Object.assign({}, { visaStatus: this.state.newVisaStatus, visaExpiryDate: this.state.newVisaExpiryDate })
        this.props.saveProfileData(data)
        this.closeEdit()
    }


    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        var visaExpiryDate = "";
        if (this.props.visaExpiryDate != null) {
            visaExpiryDate = moment(this.props.visaExpiryDate).format("Do MMM, YYYY");
        }

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Visa Type: {this.props.visaStatus}</p>
                        <p>Visa Expiry Date: {visaExpiryDate}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div >
        )
    }

    renderEdit() {
        var visaExpiryDate = moment();
        if (this.state.newVisaExpiryDate != null) {
            visaExpiryDate = moment(this.state.newVisaExpiryDate);
        }

        return (
            <div className='ui sixteen wide column'>
                <Form.Group>
                    <div className="field eight wide">
                        <label>Visa Type</label>
                        <Dropdown
                            placeholder='Visa Status'
                            selection
                            name="newVisaStatus"
                            value={this.state.newVisaStatus}
                            options={visaOptions}
                            onChange={this.changeHandler}
                        />
                    </div>
                    {(this.state.newVisaStatus == "Work Visa" || this.state.newVisaStatus == "Student Visa")
                        ? <div className="field eight wide wideDatePicker">
                            <label>Visa Expiry Date</label>
                            <DatePicker
                                selected={visaExpiryDate}
                                onChange={(date) => this.dateChangeHandler(date, "newVisaExpiryDate")}
                            />
                        </div>
                        : null}
                </Form.Group>
                <button type="button" className="ui teal button right floated" onClick={this.saveVisaStatus}>Save</button>
                <button type="button" className="ui button right floated" onClick={this.closeEdit}>Cancel</button>
            </div>

        );
    }
}