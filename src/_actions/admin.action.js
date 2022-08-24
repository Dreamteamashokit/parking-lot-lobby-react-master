import { adminConstants } from '../_constants';
import { adminService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import {successToast, errorToast} from '../_helpers';
export const adminActions = {
    login,
    logout,
    fetchClientList:fetchClientList,
    fetchJotformList:fetchJotformList,
    fetchDashboardCount:fetchDashboardCount,
    fetchLocationList:fetchLocationList,
    addTwilioNumber:addTwilioNumber,
    fetchJotformQuestions,
    addJotformQuestion,
    deleteJotformQuestion,
    addLocationJotform,
    clientRegister,
    addLocation,
    addJotform,
    resetLocation,
    updateClientStatus,
    allowLocationADD,
    smsFeatureAllowDisallow,
    fetchAnalyticData,
    resetAnalyticData,
    resetLocationData
};

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));
        adminService.login(email, password)
            .then(
                admin => { 
                    if(admin && admin.status) {
                        let message = admin.message ? admin.message : 'Login successful';
                        successToast(message);
                        dispatch(success(admin.data));
                        history.push('/admin/dashboard');
                    } else {
                        let message = admin.message ? admin.message : 'Something went wrong.';
                        dispatch(failure(message));
                        errorToast(message)
                    }
                    
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(admin) { return { type: adminConstants.ADMIN_LOGIN_REQUEST, admin } }
    function success(admin) { return { type: adminConstants.ADMIN_LOGIN_SUCCESS, admin } }
    function failure(error) { return { type: adminConstants.ADMIN_LOGIN_FAILURE, error } }
}

function logout() {
    adminService.logout();
    return { type: adminConstants.LOGOUT };
}

function fetchDashboardCount(){
    return dispatch => {
        dispatch(request())
        adminService.fetchDashboardCount('admin/dashboard')
        .then(response=>{
            if(response.status){
                dispatch(success(response))
            }
        })
        .catch(error=>{
            dispatch(failure(error))
        })
    }

    function request() { return { type: adminConstants.DASHBOARD_COUNT_REQUEST } }
    function success(data) { return { type: adminConstants.DASHBOARD_COUNT_SUCCESS, data } }
    function failure(error) { return { type: adminConstants.DASHBOARD_COUNT_FAILURE, error } }
}

function fetchClientList(){
    return dispatch => {
        dispatch(request())
        adminService.fetchClientList('admin/client-list?page=1&limit=10')
            .then(
                response => {
                    if(response.status){
                     dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    }
                },
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    }
function request() { return { type: adminConstants.CLIENT_LIST_REQUEST } }
function success(data) { return { type: adminConstants.CLIENT_LIST_SUCCESS, data } }
function failure(error) { return { type: adminConstants.CLIENT_LIST_FAILURE, error } }
}

function fetchJotformList(){
    return dispatch => {
        dispatch(request())
        adminService.fetchJotformList('admin/jotform-list?page=1&limit=10')
            .then(
                response => {
                    if(response.status){
                     dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    }
                },
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    }
function request() { return { type: adminConstants.JOTFORM_LIST_REQUEST } }
function success(data) { return { type: adminConstants.JOTFORM_LIST_SUCCESS, data } }
function failure(error) { return { type: adminConstants.JOTFORM_LIST_FAILURE, error } }
}

function fetchJotformQuestions(formId){
    return dispatch => {
        dispatch(request())
        adminService.fetchJotformQuestions(`jotform/form/${formId}/questions`)
            .then(
                response => {
                    if(response.status){
                     dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    }
                },
                error => {
                    console.log(error)
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    }
function request() { return { type: adminConstants.JOTFORM_QUESTIONS_REQUEST } }
function success(data) { return { type: adminConstants.JOTFORM_QUESTIONS_SUCCESS, data } }
function failure(error) { return { type: adminConstants.JOTFORM_QUESTIONS_FAILURE, error } }
}

function fetchLocationList(clientId){

    return dispatch => {
        dispatch(request())
        adminService.fetchLocationList(`admin/client-location?clientId=${clientId}&page=1&limit=10`)
            .then(
                response => {
                    if(response.status){
                     dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    }
                },
                error => {
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    }
function request() { return { type: adminConstants.LOCATION_LIST_REQUEST } }
function success(data) { return { type: adminConstants.LOCATION_LIST_SUCCESS, data } }
function failure(error) { return { type: adminConstants.LOCATION_LIST_FAILURE, error } }
}

function addTwilioNumber(payload){
    return dispatch => {
        dispatch(request())
        adminService.postAdmin(`admin/add-twilio-number`, payload)
        .then(response=>{
            if(response.status){
                successToast('twilio number added success');
                dispatch(success(response.data))
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
               }
               else
               {
                errorToast(response.message)
                dispatch(failure(response.message))
               }
        })

    }

    function request() { return { type: adminConstants.ADD_TWILIO_REQUEST } }
    function success() { return { type: adminConstants.ADD_TWILIO_SUCCESS } }
    function failure(error) { return { type: adminConstants.ADD_TWILIO_FAILURE, error } }
}
function addLocationJotform(payload){
    return dispatch => {
        dispatch(request())
        adminService.postAdmin(`admin/add-location-jotform`, payload)
        .then(response=>{
            if(response.status){
                successToast('jotform added success');
                dispatch(success(response.data))
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
               }
               else
               {
                errorToast(response.message)
                dispatch(failure(response.message))
               }
        })

    }

    function request() { return { type: adminConstants.ADD_LOCATION_JOTFORM_REQUEST } }
    function success() { return { type: adminConstants.ADD_LOCATION_JOTFORM_SUCCESS } }
    function failure(error) { return { type: adminConstants.ADD_LOCATION_JOTFORM_FAILURE, error } }
}
function clientRegister(user) {
    return dispatch => {
        dispatch(request(user));
        adminService.postAdmin(`admin/client-register`, user)
            .then(response => { 
                    if(response.status){
                        dispatch(success(response.data))
                        history.push('/admin/client-list');
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                }
            );
    };

    function request(client) { return { type: adminConstants.REGISTER_REQUEST, client } }
    function success(client) { return { type: adminConstants.REGISTER_SUCCESS, client } }
    function failure(error) { return { type: adminConstants.REGISTER_FAILURE, error } }
}
function addLocation(payload) {
    return dispatch => {
        dispatch(request(payload));
        adminService.postAdmin(`admin/add-client-location`, payload)
            .then(response => { 
                    if(response.status){
                        dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    errorToast(response.message);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                }
            );
    };

    function request(location) { return { type: adminConstants.LOCATION_ADD_REQUEST, location } }
    function success(location) { return { type: adminConstants.LOCATION_ADD_SUCCESS, location } }
    function failure(error) { return { type: adminConstants.LOCATION_ADD_FAILURE, error } }
}
function addJotform(payload) {
    return dispatch => {
        dispatch(request(payload));
        adminService.postAdmin(`admin/add-jotform`, payload)
            .then(response => { 
                    if(response.status){
                        dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    errorToast(response.message);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                }
            );
    };

    function request(jotform) { return { type: adminConstants.JOTFORM_ADD_REQUEST, jotform } }
    function success(jotform) { return { type: adminConstants.JOTFORM_ADD_SUCCESS, jotform } }
    function failure(error) { return { type: adminConstants.JOTFORM_ADD_FAILURE, error } }
}
function addJotformQuestion(formId, payload) {
    return dispatch => {
        dispatch(request(payload));
        adminService.postAdmin(`jotform/form/${formId}/questions`, payload)
            .then(response => { 
                    if(response.status){
                        dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    errorToast(response.message);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                }
            );
    };

    function request(jotform) { return { type: adminConstants.JOTFORM_QUESTION_ADD_REQUEST, jotform } }
    function success(jotform) { return { type: adminConstants.JOTFORM_QUESTION_ADD_SUCCESS, jotform } }
    function failure(error) { return { type: adminConstants.JOTFORM_QUESTION_ADD_FAILURE, error } }
}
function deleteJotformQuestion(formId, questionId) {
    return dispatch => {
        adminService.deleteJotformQuestion(`jotform/form/${formId}/question/${questionId}`)
            .then(response => { 
                    if(response.status){
                        dispatch(success(response.data))
                    }
                    else
                    {
                    dispatch(failure(response.message))
                    errorToast(response.message);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                }
            );
    };

    function request(jotform) { return { type: adminConstants.JOTFORM_QUESTION_DELETE_REQUEST, jotform } }
    function success(jotform) { return { type: adminConstants.JOTFORM_QUESTION_DELETE_SUCCESS, jotform } }
    function failure(error) { return { type: adminConstants.JOTFORM_QUESTION_DELETE_FAILURE, error } }
}
function resetLocation() {
    return dispatch => {
        dispatch(success());
    };

    function success() { return { type: adminConstants.LOCATION_ADD_RESET } }
}

function updateClientStatus(payload){
    return dispatch => {
        dispatch(request())
        adminService.putAdmin(`admin/update-client-status`, payload)
        .then(response=>{
            if(response.status){
                successToast('client status updated');
                dispatch(success(response.data.response || response.data))
               }
               else
               {
                errorToast(response.message)
                dispatch(failure(response.message))
               }
        })

    }

    function request() { return { type: adminConstants.UPDATE_CLIENT_STATUS_REQUEST } }
    function success(data) { return { type: adminConstants.UPDATE_CLIENT_STATUS_SUCCESS, data } }
    function failure(error) { return { type: adminConstants.UPDATE_CLIENT_STATUS_FAILURE, error } }
}
function allowLocationADD(payload){
    return dispatch => {
        dispatch(request())
        adminService.putAdmin(`admin/allow-location-add`, payload)
        .then(response=>{
            if(response.status){
                successToast('client location add updated');
                dispatch(success(response.data.response || response.data))
               }
               else
               {
                errorToast(response.message)
                dispatch(failure(response.message))
               }
        })

    }

    function request() { return { type: adminConstants.ALLOW_LOCATION_ADD_REQUEST } }
    function success(data) { return { type: adminConstants.ALLOW_LOCATION_ADD_SUCCESS, data } }
    function failure(error) { return { type: adminConstants.ALLOW_LOCATION_ADD_FAILURE, error } }
}
function smsFeatureAllowDisallow(payload){
    return dispatch => {
        dispatch(request())
        adminService.putAdmin(`admin/location-sms-feature`, payload)
        .then(response=>{
            if(response.status){
                successToast('location sms  updated');
                dispatch(success(response.data.response || response.data))
               }
               else
               {
                errorToast(response.message)
                dispatch(failure(response.message))
               }
        })

    }

    function request() { return { type: adminConstants.SMS_FEATURE_REQUEST } }
    function success(data) { return { type: adminConstants.SMS_FEATURE_SUCCESS, data } }
    function failure(error) { return { type: adminConstants.SMS_FEATURE_FAILURE, error } }
}

function fetchAnalyticData(endpoint){
    return dispatch => {
        dispatch(request())
        adminService.getAdmin(endpoint)
        .then(response=>{
            if(response.status){
                dispatch(success(response.data))
               }
               else
               {
                errorToast(response.message)
                dispatch(failure(response.message))
               }
        })

    }

    function request() { return { type: adminConstants.ANALYTIC_REQUEST } }
    function success(data) { return { type: adminConstants.ANALYTIC_SUCCESS, data } }
    function failure(error) { return { type: adminConstants.ANALYTIC_FAILURE, error } }
}
function resetAnalyticData () {
    return dispatch => {
        dispatch({ type: adminConstants.ANALYTIC_RESET })
    }
}
function resetLocationData () {
    return dispatch => {
        dispatch({ type: adminConstants.RESET_LOCATION })
    }
}


