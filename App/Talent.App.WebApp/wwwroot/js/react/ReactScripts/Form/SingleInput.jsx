﻿import React from 'react';
import PropTypes from 'prop-types';
import { TextArea } from 'semantic-ui-react'

export const SingleInput = (props) =>
    <div className={`field ${props.isError == true ? 'error' : ''} `}>
        <input
            type={props.inputType}
            placeholder={props.placeholder}
            name={props.name}
            value={props.content}
            onChange={props.controlFunc} />
        {props.isError ? <div className="ui basic red pointing prompt label transition visible">{props.errorMessage}</div> : null}
    </div>

SingleInput.propTypes = {
    inputType: PropTypes.oneOf(['text', 'number', 'password', 'date']).isRequired,
    errorMessage: PropTypes.string.isRequired,
    //title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    controlFunc: PropTypes.func.isRequired,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date)
    ]).isRequired,
    placeholder: PropTypes.string,
    isError: PropTypes.bool.isRequired
}

//Updates state in parent component
export class ChildSingleInput extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {
        let widthClass = this.props.width ? `${this.props.width} wide` : "";

        if (this.props.minLength <= 100 || this.props.minLength==null) {
            return (
                <div className={"field " + widthClass}>
                    <label>{this.props.label}</label>
                    <input
                        type={this.props.inputType}
                        name={this.props.name}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        maxLength={this.props.maxLength}
                        onChange={this.props.controlFunc}
                    />
                    {this.props.isError ? <div className="ui basic red pointing prompt label transition visible">{this.props.errorMessage}</div> : null}
                </div>
            )
        }
        return (
            <div className="field">
                <label>{this.props.label}</label>
                <TextArea
                    name={this.props.name}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    maxLength={this.props.maxLength}
                    onChange={this.props.controlFunc}
                />
                {this.props.isError ? <div className="ui basic red pointing prompt label transition visible">{this.props.errorMessage}</div> : null}
            </div>
        )


    }
}


ChildSingleInput.propTypes = {
    inputType: PropTypes.oneOf(['text', 'number', 'password']).isRequired,
    name: PropTypes.string.isRequired,
    //value: PropTypes.oneOfType([
    //    PropTypes.string,
    //    PropTypes.number,
    //]),
    placeholder: PropTypes.string,
    controlFunc: PropTypes.func.isRequired,
    //isError: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
}


export class CharactersRemaining extends React.Component {

    render() {
        let characters = this.props.characters ? this.props.characters.length : 0

        return (
            <div className="floatRight" >Word count : {characters} / {this.props.maxLength}</div>
        )

    }
}