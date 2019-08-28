import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Label, Card, Icon, Image } from 'semantic-ui-react'

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showVideo: true
        }
        this.showVideoOrDetailHandler = this.showVideoOrDetailHandler.bind(this);
        this.renderDetails = this.renderDetails.bind(this);
        this.renderVideo = this.renderVideo.bind(this);
    };

    showVideoOrDetailHandler() {
        let showVideo = this.state.showVideo;
        this.setState({ showVideo: !showVideo })
    }

    render() {
        let { currentEmployer, id, name, position, skills, visa } = this.props.talent
        return (
            <Card fluid>
                <Card.Content>
                    <Card.Header>
                        {name}
                        <span className="float-right-icon"><Icon name="star" /></span>
                    </Card.Header>
                </Card.Content>

                <Card.Content>
                    {this.state.showVideo
                        ? this.renderDetails()
                        : this.renderVideo()
                    }
                </Card.Content>
                <Card.Content>
                    <div className="ui four column grid">
                        <div className="row">
                            <div className="column center aligned ">
                                {this.state.showVideo
                                    ? <a onClick={this.showVideoOrDetailHandler}>
                                        <Icon name="user" size="large" />
                                    </a>
                                    :
                                    <a onClick={this.showVideoOrDetailHandler}>
                                        <Icon name="video" size="large" />
                                    </a>}
                            </div>
                            <div className="column center aligned" >
                                <Icon name="file pdf outline" size="large" />
                            </div>
                            <div className="column center aligned">
                                <Icon name="linkedin" size="large" />
                            </div>
                            <div className="column center aligned">
                                <Icon name="github" size="large" />
                            </div>
                        </div>
                    </div>
                </Card.Content>
                <Card.Content extra>
                    {skills.map(skill =>
                        <Label key={id + skill} basic color='blue' >{skill}</Label>
                    )}
                </Card.Content>
            </Card>

        )
    }

    renderDetails() {
        let { currentEmployer, position, visa } = this.props.talent

        return (
            <div className="ui grid">
                <div className="row">
                    <div className="column eight wide ">
                        <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="large" />
                    </div>
                    <div className="column eight wide ">
                        <h4>Talent snapshot</h4>
                        <h5>CURRENT EMPLOYER</h5>
                        <p>{currentEmployer}</p>
                        <h5>VISA STATUS</h5>
                        <p>{visa}</p>
                        <h5>POSITION</h5>
                        <p>{position}</p>
                    </div>
                </div>
            </div>
        )
    }

    renderVideo() {
        let { videoUrl } = this.props.talent
        return (
            <video width="100%" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video.
            </video>
        )
    }
}