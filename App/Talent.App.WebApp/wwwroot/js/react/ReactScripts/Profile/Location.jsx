import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { countries } from '../Employer/common.js'
import { Form } from 'semantic-ui-react'
import { Location } from '../Employer/CreateJob/Location.jsx';

export class Address extends React.Component {
    constructor(props) {
        super(props)

        const address = props.address ?
            Object.assign({}, props.address)
            : {
                city: "",
                country: "",
                number: "",
                postCode: 0,
                street: "",
                suburb: ""
            }

        this.state = {
            showEditSection: false,
            newAddress: address
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveAddress = this.saveAddress.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const address = Object.assign({}, this.props.address)
        this.setState({
            showEditSection: true,
            newAddress: address
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        console.log(event.target.value)
        const data = Object.assign({}, this.state.newAddress)
        data[event.target.name] = event.target.value

        if (event.target.name == "country") {
            data["city"] = "";
        }

        this.setState({
            newAddress: data
        })
    }

    saveAddress() {
        const data = Object.assign({}, this.state.newAddress)
        this.props.saveProfileData(data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <Form.Group>
                    <ChildSingleInput
                        inputType="text"
                        label="Number"
                        name="number"
                        value={this.state.newAddress.number}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        width="two"
                        errorMessage="Please enter a valid number"
                    />
                    <ChildSingleInput
                        inputType="text"
                        label="Street"
                        name="street"
                        value={this.state.newAddress.street}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        width="nine"
                        errorMessage="Please enter a valid street name"
                    />
                    <ChildSingleInput
                        inputType="text"
                        label="Suburb"
                        name="suburb"
                        value={this.state.newAddress.suburb}
                        controlFunc={this.handleChange}
                        maxLength={80}
                        width="five"
                        errorMessage="Please enter a valid suburb"
                    />
                </Form.Group>
                <Form.Group>
                    <CountryInput country={this.state.newAddress.country} controlFunc={this.handleChange}/>

                </Form.Group>       

                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let number = this.props.address ? this.props.address.number : "";
        let street = this.props.address ? this.props.address.street : "";
        let surburb = this.props.address ? this.props.address.surburb : "";
        let postcode = this.props.address ? this.props.address.postcode : "";
        let city = this.props.address ? this.props.address.city : "";
        let country = this.props.address ? this.props.address.country : "";
        let addressString = this.props.address ? `${number}, ${street}, ${surburb}, ${postcode}` : "";

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {addressString}</p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

    }


    render() {

        return null;
    }
}

class CountryInput extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let countriesOptions = [];
        const selectedCountry = this.props.country ? this.props.country : "";
        countriesOptions = Object.keys(countries).map((x) => <option key={x} value={x}>{x}</option>);

        return (
            <div>
                <label>Country</label>
                <select className="ui right labeled dropdown"
                    placeholder="Country"
                    value={selectedCountry}
                    onChange={this.props.controlFunc}
                    name="country">
                    <option value="">Select a country</option>
                    {countriesOptions}
                </select>
            </div>
        )
    }


}