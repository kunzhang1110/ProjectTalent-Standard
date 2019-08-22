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

        const address = {
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
        const data = { address: this.state.newAddress };
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
                    <CountryInput
                        country={this.state.newAddress.country}
                        controlFunc={this.handleChange}
                        width="six"/>
                    <CityInput
                        country={this.state.newAddress.country}
                        city={this.state.newAddress.city}
                        controlFunc={this.handleChange}
                        width="five"/>
                    <ChildSingleInput
                        inputType="text"
                        label="Postcode"
                        name="postCode"
                        value={this.state.newAddress.postCode}
                        controlFunc={this.handleChange}
                        maxLength={10}
                        width="five"
                        errorMessage="Please enter a valid postcode"
                    />
                </Form.Group>       

                <button type="button" className="ui teal button" onClick={this.saveAddress}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
     
        let number = this.props.address ? this.props.address.number : "";
        let street = this.props.address ? this.props.address.street : "";
        let suburb = this.props.address ? this.props.address.suburb : "";
        let postCode = this.props.address ? this.props.address.postCode : "";
        let city = this.props.address ? this.props.address.city : "";
        let country = this.props.address ? this.props.address.country : "";
        let addressString = this.props.address ? `${number}, ${street}, ${suburb}, ${postCode}` : "";

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

        this.state = {
            showEditSection: false,
            newNationality: ""
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveNationality = this.saveNationality.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const nationality = Object.assign({}, this.props.nationality)
        this.setState({
            showEditSection: true,
            newAddress: nationality
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.nationality)
        data[event.target.name] = event.target.value
 
        this.setState({
            newNationality: data.country
        })
    }

    saveNationality() {
        const data = { nationality: this.state.newNationality };
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
                    <CountryInput
                        country={this.state.newNationality}
                        controlFunc={this.handleChange}
                        width="six" />
                </Form.Group>
                <button type="button" className="ui teal button" onClick={this.saveNationality}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let nationality = this.props.nationality ? this.props.nationality: "";


        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>{nationality}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}

class CountryInput extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let widthClass = this.props.width ? `${this.props.width} wide` : "";

        let countriesOptions = [];
        const selectedCountry = this.props.country ? this.props.country : "";
        countriesOptions = Object.keys(countries).map((x) => <option key={x} value={x}>{x}</option>);

        return (
            <div className={"field " + widthClass}>
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

class CityInput extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let widthClass = this.props.width ? `${this.props.width} wide` : "";

        const selectedCountry = this.props.country ? this.props.country : "";
        const selectedCity = this.props.city ? this.props.city : "";

        if (selectedCountry != "" && selectedCountry != null) {
            var citiesOptions = countries[selectedCountry].map(x => <option key={x} value={x}> {x}</option>); 
        }

        return (
            <div className={"field " + widthClass}>
                <label>City</label>
                <select
                    className="ui dropdown"
                    placeholder="City"
                    value={selectedCity}
                    onChange={this.props.controlFunc}
                    name="city">
                    <option value=""> Select a town or city</option>
                    {citiesOptions}
                </select>
            </div>
        )
    }
}