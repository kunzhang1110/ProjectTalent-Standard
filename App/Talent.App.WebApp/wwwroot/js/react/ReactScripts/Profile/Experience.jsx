/* Experience section */
import React from 'react';
import { Table, Icon, Button, Input, Dropdown, Form, Label } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import moment from 'moment';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import DatePicker from 'react-datepicker';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        const experiences = []
        this.state = {
            showAddSection: false,
            experiences
        }
        this.openAddNew = this.openAddNew.bind(this);
        this.closeAddNew = this.closeAddNew.bind(this);
        this.addExperience = this.addExperience.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);
    }

    componentDidMount() {
        if (this.props.experienceData) {
            this.setState({
                experiences: this.props.experienceData
            })
        }
    }

    openAddNew() {
        this.setState({
            showAddSection: true,
        })
    }

    closeAddNew() {
        this.setState({
            showAddSection: false,
        })
    }

    addExperience(newExperience) {
        let experiences = this.state.experiences.slice(0);
        experiences.push(newExperience);
        this.setState({ experiences, showAddSection: false });
    }

    updateExperience(newExperience) {
        let experiences = this.state.experiences.slice(0);
        let experienceInState = experiences.filter(l => l.id == newExperience.id)[0];
        Object.assign(experienceInState, newExperience)
        this.setState({ experiences });
    }

    deleteExperience(id) {
        let experiences = this.state.experiences.filter(l => l.id != id);
        this.setState({ experiences });
    }

    render() {
        return (
            <div className='row'>
                <div className='ui sixteen wide column'>
                    {this.state.showAddSection
                        ? <ExperienceInput
                            closeAddNew={this.closeAddNew}
                            addExperience={this.addExperience}
                            create
                        />
                        : null}
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Company</Table.HeaderCell>
                                <Table.HeaderCell>Position</Table.HeaderCell>
                                <Table.HeaderCell>Responsibilities</Table.HeaderCell>
                                <Table.HeaderCell>Start</Table.HeaderCell>
                                <Table.HeaderCell>End</Table.HeaderCell>
                                <Table.HeaderCell>
                                    <button type="button"
                                        className="ui right floated teal button"
                                        onClick={this.openAddNew}>
                                        <Icon name='plus' />
                                        Add New
                                </button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.experiences.map(experience => {
                                return (
                                    <ExperienceInput
                                        closeAddNew={this.closeAddNew}
                                        updateExperience={this.updateExperience}
                                        deleteExperience={this.deleteExperience}
                                        experience={experience}
                                        key={experience.id}
                                    />
                                )
                            }
                            )}
                        </Table.Body>

                    </Table>
                </div>
            </div>
        )
    }
}

class ExperienceInput extends React.Component {

