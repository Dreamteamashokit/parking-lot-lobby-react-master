import React from 'react';
import { connect } from 'react-redux';
import { errorToast} from '../_helpers';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { userService } from '../_services';
class AddAnotherPatientForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationId: null,
            patient: {
                fullNumber:'',
            },
            errors: {
                fullNumber:false
            }            
        }
    }
    componentDidMount() {
        try {
            if (this.props && this.props.match && this.props.match.params && this.props.match.params.locationId) {
                this.setState({ locationId: this.props.match.params.locationId });
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
            if (type === 2) {
                errors["fullNumber"] = false;
                if (!event) {
                    errors["fullNumber"] = true;
                }
                patient["fullNumber"] = event;
            } 
            this.setState({ ...patient, ...errors });
        } catch (err) {
            console.log('\n err  in handleChange:', err.message || err);
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message);
        }

    }

    handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const { patient, locationId,errors } = this.state;
            if (!locationId) {
                return;
            }
            if(errors.fullNumber) {
                return;
            }
            if(!patient.fullNumber || patient.fullNumber == '') {
                errors.fullNumber = true;
                this.setState({...errors});
                return;
            }
            patient['locationId'] = locationId;
            const response = await userService.checkAndSaveNumber(patient);
            if(response && response.url) {
                window.open(response.url)
            }
            console.log("\n response:", response) ;
        } catch (e) {
            console.log('\n error in handleSubmit:', e.message || e);
            let message = (e && e.message) ? e.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }
    render() {
        const { patient, locationId, errors } = this.state;
        const {registeringPatient} = this.props;
        return (
            <div>
                {locationId && 
                    <div>
                        <div className="steps-wrapper patientinfo-wrapper">
                            <div className="inner-container">
                                <div className="contbx-holder">
                                    <div className="txbx-holder">
                                        <h1> Please provide new  number for another patient <span>Start journey with us.</span> </h1>
                                        <div className="form-holder">
                                            <form className="form" action="" method="post">
                                                <div>
                                                    <div className="form-group">
                                                    <label htmlFor="contact">Contact Number</label>
                                                        <PhoneInput
                                                            name="fullNumber"
                                                            className={errors.fullNumber ? 'form-control error-box' : 'form-control'}
                                                            international
                                                            defaultCountry="US"
                                                            value={patient.fullNumber}
                                                            onChange={value => this.handleChange(value, 2)} />
                                                    </div>
                                                </div>
                                                <div className="actionbtn-holder">
                                                    <button type="button" name="button" className="btn submit col-md-3" onClick={(e) => this.handleSubmit(e)} disabled={registeringPatient}>Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {(!locationId) && <div className="wrapper"><h1 className="no-clinic steps-wrapper patientinfo-wrapper">Contact to Site Admin....</h1></div>}
            </div>

        )
    }
}


function mapStateToProps() {
    return {};
}

const actionCreators = {};

export default connect(mapStateToProps, actionCreators)(AddAnotherPatientForm);