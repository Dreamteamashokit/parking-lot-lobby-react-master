import {commonConstants} from '../_constants';
import {commonService, userService} from '../_services';
import { alertActions } from './';
import {successToast, errorToast} from '../_helpers';


export const commonActions = {
    fetchWaitingList:fetchWaitingList,
    fetchCheckInOutList:fetchCheckInOutList,
    fetchServedPatientList:fetchServedPatientList,
    waitingToCheckIn:waitingToCheckIn,
    checkInToCheckOut:checkInToCheckOut,
    getQuickResponse:getQuickResponse,
    fetchPatientChat:fetchPatientChat,
    addQuickResponse:addQuickResponse,
    updateQuickResponse:updateQuickResponse,
    addChatMessage:addChatMessage,
    notifyPatient:notifyPatient,
    overWaitingTimeForPatient:overWaitingTimeForPatient,
    removePatient:removePatient,
    removeQuickResponse:removeQuickResponse,
    countDownFinish:countDownFinish,
    updatePatientProfile:updatePatientProfile,
    unreadMessage:unreadMessage,
    noShowSet:noShowSet,
    updateDelayForPatient:updateDelayForPatient,
    updateNotesForPatient:updateNotesForPatient,
    createProfileAction:createProfileAction,
    addlocationAction,
    fetchlocations,
    updatePatientInfor,
    resetWaiting,
    updateCarLobby,
    fetchFormUploads,
    reviewDocument
}

