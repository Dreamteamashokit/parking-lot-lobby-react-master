import React from 'react';
import { connect } from 'react-redux';
import "../_assets/css/sass/visitor-review.scss";
import { default as searchDark } from '../_assets/images/search-dark.svg';
import { default as DropSVG } from '../_assets/images/drop.svg';

import { default as calendarSVG } from '../_assets/images/calendar.svg';
import { default as dropdownSVG } from '../_assets/images/dropdown.svg';
import { default as exportSVG } from '../_assets/images/export.svg';
import { default as dropdownSmSVG } from '../_assets/images/dropdown-sm.svg';
import { default as checkinSVG } from '../_assets/images/checkin.svg';
import { default as profileSVG } from '../_assets/images/profile.svg';
import { default as trashSVG } from '../_assets/images/trash.svg';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { userActions} from '../_actions';

class VisitorReviews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visitDate: '',
            searchBy: '',
        }
    }
    componentDidMount() {
        if(this.props.user &&  !this.props.user.default_location) {
            this.props.OpenLocationModelAction();
        }
        this.fetchData();
    }
    componentWillUnmount() {
        this.props.closeLocationModelAction();
    }
    fetchData() {
        try {
            if(!this.props.user.default_location) {
                return;
            }
            const { visitDate, searchBy } = this.state;
            let searchQuery = ``;
            if (visitDate && visitDate !== '') {
                if (searchQuery.length > 0) {
                    searchQuery = searchQuery + `&visitDate=${visitDate}`;
                } else {
                    searchQuery = `visitDate=${visitDate}`;
                }
            }
            if (searchBy && searchBy !== '') {
                if (searchQuery.length > 0) {
                    searchQuery = searchQuery + `&searchBy=${searchBy}`;
                } else {
                    searchQuery = `searchBy=${searchBy}`;
                }
            }
            this.props.fetchVisitorReviews(searchQuery);
        } catch (err) {
            console.log('\n fetchData review err:', err.message || err)
        }
    }
    onSelectDate = async (event) => {
        try {
            this.setState({ visitDate: event }, () => {
                this.fetchData();
            });
            return
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong in onSelectDate';
            errorToast(message)
        }
    }
    async handleChange(event) {
        try {
            let { value } = event.target;
            if (!value || value == '') {
                this.setState({ searchBy: '' }, () => {
                    this.fetchData();
                });
                return;
            } else {
                this.setState({ searchBy: value }, () => {
                    this.fetchData();
                });
                return;
            }
        } catch (error) {
            console.log('\n error:', error.message || error);
        }
    }
    render() {
        const {visitDate} = this.state;
        const {fetchingVisitorReview,visitorReviews} = this.props;
        return (<div>
            <section className="visitor-review-holder">
                <div className="cstm-container">
                    <div className="topbx-holder">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="headingbx">
                                    <div className="headcontbx">
                                        <h1>Visiter Reviews:</h1>
                                    </div>
                                    <div className="visitor-filters">
                                        <div className="filters-wrapper">
                                            <div className="serachbx-holder">
                                                <form className="form-inline my-2 my-lg-0">
                                                    <input className="form-control" type="search" placeholder="" aria-label="Search" onChange={(e) => this.handleChange(e)} />
                                                    <button className="btn my-2 my-sm-0" type="submit">
                                                        <img src={searchDark} alt="" />
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="drop_btns-holder">
                                                <div className="btn-holder dob-holder">
                                                    <DatePicker
                                                        calendarClassName="dob-calender"
                                                        className="btn dob-input"
                                                        placeholderText='Past Date'
                                                        dateFormat="dd-MM-yyyy"
                                                        selected={visitDate}
                                                        onChange={(date) => this.onSelectDate(date)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tablebx-holder">
                        <div className="table-inner">
                            <div className="table-responsive">
                                <table className="table" width="100%" height="auto">
                                    <thead>
                                        <tr>
                                            <th className="check-container">
                                                <div className="check-holder">
                                                    <div className="check-form-group">
                                                        <input type="checkbox" id="all" checked />
                                                        <label htmlFor="all">ALL </label>
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="name">Name</th>
                                            <th className="ratings">Rating</th>
                                            <th className="comments">Comments</th>
                                            <th className="submit">Submitted</th>
                                            <th className="actions"> &nbsp; </th>
                                            {!fetchingVisitorReview && visitorReviews && visitorReviews.length > 0 &&
                                            <th className="filter">
                                                <div className="filerdrop-holder">
                                                    <div className="dropdown">
                                                        <a className="nav-link" href="#" id="nameDropdown" role="button" data-display="static" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span className="dropbtn">
                                                                <span className="icon">
                                                                    <img src={DropSVG} alt="" />
                                                                </span>
                                                            </span>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-lg-right" aria-labelledby="nameDropdown">
                                                            <div className="smsdrop-holder">
                                                                <div className="smsheader">
                                                                    <h3>Filter</h3>
                                                                </div>
                                                                <div className="smsbody">
                                                                    <ul>
                                                                        <li> <a href="#" className="btn">Rating High-Low</a> </li>
                                                                        <li> <a href="#" className="btn">Rating Low-High</a> </li>
                                                                        <li> <a href="#" className="btn">Date Old-New</a> </li>
                                                                        <li> <a href="#" className="btn">Date New -Old</a> </li>
                                                                        <li> <a href="#" className="btn">A-Z</a> </li>
                                                                        <li> <a href="#" className="btn">Z-A</a> </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {!fetchingVisitorReview && visitorReviews && visitorReviews.length > 0 ?
                                    visitorReviews.map((value, index) => (
                                        <tr>
                                            <td className="check-container">
                                                <div className="check-holder">
                                                    <div className="check-form-group">
                                                        <input type="checkbox" id={index} />
                                                        <label htmlFor={index}> </label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="name">
                                                <div className="name-inner">
                                                    <h3>{value?.patientId?.first_name} {value?.patientId?.last_name}</h3>
                                                </div>
                                            </td>
                                            <td className="ratings">
                                                <div className="ratings-inner">
                                                    <p>Rating: {value?.point} out of 10</p>
                                                </div>
                                            </td>
                                            <td className="comments">
                                                <div className="comments-inner">
                                                    <p> <a href="#" className="btn">{value?.comment}</a> </p>
                                                </div>
                                            </td>
                                            <td className="submit">
                                                <div className="submit-inner">
                                                    <p>{value?.createdAt}</p>
                                                </div>
                                            </td>
                                            <td className="actions">
                                                <div className="filerdrop-holder">
                                                    <div className="dropdown">
                                                        <a className="nav-link" href="#" id="nameDropdown2" role="button" data-display="static" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span className="dropbtn">
                                                                <span className="icon"> <img src={dropdownSmSVG} alt="" /> </span>
                                                            </span>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-lg-right" aria-labelledby="nameDropdown2">
                                                            <div className="smsdrop-holder">
                                                                <div className="smsbody">
                                                                    <ul>
                                                                        <li>
                                                                            <a href="#" className="btn">
                                                                                <span className="icon"> <img src={checkinSVG} alt="" /> </span>
                                                                                <span className="txbx">Check In</span>
                                                                            </a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="#" className="btn">
                                                                                <span className="icon"> <img src={profileSVG} alt="" /> </span>
                                                                                <span className="txbx">Visitor Profile</span>
                                                                            </a>
                                                                        </li>
                                                                        <li className="dltbx">
                                                                            <a href="#" className="btn">
                                                                                <span className="icon"> <img src={trashSVG} alt="" /> </span>
                                                                                <span className="txbx">Delete Visitor</span>
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="filter blank"> &nbsp; </td>
                                        </tr>
                                    )) : <tr className="txt-center">
                                    {fetchingVisitorReview && <td className="text-center" colSpan="6"><h3>Loading....</h3></td>}
                                    {!fetchingVisitorReview && (!visitorReviews || visitorReviews.length == 0) && <td className="text-center" colSpan="6"><h3>No Reviews Found..</h3></td>}
                                    </tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                </div>
            </section>
        </div>)
    }
}

function mapState(state) {
    const { fetchingVisitorReview, visitorReviews, visitorReviewError } = state.users;
    const {user} = state.authentication;
    return { user, fetchingVisitorReview, visitorReviewError, visitorReviews };
}

const actionCreators = {
    fetchVisitorReviews: userActions.fetchVisitorReviews,
    OpenLocationModelAction :userActions.OpenLocationModelAction ,
    closeLocationModelAction:userActions.closeLocationModelAction
}


export default connect(mapState, actionCreators)(VisitorReviews);