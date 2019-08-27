/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Image, Button, Icon, Form } from 'semantic-ui-react';

const imageServerUrl = Profile_URL+'/images/'
const defaultPhotoUrl = Profile_URL+'/images/default.jpg'

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        let profilePhotoUrl = this.props.profilePhoto
            ? imageServerUrl + this.props.profilePhoto
            : defaultPhotoUrl

        this.state = {
            profilePhoto: "",
            profilePhotoUrl,
            file:null
        }
        this.uploadHandler = this.uploadHandler.bind(this)
        this.fileSelector = this.fileSelector.bind(this)
    };

    fileSelector(e) {
        let file = e.target.files[0]
        this.setState({ profilePhotoUrl: URL.createObjectURL(file), file: file })
    }

    uploadHandler(e) {
        let file = this.state.file;
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
                if (res) {
                    TalentUtil.notification.show("Photo added sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Photo was not added", "error", null, null)
                }
                this.setState({
                    profilePhoto: file.name,
                    profilePhotoUrl: imageServerUrl + file.name,
                    file:null
                })
            }.bind(this),
            error: function (res) {
                console.log(res)
            }
        })



    }


    render() {
 
            return (
                <div className='row'>
                    <div className="ui sixteen wide column">
                        <Form.Field>
                            <Image src={this.state.profilePhotoUrl} circular size='small' as="label" htmlFor="file" />
                            <input type="file" id="file" hidden onChange={this.fileSelector} />
                        </Form.Field>
                        {this.state.file
                            ? <Form.Field>
                                <Button type="button" color='teal' onClick={this.uploadHandler} >
                                    <Icon name="upload" /> Upload
                            </Button>
                            </Form.Field>
                            :null
                        }



                    </div>
                </div>
            )
       

    }
}
