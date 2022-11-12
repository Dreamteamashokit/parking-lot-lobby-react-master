import React from 'react';
import { connect } from 'react-redux';
import { Link} from 'react-router-dom';
import { userActions } from '../_actions';
import {
    forgotWeb,
    cancleWhiteImage,
    sendImage
} from '../_assets';
import queryString from 'query-string'
import {validateForm, history} from '../_helpers';
class ResetPasswordPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            resetToken:'',
            user: {
                password: '',
                repeatPassword: ''
            },
            errors: {
                password: {info:'', status:true},
                repeatPassword: {info:'', status:true}
              },
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
     try {
        let queries = queryString.parse(this.props.location.search)
        if(queries && queries.token) {
            this.setState({ resetToken: queries.token});
        } else {
            history.push('/');
            return;
        }
     } catch (error) {
         console.log('\n error:', error.message || error);
     }
    }
    async handleChange(event) {
        try {
            const { name, value } = event.target;
            const { user, errors } = this.state;
            switch (name) {
                case 'password': 
                    if(value.length < 8) {
                        errors.password.info = 'Password must be 8 characters long!';
                        errors.password.status = true;
                    } else if (user.repeatPassword && (user.repeatPassword !== value)) {
                        errors.repeatPassword.info= 'Password & Repeat Password Must be same';
                        errors.repeatPassword.status = true;
                        errors.password.status = false;
                        errors.password.info = '';
                    } else {
                        errors.password.status = false;
                        errors.password.info = '';
                        errors.repeatPassword.info = '';
                        errors.repeatPassword.status = false;
                    }
                break;
                case 'repeatPassword': 
                    if(value.length < 8) {
                        errors.repeatPassword.info = 'Repeat Password must be 8 characters long!';
                        errors.repeatPassword.status = true;
                    } else if (user.password && (user.password !== value)) {
                        errors.repeatPassword.info= 'Password & Repeat Password Must be same';
                        errors.repeatPassword.status = true;
                    } else {
                        errors.repeatPassword.info = '';
                        errors.repeatPassword.status = false;
                    }
                break;
                default:
                break;
            }
            
            this.setState({
                errors,
                user: {
                    ...user,
                    [name]: value
                }
            });

        } catch (e) {
            console.log('\n error handleChange:', e.message || e);
        }
    }
    async handleSubmit(event) {
        try {
            event.preventDefault();
            const params = (new URL(document.location)).searchParams;
            const resetToken = params.get("token");
            this.setState({ submitted: true });
            const {user, errors} = this.state;
            const checkError = await validateForm(errors);
            if(!checkError) {
                console.error('not valid form.')
                return;
            }
            if(!resetToken) {
                console.log('\n no reset token found...')
                return;
            }
            user['resetToken'] = resetToken;
            if (user.password && user.repeatPassword) {
                this.props.resetPassword(user);
            }
        } catch (error) {
            this.setState({ submitted: false });
            console.log('\n error:', error.message || error);
        }
    }
    render() {
        const { resetingPassword  } = this.props;
        const {user,errors, submitted} = this.state;
        return (<div className="login-wrapper">
        <div className="forgot-grid-container">
            <div className="contbx-holder">
                <div className="imgbx-holder">
                    <img src={forgotWeb} alt="" />
                </div>
                <div className="inner">
                    <h3><span>Reset your password?</span> </h3>
                    <form className="form padding-top" action="" method="post">
                        <div className="form-group">
                            <input type="password" name="password" value={user.password} className="form-control" placeholder="Password" onChange={this.handleChange} />
                            {errors.password.info.length > 0 && 
                                <span className='error help-block'>{errors.password.info}</span>}
                            {submitted && errors.password.info.length == 0 && errors.password.status &&
                                <span className='error help-block'>required</span>}

                        </div>
                        <div className="form-group">
                            <input type="text" name="repeatPassword" value={user.repeatPassword} className="form-control" placeholder="Repeat Password" onChange={this.handleChange} />
                            {errors.repeatPassword.info.length > 0 && 
                                <span className='error help-block'>{errors.repeatPassword.info}</span>}
                            {submitted && errors.repeatPassword.info.length === 0 && errors.repeatPassword.status &&
                                <span className='error help-block'>required</span>}

                        </div>
                        <div className="submitbtn-holder">
                            <button type="button" name="button" className="btn cancel">
                            <Link to="/login"><img src={cancleWhiteImage} alt=""/></Link> 
                            </button>
                            <button type="button" name="button" className="btn" onClick={this.handleSubmit} disabled={resetingPassword}>
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
    const {resetingPassword} = state.resetPassword
    return {resetingPassword};
}

const actionCreators = {
    resetPassword: userActions.resetPassword
}

export default connect(mapStateToProps, actionCreators)(ResetPasswordPage);