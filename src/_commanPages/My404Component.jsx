import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    fbImage,
    twitterImage,
    googleImage
} from '../_assets';

class My404Component extends React.Component {
    constructor(props) {
        console.log('\n ........404.....')
        super(props);

        this.state = {};
    }
    
    render() {
        return (
        <div className="login-wrapper">
            <div className="login-grid-container">
             <div className="fullbx">
                <div className="contbx-holder">
                        <h1 className="text-center">Welcome to <br />Parking Lot Lobby.</h1>
                        <h1 className="text-center">404 - Not Found!</h1>
                        <div className="text-center font-link">
                        <Link to="/">Go Home</Link>
                        </div>
                </div>
             </div>
            </div>
         </div>
         )
    }
}

function mapStateToProps(state) {
    return {}
}

const actionCreators = {}

export default connect(mapStateToProps, actionCreators)(My404Component);