import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { adminActions } from '../_actions';
import {validateEmail} from '../_helpers';
import {
    sendImage
} from '../_assets';

class AdminLoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
         this.props.logout();

        this.state = {
            username: '',
            password: '',
            submitted: false,
            errors: {
                username: {info:'', status:true}
            },
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }    
    async handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { username, password } = this.state;
        if(!username) {
            return;
        }
        const checkEmail = await validateEmail(username);
        const { errors} = this.state;
        if(!checkEmail) {
            errors.username.status = true;
            errors.username.info = 'Not a valid email';
            this.setState({errors});
            return;
        } else {
            errors.username.status = false;
            errors.username.info = '';
            this.setState({errors});
        }
        if(!password) {
            return;
        }
        const email = username;
        this.props.login(email, password);
    }

    render() {
        const { loggingIn } = this.props;
        const { username, password, submitted, errors } = this.state;
        return (
    <div className="login-wrapper">
        <div className="login-grid-container">
            <div className="leftbx">
                <div className="contbx-holder">
                    <h1>Welcome to <br />Parking Lobby Admin Panel.</h1>
                    <p>Fill up Admin Login detail to track your client information.</p>
                    
                </div>
            </div>
            <div className="rgtbx">
                <div className="inner">
                    <h3><span>Login</span> to admin panel to track all client's and there locations.</h3>
                    <form className="form" action="" method="post">
                        <div className="form-group">
                            <input type="text" name="username" value={username} className="form-control" placeholder="Email" onChange={this.handleChange} />
                            {submitted && !username &&
                            <span className="error help-block">Email is required</span>}
                            {submitted && errors.username.status && 
                                <span className='error help-block'>{errors.username.info}</span>
                            }
                        </div>
                        <div className="form-group">
                            <input type="text" name="password" value={password} className="form-control" placeholder="Password" onChange={this.handleChange} />
                            {submitted && !password &&
                            <span className="error help-block">Password is required</span>
                        }
                        </div>
                        <div className="submitbtn-holder">
                            <button type="button" name="button" className="btn" onClick={this.handleSubmit} disabled={loggingIn}>
                                <img src={sendImage} alt=""/>
                            </button>
                        </div>
                    </form>
                   
                </div>
            </div>
            </div>
       </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const actionCreators = {
    login: adminActions.login,
    logout: adminActions.logout
};

export default connect(mapStateToProps, actionCreators)(AdminLoginPage);