import React from 'react';
import { Loader } from 'semantic-ui-react';
import { Card, Icon, Image, List } from 'semantic-ui-react'

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {


        }

    }

    render() {

        return (

            <Card>

                <Card.Content textAlign="center">

                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' size='mini' circular style={{ margin: 10 }}/>
                    <Card.Header>{this.props.companyDetails.name}</Card.Header>
                    <Card.Meta>
                        <Icon name="point" />
                        <span>{this.props.companyDetails.location.city}, {this.props.companyDetails.location.country}</span>
                    </Card.Meta>
                    <Card.Description>
                        We currently have no skills required. (Hard-coded)
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <List>
                        <List.Item
                            icon='phone'
                            content={": " + this.props.companyDetails.phone}
                        />
                        <List.Item
                            icon='mail'
                            content={": " + this.props.companyDetails.email}
                        />
                    </List>
                </Card.Content>
            </Card>

        )
    }
}