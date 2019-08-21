/* Language section */
import React from 'react';
import { Table, Icon, Button, Input, Dropdown } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export const levelOptions = [
    {
        key: 'Basic',
        text: 'Basic Level',
        value: 'Basic',
    },
    {
        key: 'Conversational',
        text: 'Conversational Level',
        value: 'Conversational',
    },
    {
        key: 'Fluent',
        text: 'Fluent Level',
        value: 'Fluent',
    },
    {
        key: 'Native',
        text: 'Native/Biligual Level',
        value: 'Native',
    }
]

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        const languages = []
        this.state = {
            showAddSection: false,
            languages
        }
        this.openAddNew = this.openAddNew.bind(this);
        this.closeAddNew = this.closeAddNew.bind(this);
        this.addLanguage = this.addLanguage.bind(this);
    }

    componentDidMount() {
        this.setState({
            languages: this.props.languageData
        })
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

    addLanguage(newLanguage) {
        let languages = this.state.languages.slice(0);
        languages.push(newLanguage);
        this.setState({ languages, showAddSection: false });
    }


    render() {
        return (
            <div className='row'>
                <div className='ui sixteen wide column'>
                    {this.state.showAddSection
                        ? <LanguageInput
                            closeAddNew={this.closeAddNew}
                            addLanguage={this.addLanguage}
                            create
                        />
                        : null}
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Language</Table.HeaderCell>
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
                            {this.state.languages.map(language => {
                                return (
                                    <LanguageInput
                                        closeAddNew={this.closeAddNew}
                                        addLanguage={this.addLanguage}
                                        language={language}
                                        key={language.name + language.level}
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

class LanguageInput extends React.Component {

    constructor(props) {
        super(props);
        let language = {
            name: "",
            level: "",
            id: "",
            currentUserId: 0
        }
        this.state = {
            language
        }
        this.addHandler = this.addHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.cancelEditHandler = this.cancelEditHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.renderAddNew = this.renderAddNew.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
    }

    changeHandler(e, { name, value }) {
        let language = Object.assign({}, this.state.language, { [name]: value });

        this.setState({
            language
        })
    }

    addHandler(e) {
        e.preventDefault();
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/addLanguage',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.language),
            success: function (res) {
                console.log(res)

            },
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
        //let newLanguage = this.state.language;
        //this.props.addLanguage(newLanguage)
    }

    editHandler(e) {
        e.preventDefault();
        this.setState({ edit: true, language: this.props.language })
    }

    cancelEditHandler(e) {
        e.preventDefault();
        this.setState({ edit: false, language: this.props.language })
    }

    deleteHandler(e) {
        e.preventDefault();
        //ajax call
        //callback
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
                    placeholder='Add Language'
                    name="name"
                    value={this.state.language.name}
                    onChange={this.changeHandler} />
                <Dropdown
                    placeholder='Language Level'
                    selection
                    name="level"
                    value={this.state.language.level}
                    options={levelOptions}
                    onChange={this.changeHandler}
                />
                <Button onClick={this.addHandler}>Add</Button>
                <Button onClick={this.props.closeAddNew}> Cancel</Button>
            </React.Fragment>
        )
    }

    renderEdit() {
        return (
            <React.Fragment>
                <Input
                    placeholder='Add Language'
                    name="name"
                    value={this.state.language.name}
                    onChange={this.changeHandler} />
                <Dropdown
                    placeholder='Language Level'
                    selection
                    name="level"
                    value={this.state.language.level}
                    options={levelOptions}
                    onChange={this.changeHandler}
                />
                <Button onClick={this.addHandler}>Update</Button>
                <Button onClick={this.cancelEditHandler}> Cancel</Button>
            </React.Fragment>
        )
    }

    renderDisplay() {
        return (
            <Table.Row>
                <Table.Cell>{this.props.language.name}</Table.Cell>
                <Table.Cell>{this.props.language.level}</Table.Cell>
                <Table.Cell textAlign="right">
                    <Icon name='edit' onClick={this.editHandler} link />
                    <Icon name='delete' onClick={this.deleteHandler} link />
                </Table.Cell>

            </Table.Row>
        )
    }
}