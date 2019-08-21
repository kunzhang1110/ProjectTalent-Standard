/* Skill section */
import React from 'react';
import { Table, Icon, Button, Input, Dropdown, Grid } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export const levelOptions = [
    {
        key: 'Beginner',
        text: 'Beginner Level',
        value: 'Beginner',
    },
    {
        key: 'Intermediate',
        text: 'Intermediate Level',
        value: 'Intermediate',
    },
    {
        key: 'Expert',
        text: 'Expert Level',
        value: 'Expert',
    }
]

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        const skills = []
        this.state = {
            showAddSection: false,
            skills
        }
        this.openAddNew = this.openAddNew.bind(this);
        this.closeAddNew = this.closeAddNew.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.updateSkill = this.updateSkill.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
    }

    componentDidMount() {
        if (this.props.skillData) {
            this.setState({
                skills: this.props.skillData
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

    addSkill(newSkill) {
        let skills = this.state.skills.slice(0);
        skills.push(newSkill);
        this.setState({ skills, showAddSection: false });
    }

    updateSkill(newSkill) {
        let skills = this.state.skills.slice(0);
        let skillInState = skills.filter(l => l.id == newSkill.id)[0];
        Object.assign(skillInState, newSkill)
        this.setState({ skills });
    }

    deleteSkill(id) {
        let skills = this.state.skills.filter(l => l.id != id);
        this.setState({ skills });
    }

    render() {
        return (
            <div className='row'>
                <div className='ui sixteen wide column'>
                    {this.state.showAddSection
                        ? <SkillInput
                            closeAddNew={this.closeAddNew}
                            addSkill={this.addSkill}
                            create
                        />
                        : null}
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Skill</Table.HeaderCell>
                                <Table.HeaderCell>Level</Table.HeaderCell>
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
                            {this.state.skills.map(skill => {
                                return (
                                    <SkillInput
                                        closeAddNew={this.closeAddNew}
                                        updateSkill={this.updateSkill}
                                        deleteSkill={this.deleteSkill}
                                        skill={skill}
                                        key={skill.id}
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

class SkillInput extends React.Component {

    constructor(props) {
        super(props);
        let skill = {
            name: "",
            level: "",
            id: "",
            isDeleted: false
        }
        this.state = {
            skill
        }
        this.addUpdateHandler = this.addUpdateHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.cancelEditHandler = this.cancelEditHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.renderAddNew = this.renderAddNew.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    changeHandler(e, { name, value }) {
        let skill = Object.assign({}, this.state.skill, { [name]: value });

        this.setState({
            skill
        })
    }

    addUpdateHandler(e) {
        e.preventDefault();
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/addSkill',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.skill),
            success: function (res) {
                console.log(res);
                let newSkill = Object.assign({}, this.state.skill);
                if (this.state.skill.id == "") {//create
                    newSkill.id = res.id;
                    this.props.addSkill(newSkill);
                } else { //edit
                    this.setState({ edit: false })
                    this.props.updateSkill(newSkill);
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
        this.setState({ edit: true, skill: this.props.skill })
    }

    cancelEditHandler(e) {
        e.preventDefault();
        this.setState({ edit: false, skill: this.props.skill })
    }

    deleteHandler(e) {
        e.preventDefault();
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/deleteSkill',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.props.skill),
            success: function (res) {
                console.log(res);
                this.props.deleteSkill(res.id)
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
            <React.Fragment>
                <Input
                    placeholder='Add Skill'
                    name="name"
                    value={this.state.skill.name}
                    onChange={this.changeHandler} />
                <Dropdown
                    placeholder='Skill Level'
                    selection
                    name="level"
                    value={this.state.skill.level}
                    options={levelOptions}
                    onChange={this.changeHandler}
                />
                <Button onClick={this.addUpdateHandler}>Add</Button>
                <Button onClick={this.props.closeAddNew}> Cancel</Button>
            </React.Fragment>
        )
    }

    renderEdit() {
        return (
            <Table.Row>
                <Table.Cell colSpan="3">
                    <Input
                        placeholder='Add Skill'
                        name="name"
                        value={this.state.skill.name}
                        onChange={this.changeHandler} />
                    <Dropdown
                        placeholder='Skill Level'
                        selection
                        name="level"
                        value={this.state.skill.level}
                        options={levelOptions}
                        onChange={this.changeHandler}
                    />
                    <Button onClick={this.addUpdateHandler} inverted color="blue">Update</Button>
                    <Button onClick={this.cancelEditHandler} inverted color="red"> Cancel</Button>

                </Table.Cell>
            </Table.Row>
        )
    }

    renderDisplay() {
        return (
            <Table.Row>
                <Table.Cell>{this.props.skill.name}</Table.Cell>
                <Table.Cell>{this.props.skill.level}</Table.Cell>
                <Table.Cell textAlign="right">
                    <Icon name='edit' onClick={this.editHandler} link />
                    <Icon name='delete' onClick={this.deleteHandler} link />
                </Table.Cell>

            </Table.Row>
        )
    }
}