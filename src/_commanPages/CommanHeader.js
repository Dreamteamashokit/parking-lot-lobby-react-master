import React from 'react';
import { connect } from 'react-redux';
import "../_assets/css/sass/_outer-header.scss";
import {logoImage} from '../_assets'
import { Link } from 'react-router-dom';
class CommanHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginPage:false
        }
    }
    
    render() {
        const {isLoginPage} = this.state;
        return (
                <div className="wrapper">
                    <header className="header">
                        <div className="container-fluid h100">
                            <nav className="navbar navbar-expand-lg h100">
                            <Link className="navbar-brand" to="/"><img src={logoImage} alt="" /></Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav m-auto signtx-holder">
                                        <li className="nav-item trybtn-holder">
                                            <Link className="nav-link" to="/register">
                                            <span>Try for Free!</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                          <Link className="nav-link" to="/">Programs</Link>
                                        </li>
                                        <li className="nav-item">
                                        <Link className="nav-link" to="/">About</Link>
                                        </li>
                                        <li className="nav-item">
                                        <Link className="nav-link" to="/">Help Desk</Link>
                                        </li>
                                    </ul>
                                    {!isLoginPage &&
                                    <div className="rightbx">
                                        <div className="userinfo signinbtn-holder">
                                            <div className="btn-holder">
                                            <Link className="signinbtn greenbtn" to="/"><span>Sign in</span></Link>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </nav>
                        </div>
                    </header>
                </div>
        )
    }
}
function mapStateToProps(state) {
    return {};
 }
const actionCreators = {}

export default connect(mapStateToProps, actionCreators)(CommanHeader);
