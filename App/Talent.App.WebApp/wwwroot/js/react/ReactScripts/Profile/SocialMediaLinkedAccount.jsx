/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup, Button, Icon } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        const newLinkedAccounts = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: "",
            }

        this.state = {
            showEditSection: false,
            newLinkedAccounts
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveLinkedAccounts = this.saveLinkedAccounts.bind(this)
        this.openLinkedAccount = this.openLinkedAccount.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    openEdit() {
        const linkedAccounts = Object.assign({}, this.props.linkedAccounts)
        this.setState({
            showEditSection: true,
            newLinkedAccounts:linkedAccounts
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newLinkedAccounts)
        data[event.target.name] = event.target.value
        this.setState({
            newLinkedAccounts: data
        })
    }

    saveLinkedAccounts() {
        const data = Object.assign({}, { linkedAccounts: this.state.newLinkedAccounts })
        this.props.saveProfileData(data)
        this.closeEdit()
    }

    openLinkedAccount(event, url) {
        event.preventDefault();
        if (url !== "") {
            window.open(url, '_blank');
        }
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay() 
        )
    }

    renderDisplay() {
        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <Button color='linkedin' onClick={(e) => this.openLinkedAccount(e, this.props.linkedAccounts.linkedIn)}>
                            <Icon name="linkedin" />
                            LinkedIn
                        </Button>
                        <Button color='black' onClick={(e) => this.openLinkedAccount(e, this.props.linkedAccounts.github)} >
                            <Icon name="github" />
                            Github
                         </Button>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div >
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.newLinkedAccounts.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter a valid url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Github"
                    name="github"
                    value={this.state.newLinkedAccounts.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Github Url"
                    errorMessage="Please enter a valid url"
                />

                <button type="button" className="ui teal button" onClick={this.saveLinkedAccounts}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
            
        );
    }
}