function fetchWaitingList(isSearch=false, searchBy='') {
    return dispatch => {
        dispatch(request({}));
        commonService.fetchPatientList(1, isSearch, searchBy)
        .then(
            response => {
                //let message = response.message ? response.message : 'fetch data successful';
                //successToast(message)
                const data = (response.data) ? response.data : [];
                dispatch(success(data));

            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));

            }
        )

    }
    function request() { return {type: commonConstants.WAITING_PATIENT_LIST_REQUEST}}
    function success(response) { return {type:commonConstants.WAITING_PATIENT_LIST_SUCCESS, response}}
    function failure(error) {return {type:commonConstants.WAITING_PATIENT_LIST_FAILURE, error}}
}
function fetchCheckInOutList(isSearch=false, searchBy='') {
    return dispatch => {
        dispatch(request({}));
        commonService.fetchPatientList(2, isSearch, searchBy)
        .then(
            response => {
                const data = (response.data) ? response.data : [];
                dispatch(success(data));

            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));

            }
        )

    }
    function request() { return {type: commonConstants.CHECKINOUT_PATIENT_LIST_REQUEST}}
    function success(response) { return {type:commonConstants.CHECKINOUT_PATIENT_LIST_SUCCESS, response}}
    function failure(error) {return {type:commonConstants.CHECKINOUT_PATIENT_LIST_FAILURE, error}}
}
function fetchServedPatientList(isSearch=false, searchBy='') {
    return dispatch => {
        dispatch(request({}));
        commonService.fetchPatientList(3,isSearch, searchBy)
        .then(
            response => {
                const data = (response.data) ? response.data : [];
                dispatch(success(data));

            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));

            }
        )

    }
    function request() { return {type: commonConstants.SERVED_PATIENT_LIST_REQUEST}}
    function success(response) { return {type:commonConstants.SERVED_PATIENT_LIST_SUCCESS, response}}
    function failure(error) {return {type:commonConstants.SERVED_PATIENT_LIST_FAILURE, error}}
}
function waitingToCheckIn(patientId) {
    return dispatch => {
        dispatch(request({patientId}));
        commonService.waitingToCheckIn(patientId)
        .then(
            response => {
                let message = (response.message) ? response.message : 'Successfully Move To check In-Out.' 
                successToast(message);
                dispatch(success(patientId));

            },
            error => {
                dispatch(failure(patientId, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(patientId) { return {type: commonConstants.To_CHECKIN_REQUEST, patientId}}
    function success(patientId) { return {type:commonConstants.To_CHECKIN_SUCCESS, patientId}}
    function failure(patientId,error) {return {type:commonConstants.To_CHECKIN_FAILURE,patientId, error}}

}
function checkInToCheckOut(patientId) {
    return dispatch => {
        dispatch(request({patientId}));
        commonService.checkInToCheckOut(patientId)
        .then(
            response => {
                let message = (response.message) ? response.message : 'Successfully Move To check In-Out.' 
                successToast(message);
                dispatch(success(patientId));

            },
            error => {
                dispatch(failure(patientId, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(patientId) { return {type: commonConstants.To_SERVED_REQUEST, patientId}}
    function success(patientId) { return {type:commonConstants.To_SERVED_SUCCESS, patientId}}
    function failure(patientId,error) {return {type:commonConstants.To_SERVED_FAILURE,patientId, error}}
}

function getQuickResponse() {
    return dispatch => {
        dispatch(request({}));
        commonService.getQuickResponse()
        .then(
            response => {
                //let message = response.message ? response.message : 'fetch data successful';
                //successToast(message)
                const data = (response.data) ? response.data : [];
                dispatch(success(data));

            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));

            }
        )

    }
    function request() { return {type: commonConstants.GET_QUICK_REQUEST}}
    function success(response) { return {type:commonConstants.GET_QUICK_SUCCESS, response}}
    function failure(error) {return {type:commonConstants.GET_QUICK_FAILURE, error}}
}

function fetchPatientChat(patientId) {
    return dispatch => {
        dispatch(request({patientId}));
        commonService.fetchPatientChat(patientId)
        .then(
            response => {
                //let message = response.message ? response.message : 'fetch data successful';
                //successToast(message)
                const data = (response.data) ? response.data : [];
                dispatch(success(data));

            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));

            }
        )

    }
    function request() { return {type: commonConstants.GET_CHAT_REQUEST}}
    function success(response) { return {type:commonConstants.GET_CHAT_SUCCESS, response}}
    function failure(error) {return {type:commonConstants.GET_CHAT_FAILURE, error}}
}

function addQuickResponse(payload) {
    return dispatch => {
        try {
            dispatch(request({ payload}));
            commonService.addQuickResponse(payload)
            .then(
                response => {
                       let message = response.message ? response.message : 'Update Setting successfully';
                       successToast(message)
                        let responseObject = response.data ? response.data : {}
                        dispatch(success(responseObject));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                })
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong during update settings';
            errorToast(message)
            dispatch(failure(message));
            dispatch(alertActions.error(message));
        }
    };
    function request(payload) { return { type: commonConstants.CREATE_QUICK_REQUEST, payload } }
    function success(response) { return { type: commonConstants.CREATE_QUICK_SUCCESS, response } }
    function failure(error) { return { type: commonConstants.CREATE_QUICK_FAILURE, error } }
}
function updateQuickResponse(payload, index) {
    return dispatch => {
        try {
            dispatch(request({ payload}));
            commonService.updateQuickResponse(payload)
            .then(
                response => {
                       let message = response.message ? response.message : 'Update Setting successfully';
                        successToast(message)
                        let responseObject = response.data ? response.data : {}
                        dispatch(success(responseObject, index));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }

            )
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong during update settings';
            errorToast(message)
            dispatch(failure(message));
            dispatch(alertActions.error(message));
        }
    };
    function request(payload) { return { type: commonConstants.UPDATE_QUICK_REQUEST, payload } }
    function success(response, index) { return { type: commonConstants.UPDATE_QUICK_SUCCESS, response, index } }
    function failure(error) { return { type: commonConstants.UPDATE_QUICK_FAILURE, error } }
}
function removeQuickResponse(payload) {
    return dispatch => {
        try {
            dispatch(request({ payload}));
            commonService.removeQuickResponse(payload)
            .then(
                response => {
                       let message = response.message ? response.message : 'Update Setting successfully';
                        successToast(message)
                        dispatch(success(payload));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }

            )
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong during update settings';
            errorToast(message)
            dispatch(failure(message));
            dispatch(alertActions.error(message));
        }
    };
    function request(payload) { return { type: commonConstants.REMOVE_QUICK_REQUEST, payload } }
    function success(payload) { return { type: commonConstants.REMOVE_QUICK_SUCCESS, payload } }
    function failure(error) { return { type: commonConstants.REMOVE_QUICK_FAILURE, error } }
}
function addChatMessage(payload) {
    return dispatch => {
        try {
            dispatch(request({ payload}));
            commonService.addChatMessage(payload)
            .then(
                response => {
                       let message = response.message ? response.message : 'Update Setting successfully';
                       successToast(message)
                        let responseObject = response.data ? response.data : {}
                        dispatch(success(responseObject));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                })
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong during update settings';
            errorToast(message)
            dispatch(failure(message));
            dispatch(alertActions.error(message));
        }
    };
    function request(payload) { return { type: commonConstants.CREATE_CHAT_REQUEST, payload } }
    function success(response) { return { type: commonConstants.CREATE_CHAT_SUCCESS, response } }
    function failure(error) { return { type: commonConstants.CREATE_CHAT_FAILURE, error } }
}
function notifyPatient(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.notifyPatient(payload)
        .then(
            response => {
                let message = (response.message) ? response.message : 'Successfully Notify to patient.' 
                successToast(message);
                dispatch(success(response.data));
            },
            error => {
                dispatch(failure(payload, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(payload) { return {type: commonConstants.NOTIFY_REQUEST, payload}}
    function success(response) { return {type:commonConstants.NOTIFY_SUCCESS, response}}
    function failure(payload,error) {return {type:commonConstants.NOTIFY_FAILURE,payload, error}}

}

function removePatient(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.removePatient(payload)
        .then(
            response => {
                let message = (response.message) ? response.message : 'Successfully Notify to patient.' 
                successToast(message);
                dispatch(success(response.data, payload));
            },
            error => {
                dispatch(failure(payload, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(payload) { return {type: commonConstants.REMOVE_PATIENT_REQUEST, payload}}
    function success(response, payload) { return {type:commonConstants.REMOVE_PATIENT_SUCCESS, response, payload}}
    function failure(payload,error) {return {type:commonConstants.REMOVE_PATIENT_FAILURE,payload, error}}

}

function overWaitingTimeForPatient (data) {
	return dispatch => {
        dispatch({
            type: commonConstants.OVER_WAITING,
            index: data.index,
            overFlow:data.overFlow
        }) 
    }
    
}
function countDownFinish (data) {
	return dispatch => {
        dispatch({
            type: commonConstants.COUNTDOWN_FINISH,
            index: data.index,
            countDownFinish:data.countDownFinish
        }) 
    }
    
}

function updatePatientProfile(payload) {
    return dispatch => {
        dispatch(request(payload));
        userService.updatePatientProfile(payload)
        .then(
            response => {
                const data = (response.data) ? response.data : [];
                dispatch(success(data, payload));
            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));

            }
        )

    }
    function request() { return {type: commonConstants.UPDATE_PATIENT_REQUEST}}
    function success(response, payload) { return {type:commonConstants.UPDATE_PATIENT_SUCCESS, response, payload}}
    function failure(error) {return {type:commonConstants.UPDATE_PATIENT_FAILURE, error}}
}

function unreadMessage(patientId) {
    return dispatch => {
        dispatch({
            type: commonConstants.UN_READ_MESSAGE,
            patientId:patientId
        }) 
    }
}
function noShowSet(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.noShowSet(payload)
        .then(
            response => {
                let message = (response.message) ? response.message : 'update no-show for patient.' 
                successToast(message);
                dispatch(success(response.data));
            },
            error => {
                dispatch(failure(payload, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(payload) { return {type: commonConstants.NO_SHOW_REQUEST, payload}}
    function success(response, payload) { return {type:commonConstants.NO_SHOW_SUCCESS, response, payload}}
    function failure(payload,error) {return {type:commonConstants.NO_SHOW_FAILURE,payload, error}}
}
function updateDelayForPatient(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.updateDelayForPatient(payload)
        .then(
            response => {
                let message = (response.message) ? response.message : 'update deplay for patient.' 
                successToast(message);
                dispatch(success(response.data));
            },
            error => {
                dispatch(failure(payload, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(payload) { return {type: commonConstants.DELAY_REQUEST, payload}}
    function success(response, payload) { return {type:commonConstants.DELAY_SUCCESS, response, payload}}
    function failure(payload,error) {return {type:commonConstants.DELAY_FAILURE,payload, error}}
}
function updateNotesForPatient(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.updateNotesForPatient(payload)
        .then(
            response => {
                let message = (response.message) ? response.message : 'update note for patient.' 
                successToast(message);
                dispatch(success(response.data));
            },
            error => {
                dispatch(failure(payload, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(payload) { return {type: commonConstants.NOTES_REQUEST, payload}}
    function success(response, payload) { return {type:commonConstants.NOTES_SUCCESS, response, payload}}
    function failure(payload,error) {return {type:commonConstants.NOTES_FAILURE,payload, error}}

}

function createProfileAction(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.createProfileAction(payload)
        .then(
            response => {
                let message = (response.message) ? response.message : 'created profile successfully.' 
                successToast(message);
                dispatch(success(response.data));
            },
            error => {
                dispatch(failure(payload, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(payload) { return {type: commonConstants.ADD_CLIENT_REQUEST, payload}}
    function success(response, payload) { return {type:commonConstants.ADD_CLIENT_SUCCESS, response, payload}}
    function failure(payload,error) {return {type:commonConstants.ADD_CLIENT_FAILURE,payload, error}}

}
function addlocationAction(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.addlocationAction(payload)
        .then(
            response => {
                let message = (response.message) ? response.message : 'add location successfully' 
                successToast(message);
                dispatch(success(response.data));
            },
            error => {
                dispatch(failure(payload, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(payload) { return {type: commonConstants.ADD_LOCATION_REQUEST, payload}}
    function success(response, payload) { return {type:commonConstants.ADD_LOCATION_SUCCESS, response, payload}}
    function failure(payload,error) {return {type:commonConstants.ADD_LOCATION_FAILURE,payload, error}}
}
function fetchlocations() {
    return dispatch => {
        dispatch(request({}));
        commonService.fetchlocations()
        .then(
            response => {
                const data = (response.data) ? response.data : [];
                dispatch(success(data));
            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request() { return {type: commonConstants.FETCH_LOCATION_REQUEST}}
    function success(response) { return {type:commonConstants.FETCH_LOCATION_SUCCESS, response}}
    function failure(error) {return {type:commonConstants.FETCH_LOCATION_FAILURE, error}}
}
function updatePatientInfor(payload) {
    return dispatch => {
        dispatch(request(payload));
        commonService.updatePatientInfor(payload)
        .then(
            response => {
                const data = (response.data) ? response.data : [];
                dispatch(success(data));
            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request() { return {type: commonConstants.UPDATE_PATIENT_REQUEST}}
    function success(response) { return {type:commonConstants.UPDATE_PATIENT_SUCCESS, response}}
    function failure(error) {return {type:commonConstants.UPDATE_PATIENT_FAILURE, error}}
}

function resetWaiting(recordId,type) {
    return dispatch => {
        dispatch(request(recordId));
        commonService.resetWaiting({recordId:recordId})
        .then(
            response => {
                let message = (response.message) ? response.message : 'Successfully Move To check In-Out.' 
                successToast(message);
                dispatch(success(recordId,type));
            },
            error => {
                dispatch(failure(recordId, error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function request(recordId) { return {type: commonConstants.To_WAITINGBACK_REQUEST, recordId}}
    function success(recordId,listType) { return {type:commonConstants.To_WAITINGBACK_SUCCESS, recordId,listType}}
    function failure(recordId,error) {return {type:commonConstants.To_WAITINGBACK_FAILURE,recordId,error}}
}
function updateCarLobby(payload) {
    return dispatch => {
        commonService.updateCarLobby(payload)
        .then(
            response => {
               let message = response.message ? response.message : 'fetch data successful';
               successToast(message)
            },
            error => {
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
}

function fetchFormUploads(submissionID) {
    return dispatch => {
        dispatch(request(submissionID));
        commonService.fetchFormUploads(submissionID)
        .then(
            response => {
                if(response.status)
                     dispatch(success(response.data))
                    else
                    dispatch(failure(response.message))
            },
            error => {
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }

    function request(submissionID) { return { type: commonConstants.SUBMISSION_UPLOAD_REQUEST } }
    function success(list) { return { type: commonConstants.SUBMISSION_UPLOAD_SUCCESS, imagesList:list } }
    function failure(error) { return { type: commonConstants.SUBMISSION_UPLOAD_FAILURE, error } }
}

function reviewDocument(payload) {
    return dispatch => {
        commonService.reviewDocument(payload)
        .then(
            response => {
               let message = response.message ? response.message : 'fetch data successful';
               dispatch(success(payload.id));
               successToast(message)
            },
            error => {
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));
            }
        )

    }
    function success(patientId) { return {type:commonConstants.REVIEW_SUCCESS, patientId}}
}


