import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';


export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }

        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    };

    init() {


        var cookies = Cookies.get('talentAuthToken');
        var headers = {
            'Authorization': 'Bearer ' + cookies,
        }
        $.when(
            //get employer profile
            $.ajax({
                url: Profile_URL + '/profile/profile/getEmployerProfile',
                headers: headers,
                type: "GET",
            }),
            $.ajax({
                url: Profile_URL + '/profile/profile/getTalent',
                headers: headers,
                type: "GET",
                data: {
                    position: this.state.loadPosition,
                    number: this.state.loadNumber
                }
            }),
        )
            .done(function (resEmployer, resFeed) {
                var employerData = null;
                var feedData = null;


                if (resEmployer[0].employer) {
                    employerData = resEmployer[0].employer.companyContact
                }
                if (resFeed[0].data) {
                    feedData = this.state.feedData.concat(resFeed[0].data);
                    console.log(feedData)
                }

                let loaderData = TalentUtil.deepCopy(this.state.loaderData)
                loaderData.isLoading = false;
                this.setState({ companyDetails: employerData, feedData ,loaderData })
            }.bind(this))
            .fail(function (e) {
                console.log(e);
            })


    }

    handleScroll() {

    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.init();
    };


    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui grid">
                            <div className="row">
                                <div className="column four wide ">
                                    <CompanyProfile companyDetails={this.state.companyDetails} />
                                </div>
                                <div className="column eight wide ">
                                    Talent Card
                            </div>
                                <div className="column four wide">
                                    <FollowingSuggestion />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}