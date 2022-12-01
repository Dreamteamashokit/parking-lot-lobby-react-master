import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import {successToast, errorToast, updatelocationOpen} from '../_helpers';
export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete,
    forgot:forgot,
    resetPassword:resetPassword,
    updateSettings:updateSettings,
    updateCard,
    removeCard,
    getPlan,
    fetchCards,
    payMembership,
    getSettings:getSettings,
    fetchNotifications:fetchNotifications,
    markNotifications:markNotifications,
    markAllNotifications:markAllNotifications,
    patientRegister:patientRegister,
    fetchVisitorReviews,
    fetchVisitorList,
    updateIsOpenSetting,
    OpenLocationModelAction,
    closeLocationModelAction,
    addReview,
    getBusinessDetail,
    anotherPatientRegister
};

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));
        userService.login(email, password)
            .then(
                user => { 
                    if(user && user.status) {
                        let message = user.message ? user.message : 'Login successful';
                        successToast(message);
                        dispatch(success(user.data));
                        history.push('/');
                    } else {
                        let message = user.message ? user.message : 'Something went wrong.';
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

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));
        userService.register(user)
            .then(user => { 
                    let message = user.message ? user.message : 'Registration successful';
                    let userData = user.data ? user.data : user
                    successToast(message)
                    dispatch(success(userData));
                    history.push('/login');
                    dispatch(alertActions.success(message));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}
function forgot(email) {
    return dispatch => {
        dispatch(request({ email }));
        userService.forgot(email)
            .then(
                user => { 
                    let message = user.message ? user.message : 'Forgot email send successfully';
                    successToast(message)
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.FORGOT_REQUEST, user } }
    function success(user) { return { type: userConstants.FORGOT_SUCCESS, user } }
    function failure(error) { return { type: userConstants.FORGOT_FAILURE, error } }
}

function resetPassword(passwordObject) {
    return dispatch => {
        dispatch(request({ passwordObject }));
        userService.resetPassword(passwordObject)
            .then(
                response => { 
                    let message = response.message ? response.message : 'Password Reset successfully';
                    successToast(message)
                    dispatch(success(response));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(passwordObject) { return { type: userConstants.RESET_PASSWORD_REQUEST, passwordObject } }
    function success(response) { return { type: userConstants.RESET_PASSWORD_SUCCESS, response } }
    function failure(error) { return { type: userConstants.RESET_PASSWORD_FAILURE, error } }
}

function updateSettings(endPoint, payload) {
    return dispatch => {
        try {
            dispatch(request({ payload}));
            userService.updateSettings(endPoint, payload)
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
                }

            )
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong during update settings';
            errorToast(message)
            dispatch(failure(message));
            dispatch(alertActions.error(message));
        }
    };
    function request(payload) { return { type: userConstants.UPDATE_SETTING_REQUEST, payload } }
    function success(response) { return { type: userConstants.UPDATE_SETTING_SUCCESS, response } }
    function failure(error) { return { type: userConstants.UPDATE_SETTING_FAILURE, error } }
}
function updateCard(payload) {
    return dispatch => {
        try {
            dispatch(request({ payload }));
            userService.updateCard(payload)
                .then(
                    response => {
                        dispatch(fetchCards());
                        let message = response.message ? response.message : 'Update card successfully';
                        successToast(message)
                        let responseObject = response.data ? response.data : {}
                        dispatch(success(responseObject));
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
    function request(payload) { return { type: userConstants.UPDATE_CARD_REQUEST, payload } }
    function success(response) { return { type: userConstants.UPDATE_CARD_SUCCESS, response } }
    function failure(error) { return { type: userConstants.UPDATE_CARD_FAILURE, error } }
}
function removeCard(source) {
    return dispatch => {
        try {
            userService.removeCard(source)
                .then(
                    response => {
                        dispatch(fetchCards());
                        let message = response.message ? response.message : 'remove card successfully';
                        successToast(message)
                    },
                    error => {
                        errorToast(error.toString())
                        dispatch(alertActions.error(error.toString()));
                    }

                )
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong during update settings';
            errorToast(message)
            dispatch(alertActions.error(message));
        }
    };
}
function payMembership(payload) {
    return dispatch => {
        try {
            userService.payMembership(payload)
                .then(
                    response => {
                        dispatch(getPlan());
                        let message = response.message ? response.message : 'Paid successfully';
                        successToast(message)
                        let responseObject = response.data ? response.data : {}
                        dispatch(success(responseObject));
                    },
                    error => {
                        errorToast(error.toString())
                        dispatch(alertActions.error(error.toString()));
                    }
                )
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong';
            errorToast(message)
            dispatch(alertActions.error(message));
        }
    };
    function success(response) { return { type: userConstants.UPDATE_CARD_SUCCESS, response } }
}
function getPlan() {
    return dispatch => {
        try {
            dispatch(request({}));
            userService.getPlan()
            .then(
                response => {
                    let responseObject = response.data ? response.data : {}
                    dispatch(success(responseObject));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }

            )
        } catch (error) {
            const message = error.message ? error.message.toString() : 'Something went wrong during get plan';
            errorToast(message)
            dispatch(failure(message));
            dispatch(alertActions.error(message));
        }
    };
    function request(payload) { return { type: userConstants.MY_PLAN_REQUEST, payload } }
    function success(response) { return { type: userConstants.MY_PLAN_SUCCESS, response } }
    function failure(error) { return { type: userConstants.MY_PLAN_FAILURE, error } }
}
function fetchCards() {
    return dispatch => {
        try {
            // dispatch(request({}));
            userService.fetchCards()
            .then(
                response => {
                    let responseObject = response.data ? response.data : {}
                    dispatch(success(responseObject));
                },
                error => {
                    const message = error.message ? error.message.toString() : 'Something went wrong during get plan';
            errorToast(message)
            dispatch(failure(message));
            dispatch(alertActions.error(message));
                }

            )
        } catch (error) {
            console.log(error)
            // const message = error.message ? error.message.toString() : 'Something went wrong during get plan';
            // errorToast(message)
            // dispatch(failure(message));
            // dispatch(alertActions.error(message));
        }
    };
    // function request(payload) { return { type: userConstants.MY_PLAN_REQUEST, payload } }
    function success(response) { return { type: userConstants.GET_CARDS_SUCCESS, response } }
    // function failure(error) { return { type: userConstants.MY_PLAN_FAILURE, error } }
}
function getSettings(endPoint) {
    return dispatch => {
        try {
            dispatch(request({}));
            userService.getSettings(endPoint)
            .then(
                response => {
                       //let message = response.message ? response.message : 'fetch Setting successfully';
                       //successToast(message)
                        let responseObject = response.data ? response.data : {}
                        dispatch(success(responseObject));
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
    function request(payload) { return { type: userConstants.GET_SETTING_REQUEST, payload } }
    function success(response) { return { type: userConstants.GET_SETTING_SUCCESS, response } }
    function failure(error) { return { type: userConstants.GET_SETTING_FAILURE, error } }

}

function fetchNotifications() {
    return dispatch => {
        dispatch(request({}));
        userService.fetchNotifications()
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
    function request() { return {type: userConstants.GET_NOTIFICATION_REQUEST}}
    function success(response) { return {type:userConstants.GET_NOTIFICATION_SUCCESS, response}}
    function failure(error) {return {type:userConstants.GET_NOTIFICATION_FAILURE, error}}
}

function markNotifications(patientId) {
    return dispatch => {
        dispatch(request({patientId}));
        userService.markNotifications({patientId:patientId})
        .then(
            response => {
                const data = (response.data) ? response.data : [];
                dispatch(success(data, patientId));
            },
            error => {
                dispatch(failure(error.toString()));
                errorToast(error.toString())
                dispatch(alertActions.error(error.toString()));

            }
        )

    }
    function request() { return {type: userConstants.UPDATE_NOTIFICATION_REQUEST}}
    function success(response, patientId) { return {type:userConstants.UPDATE_NOTIFICATION_SUCCESS, response, patientId}}
    function failure(error) {return {type:userConstants.UPDATE_NOTIFICATION_FAILURE, error}}
}

function markAllNotifications() {
    return dispatch => {
        dispatch(request());
        userService.markAllNotifications()
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
    function request() { return {type: userConstants.UPDATE_ALL_NOTIFICATION_REQUEST}}
    function success(response) { return {type:userConstants.UPDATE_ALL_NOTIFICATION_SUCCESS, response}}
    function failure(error) {return {type:userConstants.UPDATE_ALL_NOTIFICATION_FAILURE, error}}
}
function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}
function patientRegister(patient) {
    return dispatch => {
        dispatch(request(patient));
        userService.patientRegister(patient)
            .then(user => { 
                    let message = user.message ? user.message : 'Registration successful';
                    let userData = user.data ? user.data : user
                    successToast(message)
                    dispatch(success(userData));
                    //history.push('/login');
                    dispatch(alertActions.success(message));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(patient) { return { type: userConstants.PATIENT_REQUEST, patient } }
    function success(user) { return { type: userConstants.PATIENT_SUCCESS, user: user} }
    function failure(error) { return { type: userConstants.PATIENT_FAILURE, error } }
}
function fetchVisitorList(searchQuery) {
    return dispatch => {
        dispatch(request(searchQuery));
        userService.fetchData('user/visitor-list', searchQuery)
            .then(
                response => {
                    if(response.status)
                     dispatch(success(response.data))
                    else
                    dispatch(failure(response.message))
                },
                error => {
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    };
    function request(searchQuery) { return { type: userConstants.VISITOR_LIST_REQUEST } }
    function success(list) { return { type: userConstants.VISITOR_LIST_SUCCESS, list } }
    function failure(error) { return { type: userConstants.VISITOR_LIST_FAILURE, error } }
 
}
function fetchVisitorReviews(searchQuery) {
    return dispatch => {
        dispatch(request(searchQuery));
        userService.fetchData('user/visitor-reviews', searchQuery)
            .then(
                reviews => {
                    if(reviews.status)
                     dispatch(success(reviews.data))
                    else
                    dispatch(failure(reviews.message))
                },
                error => {
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    };
    function request() { return { type: userConstants.VISITOR_REVIEW_REQUEST } }
    function success(reviews) { return { type: userConstants.VISITOR_REVIEW_SUCCESS, reviews } }
    function failure(error) { return { type: userConstants.VISITOR_REVIEW_FAILURE, error } }
 
}

function updateIsOpenSetting(endPoint, payload) {
    return dispatch => {
        try {
            dispatch(request({payload}));
            userService.updateIsOpenSetting(endPoint, payload)
            .then(
                response => {
                       let message = response.message ? response.message : 'Update Setting successfully';
                       successToast(message);
                       updatelocationOpen(payload.isOpen);
                       let responseObject = response.data ? response.data : {}
                        dispatch(success(responseObject));
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
    function request(payload) { return { type: userConstants.UPDATE_ISOPEN_REQUEST, payload } }
    function success(response) { return { type: userConstants.UPDATE_ISOPEN_SUCCESS, response } }
    function failure(error) { return { type: userConstants.UPDATE_ISOPEN_FAILURE, error } }
}

function OpenLocationModelAction() {
    return dispatch => {
     dispatch({ type: userConstants.UPDATE_OPEN_MODEL, openLocationModel: true});
    }
}
function closeLocationModelAction() {
    return dispatch => {
     dispatch({ type: userConstants.UPDATE_OPEN_MODEL, openLocationModel: false});
    }
}
function getBusinessDetail(locationSearch) {
    return dispatch => {
        dispatch(request());
        userService.fetchData('user/get-businessDetail', locationSearch)
            .then(
                response => {
                    if(response && response.status) {
                        dispatch(success(response.data))
                    } else {
                        errorToast(response.message)
                        dispatch(failure(response.message))
                    }
                },
                error => {
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    };
    function request() { return { type: userConstants.FETCH_BUSINESS_DETAIL_REQUEST } }
    function success(data) { return { type: userConstants.FETCH_BUSINESS_DETAIL_SUCCESS, businessDetail:data } }
    function failure(error) { return { type: userConstants.FETCH_BUSINESS_DETAIL_FAILURE, error } }
 
}
function addReview(payload) {
    return dispatch => {
        dispatch(request());
        userService.addReviw(payload)
            .then(
                review => {
                    if(review && review.status) {
                        dispatch(success(review.data))
                    } else {
                        errorToast(review.message)
                        dispatch(failure(review.message))
                    }
                },
                error => {
                    dispatch(failure(error.toString()))
                    errorToast(error.toString())
                }
            );
    };
    function request() { return { type: userConstants.ADD_REVIEW_REQUEST} }
    function success(review) { return { type: userConstants.ADD_REVIEW_SUCCESS, review } }
    function failure(error) { return { type: userConstants.ADD_REVIEW_FAILURE, error } }
 
}

function anotherPatientRegister(patient) {
    return dispatch => {
        dispatch(request(patient));
        userService.anotherPatientRegister(patient)
            .then(user => { 
                    let message = user.message ? user.message : 'Registration successful';
                    let userData = user.data ? user.data : user
                    successToast(message)
                    dispatch(success(userData));
                    dispatch(alertActions.success(message));
                },
                error => {
                    dispatch(failure(error.toString()));
                    errorToast(error.toString())
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(patient) { return { type: userConstants.ANOTHER_PATIENT_REQUEST, patient } }
    function success(user) { return { type: userConstants.ANOTHER_PATIENT_SUCCESS, user: user} }
    function failure(error) { return { type: userConstants.ANOTHER_PATIENT_FAILURE, error } }
}


