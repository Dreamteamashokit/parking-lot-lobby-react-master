import React from 'react';
import { connect } from 'react-redux';
import {errorToast, history} from '../_helpers';
import { userActions } from '../_actions';
class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationId: null,
            patientId:null,
            patient: {
                //point:0,
                comment:''
            },
            errors: {
                point:false,
                comment:false
            }
        }
    }
    componentDidMount() {
        try {
            if (this.props && this.props.match && this.props.match.params && this.props.match.params.locationId) {
                this.setState({ locationId: this.props.match.params.locationId },() => {
                    this.props.getBusinessDetail(`locationId=${this.props.match.params.locationId}`);
                });
            }
            if (this.props && this.props.match && this.props.match.params && this.props.match.params.patientId) {
                this.setState({ patientId: this.props.match.params.patientId });
            }
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }
    componentDidUpdate(prevProps, nextProps) {
        if (prevProps.hasOwnProperty('isAddReviewComplete') && (this.props.isAddReviewComplete == true)) {
            history.push('/thank-you');
        }
    }

    
    /* selectOption = (field, type) => {
        try {
            const { patient, errors } = this.state;
            patient[field] = type;
            errors[field] = false;
            this.setState({ ...patient, ...errors });
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    } */
    async handleCommentChange(event) {
        try {
            let { value } = event.target;
            let {patient,errors} = this.state;
            errors.comment = false;
            patient.comment = value;
            this.setState({...patient,...errors})
        } catch (err) {
            let message = (err && err.message) ? err.message : 'Something went wrong';
            errorToast(message)
        }
    }

    handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const { patient, errors, locationId, patientId } = this.state;
            console.log('\n patient:', patient);
            /* if(!patient.point || patient.point == 0) {
                errors.point = true;
                this.setState({...errors});
                return;
            } */
            if(!patient.comment) {
                errors.comment = true;
                this.setState({...errors});
                return;
            }
            if(!patientId || !locationId) {
                return;
            }
            patient['locationId']=  locationId;
            patient['patientId']= patientId;
            this.props.addReview(patient);
        } catch (e) {
            let message = (e && e.message) ? e.message : 'Something went wrong';
            console.log('\n message:', message)
            errorToast(message)
        }
    }

    render() {
        const { patient, locationId, patientId,errors} = this.state;
        const {getBusinessLoader, businessDetail, addReviewLoader} = this.props;
        return (
            <div>
                {locationId && patientId &&
                    <div>
                        <div className="steps-wrapper patientinfo-wrapper">
                            <div className="inner-container">
                                <div className="contbx-holder">
                                    <div className="txbx-holder">
                                        <div className="form-holder">
                                            <h3>Review</h3>
                                            <form className="form" action="" method="post">
                                                <div>
                                                    {/* <div className="form-group">
                                                            <label htmlFor="">How Likely would you  recommend {!getBusinessLoader && businessDetail && businessDetail.businessInformation && <span>{businessDetail.businessInformation.companyName}</span>} to a friend ?</label>
                                                            <div className="notification-btn-section">
                                                                <button type="button" name="button" className={patient.point === 1 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 1)} >1</button>
                                                                <button type="button" name="button" className={patient.point === 2 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 2)} >2</button>
                                                                <button type="button" name="button" className={patient.point === 3 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 3)} >3</button>
                                                                <button type="button" name="button" className={patient.point === 4 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 4)} >4</button>
                                                                <button type="button" name="button" className={patient.point === 5 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 5)} >5</button>
                                                                <button type="button" name="button" className={patient.point === 6 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 6)} >6</button>
                                                                <button type="button" name="button" className={patient.point === 7 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 7)} >7</button>
                                                                <button type="button" name="button" className={patient.point === 8 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 8)} >8</button>
                                                                <button type="button" name="button" className={patient.point === 9 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 9)} >9</button>
                                                                <button type="button" name="button" className={patient.point === 10 ? 'select-op-btn btn' : 'unselect-op-btn btn'} onClick={(e) => this.selectOption('point', 10)} >10</button>
                                                            </div>
                                                            {errors && errors.point && <div className="error-box">Please Provide a review, out of scale from 1-10 . </div>}
                                                        </div> */}
                                                        <div className="form-group">
                                                            <label htmlFor="">write us a review. How we could have improved your experience?</label>
                                                            <textarea name="name" rows="6" cols="" value={patient.comment} className={errors.comment ? "form-control error-box" : "form-control"} onChange={(e)=>this.handleCommentChange(e)}></textarea>
                                                        </div>
                                                </div>
                                                <div className="actionbtn-holder">
                                                    <button type="button" name="button" className="btn submit col-md-3" onClick={(e) => this.handleSubmit(e)} disabled={addReviewLoader} >Submit</button>
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
    const {getBusinessLoader,businessDetail,isAddReviewComplete,addReviewLoader} = state.users;
    return {getBusinessLoader,businessDetail,isAddReviewComplete,addReviewLoader};
}

const actionCreators = {
    addReview:userActions.addReview,
    getBusinessDetail:userActions.getBusinessDetail
};

export default connect(mapStateToProps, actionCreators)(Review);