    constructor(props) {
        super(props);
        let experience = {
            id:"",
            company: "",
            position: "",
            responsibilities: "",
            start: moment(),
            end: moment().add(14, 'days')
        }
        this.state = {
            experience
        }
        this.addUpdateHandler = this.addUpdateHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.cancelEditHandler = this.cancelEditHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.renderAddNew = this.renderAddNew.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    changeHandler(event) {
        const experience = Object.assign({}, this.state.experience)
        experience[event.target.name] = event.target.value

        this.setState({
            experience
        })
    }

    dateChangeHandler(date, name) {//date is an moment object given by Datepicker
        let experience = Object.assign({}, this.state.experience, { [name]: date });
        this.setState({
            experience
        })
    }

    addUpdateHandler(e) {
        e.preventDefault();
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: Profile_URL+'/profile/profile/addExperience',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.experience),
            success: function (res) {
                console.log(res);
                let newExperience = Object.assign({}, this.state.experience);
                if (this.state.experience.id == "") {//create
                    newExperience.id = res.id;
                    this.props.addExperience(newExperience);
                    if (res.id) {
                        TalentUtil.notification.show("Experience added sucessfully", "success", null, null)
                    } else {
                        TalentUtil.notification.show("Experience was not added", "error", null, null)
                    }
                } else { //edit
                    this.setState({ edit: false })
                    this.props.updateExperience(newExperience);
                    if (res.id) {
                        TalentUtil.notification.show("Experience updated sucessfully", "success", null, null)
                    } else {
                        TalentUtil.notification.show("Experience was not updated", "error", null, null)
                    }
                }

            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }

    editHandler(e) {
        e.preventDefault();
        this.setState({ edit: true, experience: this.props.experience })
    }

    cancelEditHandler(e) {
        e.preventDefault();
        this.setState({ edit: false, experience: this.props.experience })
    }

    deleteHandler(e) {
        e.preventDefault();
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: Profile_URL+'/profile/profile/deleteExperience',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.props.experience),
            success: function (res) {
                console.log(res);
                this.props.deleteExperience(res.id)
                if (res.id) {
                    TalentUtil.notification.show("Experience deleted sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Experience was not deleted", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }

    render() {
        if (this.props.create)
            return this.renderAddNew();
        else if (this.state.edit)
            return this.renderEdit();
        else
            return this.renderDisplay();
    }

    renderAddNew() {
        return (
            <div className='ui sixteen wide column'>
                <Form.Group>
                    <ChildSingleInput
                        inputType="text"
                        label="Company"
                        name="company"
                        value={this.state.experience.company}
                        controlFunc={this.changeHandler}
                        maxLength={80}
                        width="eight"
                        errorMessage="Please enter a valid value"
                    />
                    <ChildSingleInput
                        inputType="text"
                        label="Position"
                        name="position"
                        value={this.state.experience.position}
                        controlFunc={this.changeHandler}
                        maxLength={80}
                        width="eight"
                        errorMessage="Please enter a valid value"
                    />
                </Form.Group>
                <Form.Group>
                    <div className="field eight wide wideDatePicker">
                        <label>Start Date</label>
                        <DatePicker
                            selected={this.state.experience.start}
                            onChange={(date) => this.dateChangeHandler(date, "start")}
                        />
                    </div>
                    <div className="field eight wide wideDatePicker">
                        <label>End Date</label>
                        <DatePicker
                            selected={this.state.experience.end}
                            onChange={(date) => this.dateChangeHandler(date, "end")}
                        />
                    </div>
                </Form.Group>
                <Form.Group>
                    <ChildSingleInput
                        inputType="text"
                        label="Responsibilities"
                        name="responsibilities"
                        value={this.state.experience.responsibilities}
                        controlFunc={this.changeHandler}
                        maxLength={80}
                        width="sixteen"
                        errorMessage="Please enter a valid value"
                    />
                </Form.Group>
                <Button onClick={this.addUpdateHandler} color="teal">Add</Button>
                <Button onClick={this.props.closeAddNew}> Cancel</Button>
            </div>

        )
    }

    renderEdit() {
        var start = moment();
        var end = moment().add(14, 'days');
        if (this.state.experience.start != null) {
            start = moment(this.state.experience.start);
        }
        if (this.state.experience.end != null) {
            end = moment(this.state.experience.end);
        }

        return (
            <Table.Row>
                <Table.Cell colSpan="6">
                    <Form.Group>
                        <ChildSingleInput
                            inputType="text"
                            label="Company"
                            name="company"
                            value={this.state.experience.company}
                            controlFunc={this.changeHandler}
                            maxLength={80}
                            width="eight"
                            errorMessage="Please enter a valid value"
                        />
                        <ChildSingleInput
                            inputType="text"
                            label="Position"
                            name="position"
                            value={this.state.experience.position}
                            controlFunc={this.changeHandler}
                            maxLength={80}
                            width="eight"
                            errorMessage="Please enter a valid value"
                        />
                    </Form.Group>
                    <Form.Group>
                        <div className="field eight wide wideDatePicker">
                            <label>Start Date</label>
                            <DatePicker
                                selected={start}
                                onChange={(date) => this.dateChangeHandler(date, "start")}
                            />
                        </div>
                        <div className="field eight wide wideDatePicker">
                            <label>End Date</label>
                            <DatePicker
                                selected={end}
                                onChange={(date) => this.dateChangeHandler(date, "end")}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <ChildSingleInput
                            inputType="text"
                            label="Responsibilities"
                            name="responsibilities"
                            value={this.state.experience.responsibilities}
                            controlFunc={this.changeHandler}
                            maxLength={80}
                            width="sixteen"
                            errorMessage="Please enter a valid value"
                        />
                    </Form.Group>
                    <Button onClick={this.addUpdateHandler} inverted color="blue">Update</Button>
                    <Button onClick={this.cancelEditHandler} inverted color="red"> Cancel</Button>
                </Table.Cell>
            </Table.Row>
        )
    }

    renderDisplay() {
        var start = "";
        var end = "";
        if (this.props.experience.start != null) {
            start =  moment(this.props.experience.start).format("Do MMM, YYYY");
        }
        if (this.props.experience.end != null) {
            end = moment(this.props.experience.end).format("Do MMM, YYYY");
        }


        return (
            <Table.Row>
                <Table.Cell>{this.props.experience.company}</Table.Cell>
                <Table.Cell>{this.props.experience.position}</Table.Cell>
                <Table.Cell>{this.props.experience.responsibilities}</Table.Cell>
                <Table.Cell>{start}</Table.Cell>
                <Table.Cell>{end}</Table.Cell>
                <Table.Cell textAlign="right">
                    <Icon name='edit' onClick={this.editHandler} link />
                    <Icon name='delete' onClick={this.deleteHandler} link />
                </Table.Cell>

            </Table.Row>
        )
    }
}