import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { default as passwordSVG } from '../_assets/images/password.svg';
import { default as showPasswordSVG } from '../_assets/images/show-password.svg';
import { default as cancelSVG } from '../_assets/images/cancel.svg';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { validateEmail, errorToast } from '../_helpers';
import Select from 'react-select';
import "../_assets/css/sass/register.scss";
import { InlineWidget, CalendlyEventListener } from "react-calendly";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                businessName: '',
                email: '',
                password: '',
                agree: false,
                locationNumber: '',
                fullNumber: '',
                selectedTimeZone: ''
            },
            errors: {
                agree: false,
                businessName: false,
                email: false,
                password: false,
                locationNumber: false,
                fullNumber: false,
                selectedTimeZone: false
            },
            formSteps: {
                step1: true,
                step2: false,
                step3: false,
                step4: false
            },
            passwordType: "password",
            timeZoneOptions: [],
            logoImage:'',
            logoContent:null,
            calendly_url: "https://calendly.com/hello-4124",
            calendly_setting: {
                hideLandingPageDetails:true,
                hideGdprBanner:true,
                textColor:'495057',
                primaryColor:'39b36a'
            },
            calendly_prefill:{
                email:''
            } ,
            calendly_style:{
                minWidth:'320px',
                height:'450px',
                width:'437px'
            },
            isCalendlySubmited:false
        };
    }
    async componentDidMount() {
        this.getTimeZone();
    }
    getTimeZone() {
        try {
            const ct = require('countries-and-timezones');
            const timezones = ct.getAllTimezones();
            const timeZoneArray = [];
            Object.values(timezones).forEach(
                (val) => {
                    val['value'] = val.aliasOf;
                    val['label'] = val.name;
                    timeZoneArray.push(val);
                }
            );
            this.setState({ timeZoneOptions: timeZoneArray })

        } catch (err) {
            console.log('\n error in getTimeZone:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }

    handleChange = async (event) => {
        try {
            const { name, value } = event.target;
            const { user, errors } = this.state;
            switch (name) {
                case 'businessName':
                    if (value.length < 5) {
                        errors.businessName = true;
                    } else {
                        errors.businessName = false;
                    }
                    break;
                case 'email':
                    const checkEmail = await validateEmail(value);
                    if (!checkEmail) {
                        errors.email = true;
                    } else {
                        errors.email = false;
                    }
                    break;
                case 'password':
                    if (value.length < 8) {
                        errors.password = true;
                    } else {
                        errors.password = false;
                    }
                    break;
                case 'locationNumber':
                    if (value <= 0) {
                        errors.locationNumber = true;
                    } else {
                        errors.locationNumber = false;
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

        } catch (err) {
            console.log('\n error handleChange:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }
    handleAgreeCheck(e) {
        try {
            let isChecked = e.target.checked;
            const { name } = e.target;
            const { user, errors } = this.state;
            if (isChecked) {
                errors.agree = false;
            } else {
                errors.agree = true;
            }
            user[name] = isChecked;
            console.log('\n user:', user, name)
            this.setState({ ...errors, ...user });
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }
    handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const { user, errors, logoContent } = this.state;
            if (errors.agree ||
                errors.businessName ||
                errors.email ||
                errors.password ||
                errors.locationNumber ||
                errors.fullNumber) {
                return;
            }
            if (!user.selectedTimeZone || user.selectedTimeZone == '') {
                errors.selectedTimeZone = true;
                this.setState({ ...errors });
                return;
            }
            if (!user.agree) {
                return;
            }
            if (user.businessName && user.email && user.password && user.locationNumber && user.fullNumber) {
                user['agreeTermCondition'] = user.agree;
                user['avatar'] = logoContent;
                const payload = { ...user };
                this.props.register(payload);
            }
        } catch (err) {
            console.log('\n error in handleSubmit:', err.message || err)
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log('Component received new props', nextProps, this.props.registerError, this.props.registering);
        try {
            if ((nextProps.hasOwnProperty('registerError') && nextProps.registerError) && (nextProps.hasOwnProperty('registering') && !nextProps.registering)) {
                console.log('\n here com update...')
                const { formSteps } = this.state;
                if (!formSteps.step1 && formSteps.step4) {
                    formSteps.step1 = true;
                    formSteps.step4 = false;
                    this.setState({ ...formSteps })
                }
            }
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }


    handleSteps = async (event) => {
        try {
            const { user, errors, formSteps,calendly_prefill} = this.state;
            console.log('\n user:', user)
            if (formSteps.step1) {
                if ((user.email == '' || errors.email) || !user.agree) {
                    if (user.email == '')
                        errors.email = true;
                    if (!user.agree)
                        errors.agree = true;
                    console.log('\n .error-box:', errors)
                    return this.setState({ ...errors });
                }
                calendly_prefill.email = user.email;
                this.setState({...calendly_prefill});
                formSteps.step1 = false;
                formSteps.step2 = true;
            } else if (formSteps.step2) {
                if ((user.password == '' || errors.password)) {
                    errors.password = true;
                    return this.setState({ ...errors });;
                }
                formSteps.step2 = false;
                formSteps.step3 = true;
            } else if (formSteps.step3) {
                if ((!user.locationNumber || user.locationNumber == '' || errors.locationNumber) ||
                    (!user.fullNumber || user.fullNumber == '' || errors.fullNumber) ||
                    (!user.selectedTimeZone || user.selectedTimeZone == '' || errors.selectedTimeZone) ||
                    (!user.businessName || user.businessName == '' || errors.businessName)
                ) {
                    if (!user.locationNumber || user.locationNumber == '') {
                        errors.locationNumber = true;
                    }
                    if (!user.fullNumber || user.fullNumber == '') {
                        errors.fullNumber = true;
                    }
                    if (!user.selectedTimeZone || user.selectedTimeZone == '') {
                        errors.selectedTimeZone = true;
                    }
                    if (!user.businessName || user.businessName == '') {
                        errors.businessName = true;
                    }
                    return this.setState({ ...errors });
                }
                formSteps.step3 = false;
                formSteps.step4 = true;
            } else if (formSteps.step4) {
                return this.handleSubmit(event);
            }
            this.setState({ ...formSteps, ...errors });
        } catch (err) {
            console.log('\n error in handleSteps:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }
    changePasswordType = async (e) => {
        try {
            let { passwordType } = this.state;
            if (passwordType === 'text') {
                passwordType = 'password';
            } else {
                passwordType = 'text';
            }
            this.setState({ passwordType: passwordType });


        } catch (err) {
            console.log('\n error in changePasswordType:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }
    handlePhoneChange = async (value) => {
        try {
            const { user, errors } = this.state;
            errors.fullNumber = false;
            if (!value) {
                errors.fullNumber = true;
            }
            user.fullNumber = value;
            this.setState({ ...user, ...errors });
        } catch (err) {
            console.log('\n handlePhoneChange error:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }
    handleSelectedChange = async (event, type) => {
        try {
            const { user, errors } = this.state;
            let value = event;
            const name = (type === 1) ? 'selectedTimeZone' : 'selectedLanguage';
            if (!value) {
                errors[name] = true;
            } else {
                errors[name] = false;
                const option = {
                    label: value.label,
                    value: (value.value) ? value.value : value.name
                };
                user[name] = option;
            }
            return this.setState({ ...user, ...errors })
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong in handleSelectedChange';
            errorToast(message)
        }
    }
    onImageChange = (event) => {
        try {
            if (event.target.files && event.target.files[0]) {
                this.setState({
                    logoImage: URL.createObjectURL(event.target.files[0]),
                    logoContent: event.target.files[0]
                });
            }
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong in handleSelectedChange';
            errorToast(message)
        }
    }
    updateImageOnClickImage = async (event) => {
        try {
            document.getElementById("file-name2").click();
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong in handleSelectedChange';
            errorToast(message)
        }
    }
    resetSelectedImage = async (event) => {
        this.setState({ logoImage: '', logoContent: null })
    }
    onEventScheduled = (event) => {
        if(event.data.event == 'calendly.event_scheduled') {
            this.setState({isCalendlySubmited:true})
        }
    }
    render() {
        const { formSteps, user, errors, passwordType, timeZoneOptions,logoImage, 
            calendly_url,calendly_setting,calendly_prefill,calendly_style, isCalendlySubmited} = this.state;
        const { registering } = this.props;
        return (
            <div>
                <div className="steps-wrapper">
                    <div className="inner-container">
                        <div className="contbx-holder">
                            <div className="txbx-holder">
                                <h1> <strong>14</strong> DAY FREE TRIAL, <span>with a follow up email.</span> </h1>
                                <div className="form-holder">
                                    <h3>STEP
                                        {formSteps.step1 && <span>1</span>}
                                        {formSteps.step2 && <span>2</span>}
                                        {formSteps.step3 && <span>3</span>}
                                        {formSteps.step4 && <span>4</span>}
                                        OF 4</h3>
                                    <form className="form" action="" method="post">
                                        {formSteps.step1 && <div>
                                            <div className="form-group">
                                                <label htmlFor="email-lable">Enter Primary Email Address</label>
                                                <input type="email" name="email" value={user.email} className={errors.email ? 'form-control error-box' : 'form-control'} placeholder="Enter Your Email Address" onChange={(e) => this.handleChange(e)} />
                                            </div>
                                            <div className="form-group privacy-check">
                                                <label className="check-container">
                                                    <input type="checkbox" value={user.agree} name="agree" onChange={(e) => this.handleAgreeCheck(e)} className={errors.agree ? 'form-control error-box' : 'form-control'} />
                                                    <span className={errors.agree ? 'checkmark error-box' : 'checkmark'}></span>
                                                    <span className="tx">Yes!I would like to be notified of updates, additional offers, and Other information from PLL.</span>
                                                </label>
                                            </div>
                                            <div className="agree_terms-contbx">
                                                <p>Statement about protection Policy…. We will not share any of your company or patients information. We reserve the right to terminate any agreement….We will not share any of your company or patients information. We reserve the right to terminate any agreement…. Our <a href="#">SubScriber Agreement</a> wording filler <a href="#">Privacy Policy</a> and <a href="#">Michigan Privacy Notice</a>. </p>
                                                <div className="agreebtn-holder">
                                                    <button type="button" name="button" className="btn cancel" onClick={(e) => this.handleSteps(e)}> AGREE &amp; CONTINUE </button>
                                                </div>
                                            </div>
                                        </div>}
                                        {formSteps.step2 && <div>
                                            <div className="form-group">
                                                <label htmlFor="create-password">Create a password</label>
                                                <input type={passwordType} name="password" value={user.password} className={errors.password ? 'form-control error-box' : 'form-control'} placeholder="Password" onChange={(e) => this.handleChange(e)} />
                                                <span className="iconbx"> <img onClick={(e) => this.changePasswordType(e)} src={passwordType === 'password' ? showPasswordSVG : passwordSVG} alt="" /> </span>
                                            </div>
                                            <div className="agree_terms-contbx">
                                                <p>Use a minimum of 6 characters (case sensitive) with at least one number or special character. </p>
                                                <br />
                                                <p>This will be your Administrative password.You will use this password to log in to your account.Password and email are changeable once your account is created.
                                                    Please Save or write it down your password</p>
                                                <div className="agreebtn-holder">
                                                    <button type="button" name="button" className="btn cancel" onClick={(e) => this.handleSteps(e)}>  CONTINUE </button>
                                                </div>
                                            </div>
                                        </div>}
                                        {formSteps.step3 && <div>
                                            <div className="form-group">
                                                <label htmlFor="practice-name">Business Name</label>
                                                <input type="text" name="businessName" value={user.businessName} className={errors.businessName ? 'form-control error-box' : 'form-control'} placeholder="Healing Hospital" onChange={(e) => this.handleChange(e)} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="location-number">Number of Locations</label>
                                                <input type="number"
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    name="locationNumber"
                                                    value={user.locationNumber}
                                                    className={errors.locationNumber ? 'form-control error-box' : 'form-control'} placeholder="set location number for ex: 2" onChange={(e) => this.handleChange(e)} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="create-password">Phone Number</label>
                                                <PhoneInput
                                                    name="fullNumber"
                                                    className={errors.fullNumber ? 'form-control error-box' : 'form-control'}
                                                    international
                                                    defaultCountry="US"
                                                    value={user.fullNumber}
                                                    onChange={value => this.handlePhoneChange(value)} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="create-password">Time Zone</label>
                                                <Select
                                                    value={user.selectedTimeZone}
                                                    onChange={(e) => this.handleSelectedChange(e, 1)}
                                                    options={timeZoneOptions}
                                                    className={errors.selectedTimeZone ? 'form-control error-box' : 'form-control'}
                                                    name="selectedTimeZone"
                                                    placeholder="Time Zone"
                                                />
                                            </div>
                                            <div className="form-group upload-group">
                                                <div className="drop-zone">
                                                    <div className="content">
                                                        <label className="button drag_file-holder" htmlFor="file-name">
                                                            {logoImage ?
                                                                (<div className="select-img-content">
                                                                    <img id="cancel-target" src={cancelSVG} onClick={this.resetSelectedImage} />
                                                                    <img id="target" src={logoImage} onClick={this.updateImageOnClickImage} /></div>) :
                                                                (<div className="drag-contbx">
                                                                    <h1>Add Your Logo</h1>
                                                                    <div className="addfile-btn">
                                                                        <label className="button" htmlFor="file-name2">Upload Image</label>
                                                                    </div>
                                                                    <p className="btmdesp">Customize your free PLL signage by adding your company logo to the <a href="#">free signage.</a> </p>
                                                                </div>)}
                                                            <input className="upload-file-input" id="file-name2" multiple="" onChange={this.onImageChange} type="file" accept=".jpg,.jpeg,.png" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="agree_terms-contbx">
                                                <div className="agreebtn-holder">
                                                    <button type="button" name="button" className="btn cancel" onClick={(e) => this.handleSteps(e)}>  CONTINUE </button>
                                                </div>
                                            </div>
                                        </div>}
                                        {formSteps.step4 &&
                                            <div>
                                                <div className="form-group">
                                                <InlineWidget url={calendly_url} prefill={calendly_prefill} pageSettings={calendly_setting} styles={calendly_style} />
                                                <CalendlyEventListener  onEventScheduled={this.onEventScheduled} />
                                                </div>
                                                {!isCalendlySubmited && <p id="calendly-submit-message">Please schedule Calendly meeting. Before submit your form </p>}
                                                <div className="agree_terms-contbx">
                                                    <div className="agreebtn-holder">
                                                        <button type="button" name="button" className="btn cancel" onClick={(e) => this.handleSteps(e)} disabled={registering || !isCalendlySubmited} > AGREE &amp; CONTINUE </button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { registering, registerError } = state.registration;
    return { registering, registerError };
}

const actionCreators = {
    register: userActions.register
}

export default connect(mapStateToProps, actionCreators)(RegisterPage);