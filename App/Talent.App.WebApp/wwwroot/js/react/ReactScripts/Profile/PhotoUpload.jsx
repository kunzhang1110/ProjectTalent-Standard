/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Image, Button, Icon, Form } from 'semantic-ui-react';

const imageServerUrl = "http://localhost:60290/images/"
const defaultPhotoUrl = "http://localhost:60290/images/default.jpg"

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        let profilePhotoUrl = this.props.profilePhoto
            ? imageServerUrl + this.props.profilePhoto
            : ""

        this.state = {
            profilePhoto: "",
            profilePhotoUrl
        }
        this.uploadHandler = this.uploadHandler.bind(this)
    };

    uploadHandler(e) {
        let file = e.target.files[0]
        const formData = new FormData();
        formData.append('image', file, file.name);


        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: this.props.savePhotoUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
            },
            contentType: false,
            processData: false,
            type: "POST",
            data: formData,
            success: function (res) {
                this.setState({
                    profilePhoto: file.name,
                    profilePhotoUrl: imageServerUrl + file.name
                })
            }.bind(this),
            error: function (res) {
                console.log(res)
            }
        })



    }


    render() {
        if (this.state.profilePhotoUrl != "") {
            return (
                <div className='row'>
                    <div className="ui sixteen wide column">
                        <Form.Field>
                            <Image src={this.state.profilePhotoUrl} circular size='small' />
                        </Form.Field>
                        <Form.Field>
                            <Button as="label" htmlFor="file" type="button" color='teal'>
                                <Icon name="upload" /> Upload
                    </Button>
                            <input type="file" id="file" hidden onChange={this.uploadHandler} />
                        </Form.Field>

                    </div>
                </div>
            )
        } else {
            return (
                <div className='row'>
                    <div className="ui sixteen wide column">

                        <Button type="button" circular as="label" htmlFor="file" >
                            <Image src={defaultPhotoUrl} circular size='mini' />
                        </Button>
                        <input type="file" id="file" hidden onChange={this.uploadHandler} />


                    </div>
                </div>)
        }

    }
}
