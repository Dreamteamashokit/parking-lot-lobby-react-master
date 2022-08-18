import React from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear } from 'date-fns';
import { range } from 'underscore';
import Multiselect from 'multiselect-react-dropdown';
import { validateForm, validateEmail, errorToast,history} from '../_helpers';
import { userActions } from '../_actions';
class PatientForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationId: null,
            patientId:null,
            patient: {
                firstName: '',
                lastName: '',
                dob: '', // datepicker
                gender: '', // 1=> male 2=> female 3 => other dropdown
                visitReason: '',
                visitType: [], // select dropdown
                coronavirusContact: '', //  1=> yes 2 =>No  3 => nor sure 
                parkingSpot:'',
                isTextNotification: 1, // boolean 1=> yes 2 => NO
                hasPatient:'', // boolean 1=> yes 2 => NO
                email: ''
            },
            formSteps: {
                step1: true,
                step2: false,
                step3: false,
                step4: false
            },
            errors: {
                firstName: false,
                lastName: false,
                dob: false,
                gender: false,
                visitReason: false,
                visitType: false,
                coronavirusContact: false,
                isTextNotification: false,
                hasPatient:false,
                email: false,
            },
            isEmptyField: true,
            years: range(1970, getYear(new Date()) + 1, 1),
            months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            visitOptions: [
                { name: 'Imaging', id: 1 },
                { name: 'Lab', id: 2 },
                { name: 'Occupational Medicine', id: 3 },
                { name: 'Surgery', id: 4 },
                { name: 'Urgent Care', id: 5 }
            ]
        }
        this.onSelectVisitType = this.onSelectVisitType.bind(this);
        this.onRemoveVisitType = this.onRemoveVisitType.bind(this);
    }
    componentDidMount() {
        try {
            if (this.props && this.props.match && this.props.match.params && this.props.match.params.locationId) {
                this.setState({ locationId: this.props.match.params.locationId });
            }
            if (this.props && this.props.match && this.props.match.params && this.props.match.params.patientId) {
                this.setState({ patientId: this.props.match.params.patientId });
            }
        } catch (err) {
            console.log('\n componentDidMount error:', err.message | err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }

    handleChange = async (event, type = 1) => {
        try {
            const { patient, errors } = this.state;
            if (type === 1) {
                let { name, value } = event.target;
                errors[name] = false;
                if (name === 'email') {
                    const checkEmail = await validateEmail(value);
                    if (!checkEmail) {
                        errors.email = true;
                    } else {
                        errors.email = false;
                    }
                }

                if (!value) {
                    errors[name] = true;
                }
                patient[name] = value;
            } else if (type === 3) {
                console.log('\n event:', event);
                errors["dob"] = false;
                if (!event) {
                    errors["dob"] = true;
                }
                patient["dob"] = event;
            } 
            if ((patient.isTextNotification && patient.isTextNotification !== '' && !errors.isTextNotification) && (patient.email && patient.email !== '' && !errors.email)) {
                this.setState({ isEmptyField: false });
            }
            this.setState({ ...patient, ...errors });
        } catch (err) {
            console.log('\n err  in handleChange:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message);
        }

    }
    handleSteps = async (event, nextStep = true) => {
        try {
            const { patient, formSteps } = this.state;
            if (formSteps.step1) {
                if (!nextStep) {
                    return;
                }
                if ((patient.firstName == '' || !patient.firstName) || (patient.lastName == '' || !patient.lastName) || (patient.dob == '' || !patient.dob) || (patient.gender == '' || !patient.hasPatient) || (patient.hasPatient == '' || !patient.hasPatient)) {
                    return;
                }
                formSteps.step1 = false;
                formSteps.step2 = true;
            } else if (formSteps.step2) {
                if (!nextStep) {
                    formSteps.step1 = true;
                    formSteps.step2 = false;
                } else {
                    if ((!patient.visitReason || patient.visitReason == '') || (!patient.visitType || patient.visitType.length === 0)) {
                        return;
                    }
                    formSteps.step2 = false;
                    formSteps.step3 = true;
                }
            } else if (formSteps.step3) {
                if (!nextStep) {
                    formSteps.step2 = true;
                    formSteps.step3 = false;
                } else {
                    if ((!patient.coronavirusContact || patient.coronavirusContact == '')) {
                        return;
                    }
                    formSteps.step3 = false;
                    formSteps.step4 = true;
                }

            } else if (formSteps.step4) {
                if (!nextStep) {
                    formSteps.step3 = true;
                    formSteps.step4 = false;
                } else {
                    if ((!patient.isTextNotification || patient.isTextNotification == '') || (!patient.email || patient.email == '')) {
                        return;
                    }
                }
            }
            this.setState({ ...formSteps });
        } catch (err) {
            console.log('\n error in handleSteps:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }
    onSelectVisitType(selectedList, selectedItem) {
        try {
            console.log('\n on select', selectedList, selectedItem)
            const { patient, errors } = this.state;
            patient.visitType = selectedList
            errors.visitType = false;
            this.setState({ ...patient, ...errors });
        } catch (err) {
            console.log('\n error in select visit:', err.message || err)
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }

    onRemoveVisitType(selectedList, removedItem) {
        try {
            console.log('\n on remove', removedItem)
            const { patient, errors } = this.state;
            patient.visitType = selectedList
            if (patient.visitType.length === 0) {
                errors.visitType = true;
            }
            this.setState({ ...patient, ...errors });
        } catch (err) {
            console.log('\n error in select visit:', err.message || err)
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }
    selectOption = (field, type) => {
        try {
            const { patient, errors } = this.state;
            patient[field] = type;
            errors[field] = false;
            if (field === 'isTextNotification') {
                if ((patient.isTextNotification && patient.isTextNotification !== '' && !errors.isTextNotification) && (patient.email && patient.email !== '' && !errors.email)) {
                    this.setState({ isEmptyField: false });
                }
            }
            this.setState({ ...patient, ...errors });
        } catch (err) {
            console.log('\n selectOption error:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }

    handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const { patient, locationId,patientId, errors } = this.state;
            const checkError = await validateForm(errors);
            console.log('\n checkError:', checkError);
            if (!locationId || !patientId) {
                return;
            }
            if (!checkError) {
                console.error('not valid form.')
                return;
            }
            if (patient.firstName &&
                patient.lastName &&
                patient.dob &&
                patient.hasPatient &&
                patient.gender &&
                patient.visitReason &&
                patient.visitType &&
                patient.coronavirusContact &&
                patient.email &&
                patient.isTextNotification
            ) {
                patient['locationId'] = locationId;
                patient['patientId']= patientId;
                await this.props.patientRegister(patient)
            }
        } catch (e) {
            console.log('\n error in handleSubmit:', e.message || e);
            let message = (e && e.message) ? e.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log('Component received new props', nextProps);
        try {
            if ((nextProps.hasOwnProperty('isPatientRegisterError') && nextProps.isPatientRegisterError) && (nextProps.hasOwnProperty('registeringPatient') && !nextProps.registeringPatient)) {
                const { formSteps } = this.state;
                if (!formSteps.step1 && formSteps.step4) {
                    formSteps.step1 = true;
                    formSteps.step4 = false;
                    this.setState({ ...formSteps })
                }
            }else if ((nextProps.hasOwnProperty('isPatientRegisterComplete') && nextProps.isPatientRegisterComplete)){
                if(nextProps.redirect_url) {
                    window.open(nextProps.redirect_url,"_self")
                } else {
                    history.push('/thank-you');
                }
            }  
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }

    render() {
        const { patient, formSteps, locationId, patientId,errors, isEmptyField } = this.state;
        const {registeringPatient} = this.props;
        return (
            <div>
                {locationId && patientId &&
                    <div>
                        <div className="wrapper">
                            <section className="steps-container">
                                <div className="steps-holder">
                                    <ul>
                                        <li className={formSteps.step1 ? 'active' : 'in-active'}>
                                            <span className="num">1</span>
                                            <span className="tx">Patient Info</span>
                                        </li>
                                        <li className={formSteps.step2 ? 'active' : 'in-active'}>
                                            <a href="#">
                                                <span className="num">2</span>
                                                <span className="tx">Visit Info</span>
                                            </a>
                                        </li>
                                        <li className={formSteps.step3 ? 'active' : 'in-active'}>
                                            <a href="#">
                                                <span className="num">3</span>
                                                <span className="tx"> Visit Questions</span>
                                            </a>
                                        </li>
                                        <li className={formSteps.step4 ? 'active' : 'in-active'}>
                                            <a href="#">
                                                <span className="num">4</span>
                                                <span className="tx">Contact Info </span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>

                        <div className="steps-wrapper patientinfo-wrapper">
                            <div className="inner-container">
                                <div className="contbx-holder">
                                    <div className="txbx-holder">
                                        <h1> Fill up following information and <span>Start journey with us.</span> </h1>
                                        <div className="form-holder">
                                            <h3>STEP
                                                {formSteps.step1 && <span>1</span>}
                                                {formSteps.step2 && <span>2</span>}
                                                {formSteps.step3 && <span>3</span>}
                                                {formSteps.step4 && <span>4</span>}
                                                OF 4
                                            </h3>
                                            <form className="form" action="" method="post">
                                                {formSteps.step1 && <div>
                                                    <div className="form-group">
                                                        <label htmlFor="">First name</label>
                                                        <input type="text" name="firstName" value={patient.firstName} className={errors.firstName ? 'form-control error-box' : 'form-control'} placeholder="First Name" onChange={(e) => this.handleChange(e)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="">Last name</label>
                                                        <input type="text" name="lastName" value={patient.lastName} className={errors.lastName ? 'form-control error-box' : 'form-control'} placeholder="Last Name" onChange={(e) => this.handleChange(e)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="">Date of birth</label>
                                                        <div className='react-date-picker'>
                                                            <DatePicker
                                                                calendarClassName="dob-calender"
                                                                placeholderText='Date of birth'
                                                                dateFormat="dd-MM-yyyy"
                                                                className={errors.dob ? 'form-control error-box dob-main' : 'form-control dob-main'}
                                                                renderCustomHeader={({
                                                                    date,
                                                                    changeYear,
                                                                    changeMonth,
                                                                    decreaseMonth,
                                                                    increaseMonth,
                                                                    prevMonthButtonDisabled,
                                                                    nextMonthButtonDisabled,
                                                                }) => (
                                                                    <div className='calender-popup-box' >
                                                                        <button className='left-date-slider' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                                            {"<"}
                                                                        </button>
                                                                        <select
                                                                            className='year-selecter'
                                                                            value={getYear(date)}
                                                                            onChange={({ target: { value } }) => changeYear(value)}
                                                                        >
                                                                            {this.state.years.map((option) => (
                                                                                <option key={option} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </select>

                                                                        <select
                                                                            className='month-selecter'
                                                                            value={this.state.months[getMonth(date)]}
                                                                            onChange={({ target: { value } }) =>
                                                                                changeMonth(this.state.months.indexOf(value))
                                                                            }
                                                                        >
                                                                            {this.state.months.map((option) => (
                                                                                <option key={option} value={option}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </select>

                                                                        <button className='right-date-slider' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                                            {">"}
                                                                        </button>


                                                                    </div>
                                                                )}
                                                                selected={patient.dob}
                                                                onChange={(date) => this.handleChange(date, 3)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="">Sex</label>
                                                        <select className={errors.gender ? 'form-control error-box' : 'form-control'}
                                                            name="gender"
                                                            value={patient.gender}
                                                            onChange={(e) => this.handleChange(e)}
                                                        >
                                                            <option value=""></option>
                                                            <option value="1">Male</option>
                                                            <option value="2">Female</option>
                                                            <option value="3">Decline to specify</option>
                                                        </select>

                                                    </div>
                                                    <div className="form-group">
                                                            <label htmlFor="">Have you been here before?</label>
                                                            <div className="notification-btn-section">
                                                                <button type="button" name="button" className={patient.hasPatient === 1 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('hasPatient', 1)} >Yes</button>
                                                                <button type="button" name="button" className={patient.hasPatient === 2 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('hasPatient', 2)} >No</button>
                                                            </div>
                                                        </div>
                                                </div>
                                                }
                                                {formSteps.step2 && <div>
                                                    <div className="form-group">
                                                        <label htmlFor="">Reason for visit</label>
                                                        <textarea name="visitReason" rows="4" cols="4" value={patient.visitReason} className={errors.visitReason ? 'form-control error-box' : 'form-control'} onChange={(e) => this.handleChange(e)}></textarea>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="">Visit type</label>
                                                        <Multiselect
                                                            className={errors.visitType ? 'form-control error-box' : 'form-control'}
                                                            options={this.state.visitOptions} // Options to display in the dropdown
                                                            selectedValues={patient.visitType} // Preselected value to persist in dropdown
                                                            showCheckbox={true}
                                                            closeOnSelect={false}
                                                            placeholder='Select visit type'
                                                            onSelect={this.onSelectVisitType} // Function will trigger on select event
                                                            onRemove={this.onRemoveVisitType} // Function will trigger on remove event
                                                            displayValue="name" // Property name to display in the dropdown options
                                                        />
                                                    </div>
                                                </div>
                                                }
                                                {formSteps.step3 &&
                                                    <div>
                                                        <div className="form-group">
                                                            <label htmlFor="">Have you been in contact with someone who is diagnosed with coronavirus in the last 14 days?</label>
                                                            <div className="actionbtn-holder">
                                                                <button type="button" name="button" className={patient.coronavirusContact === 1 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('coronavirusContact', 1)} >Yes</button>
                                                                <button type="button" name="button" className={patient.coronavirusContact === 2 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('coronavirusContact', 2)} >No</button>
                                                                <button type="button" name="button" className={patient.coronavirusContact === 3 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('coronavirusContact', 3)} >Not Sure</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {formSteps.step4 &&
                                                    <div>
                                                        <div className="form-group">
                                                            <label htmlFor="">What parking spot number are you in?</label>
                                                            <div className="notification-btn-section">
                                                            <input type="number" 
                                                             onKeyPress={(event) => {
                                                                if (!/[0-9]/.test(event.key)) {
                                                                  event.preventDefault();
                                                                }
                                                              }}
                                                             name="parkingSpot" value={patient.parkingSpot} className='form-control' placeholder="parking Spot number" onChange={(e) => this.handleChange(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="">Opt to receive text notifications?</label>
                                                            <div className="notification-btn-section">
                                                                <button type="button" name="button" className={patient.isTextNotification === 1 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('isTextNotification', 1)} >Yes</button>
                                                                <button type="button" name="button" className={patient.isTextNotification === 2 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('isTextNotification', 2)} >No</button>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="email" name="email" value={patient.email} className={errors.email ? 'form-control error-box' : 'form-control'} placeholder="Email Address" onChange={(e) => this.handleChange(e)} />
                                                        </div>
                                                    </div>
                                                }
                                                <div className="actionbtn-holder">
                                                    <button type="button" name="button" className="btn prev col-md-3" onClick={(e) => this.handleSteps(e, false)} disabled={formSteps.step1}>Previous</button>
                                                    <button type="button" name="button" className="btn next col-md-3" onClick={(e) => this.handleSteps(e, true)} disabled={formSteps.step4}>Next</button>
                                                    <button type="button" name="button" className="btn submit col-md-3" onClick={(e) => this.handleSubmit(e)} disabled={!formSteps.step4 || registeringPatient || isEmptyField}>Submit</button>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {(!locationId || !patientId) && <div className="wrapper"><h1 className="no-clinic steps-wrapper patientinfo-wrapper">Contact to Site Admin....</h1></div>}
            </div>

        )
    }
}


function mapStateToProps(state) {
    const { registeringPatient, isPatientRegisterError, isPatientRegisterComplete,redirect_url } = state.users;
    return {registeringPatient, isPatientRegisterError, isPatientRegisterComplete,redirect_url};
}

const actionCreators = {
    patientRegister: userActions.patientRegister
};

export default connect(mapStateToProps, actionCreators)(PatientForm);