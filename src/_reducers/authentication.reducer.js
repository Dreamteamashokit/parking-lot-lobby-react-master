import { userConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {loggedIn: false};
    case userConstants.LOGOUT:
      return {loggedIn: false};
    case userConstants.UPDATE_OPEN_MODEL:{
      console.log('\n\n\n action.openLocationModel:::', action.openLocationModel)
      return {...state, openLocationModel: action.openLocationModel}
    }
    case userConstants.UPDATE_ISOPEN_REQUEST:
      return {...state, isOpenRequest: true };
    case userConstants.UPDATE_ISOPEN_SUCCESS:
      console.log('\n action....', action)
      return {...state,isOpenRequest:false, user: {...state.user , locationIsOpen: action.response.isOpen}};
    case userConstants.UPDATE_ISOPEN_FAILURE:
      return {...state,isOpenRequest: false};

    default:
      return state
  }
}

export function forgot(state = {}, action) {
  switch (action.type) {
    case userConstants.FORGOT_REQUEST:
      return { emailSending: true };
    case userConstants.FORGOT_SUCCESS:
      return {};
    case userConstants.FORGOT_FAILURE:
      return {emailSending: false};
    default:
      return state
  }
}
export function resetPassword(state = {}, action) {
  switch (action.type) {
    case userConstants.RESET_PASSWORD_REQUEST:
      return { resetingPassword: true };
    case userConstants.RESET_PASSWORD_SUCCESS:
      return {};
    case userConstants.RESET_PASSWORD_FAILURE:
      return {resetingPassword: false};
    default:
      return state
  }
}