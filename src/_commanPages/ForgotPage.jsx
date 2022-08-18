import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userActions } from '../_actions';
import {
    forgotWeb,
    cancleWhiteImage,
    sendImage
} from '../_assets';
import {validateEmail} from '../_helpers';

class ForgotPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            submitted: false,
            inValid : true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = async (e) => {
        const { name, value } = e.target;
        if (name === 'email' && (typeof name !== "undefined")) {
            const checkEmail = await validateEmail(value);
            if (!checkEmail) {
                this.setState({inValid:false});
            } else {
                this.setState({inValid:true});
            }
        }
        this.setState({ [name]: value });
    }
    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { email, inValid } = this.state;
        if(!email || !inValid) {
            return;
        }
        if (email) {
            this.props.forgot(email);
        }
        this.setState({ submitted: false });
    }
    render() {
        const { emailSending  } = this.props;
        const {email, submitted, inValid} = this.state;
        return (<div className="login-wrapper">
        <div className="forgot-grid-container">
            <div className="contbx-holder">
                <div className="imgbx-holder">
                    <img src={forgotWeb} alt="" />
                </div>
                <div className="inner">
                    <h3><span>Forgot your password?</span> </h3>
                    <p>Enter your email address and we'll send you a link to reset password.</p>
                    <form className="form" action="" method="post">
                        <div className="form-group">
                            <input type="email" name="email" value={email} className="form-control" placeholder="Email Address" onChange={this.handleChange} />
                            {submitted && !email &&
                            <span className="error help-block">Email is required</span>}
                            {submitted && !inValid &&
                            <span className="error help-block">Please enter valid email address</span>}
                        </div>
                        <div className="submitbtn-holder">
                            <button type="button" name="button" className="btn cancel">
                            <Link to="/login"><img src={cancleWhiteImage} alt=""/></Link> 
                            </button>
                            <button type="button" name="button" className="btn" onClick={this.handleSubmit} disabled={emailSending}>
                                <img src={sendImage} alt=""/>
                            </button>
                        </div>
                    </form>
                    <div className="sign-btmbx">
                        <p>Return to 
                            <Link to="/login">Sign in</Link> 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    }
}

function mapStateToProps(state) {
    const {emailSending} = state.forgot
    return {emailSending};
}

const actionCreators = {
    forgot: userActions.forgot
}

export default connect(mapStateToProps, actionCreators)(ForgotPage);