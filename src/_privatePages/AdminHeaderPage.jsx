import React from 'react';
import { connect } from 'react-redux';
import { adminActions, commonActions } from '../_actions';
import {
    logoImage,
    clockImage,
    searchImage,
    notifyImage,
    settingImage,
    blueNotification
} from '../_assets'
import { formConstants } from '../_constants';
import { capitalize, history, fetchAPIEndpoint, getLoginUserId, socket, errorToast} from '../_helpers';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { default as usersGroupSVG } from '../_assets/images/users-group.svg';
import { default as mapSignsSVG } from '../_assets/images/map-signs.svg';
import "../_assets/css/sass/_location.scss";


class AdminHeaderPage extends React.Component {
    constructor(props) {
        super(props);     
    }


    handleLogout() {
        this.props.logout();
        history.push('/admin/login');
    }
  

    render() {
    
        return (
            <section className="header-container">
                <header className="header">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg">
                            <Link className="navbar-brand" to="/admin/dashboard"><img src={logoImage} alt="" /></Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav m-auto">
                                    <li htmlFor="drop-timer" className="nav-item dropdown timer">
                                        <a className="nav-link" href="#" id="clockDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={clockImage} alt="" className="clock" />
                                            <span>
                                                <Moment interval={1000} format="h:mm a"></Moment>
                                            </span>
                                        </a>
                                    </li>
                                </ul>

                                <div className="rightbx">
                                    <div className="notify">
                                        <div className="nav-item dropdown">
                                            <a className="nav-link" href="#" id="notifyDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src={notifyImage} alt="" className="notify" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="userinfo">
                                        <div className="nav-item dropdown">
                                            <a className="nav-link user" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span>JD</span>
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="userDropdown">
                                                <a className="dropdown-item" onClick={() => this.handleLogout()}>Logout</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </nav>
                    </div>
                   
                </header>
            
                
            </section>

        );
    }
}

function mapState(state) {
    const authentication = state.adminAuthentication;
    return {authentication}
}

const actionCreators = {
    logout: adminActions.logout,
}

export default connect(mapState, actionCreators)(AdminHeaderPage);

