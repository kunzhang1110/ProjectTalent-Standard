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

    };

    init() {

        
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: Profile_URL + '/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let employerData = null;
                if (res.employer) {
                    employerData = res.employer.companyContact
                    console.log(employerData)

                    //move it else where later
                    let loaderData = TalentUtil.deepCopy(this.state.loaderData)
                    loaderData.isLoading = false;
                    this.setState({ companyDetails: employerData, loaderData})
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        }) 

        this.setState({ loaderData });//comment this
    }

    componentDidMount() {
        //window.addEventListener('scroll', this.handleScroll);
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
                                    <CompanyProfile companyDetails={this.state.companyDetails}/>
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