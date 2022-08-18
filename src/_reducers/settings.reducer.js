import { userConstants } from '../_constants';

export function settings(state = {settingFetching: false, settingData:{}}, action) {
  switch (action.type) {
    case userConstants.GET_SETTING_REQUEST:
        return {...state,settingFetching: true };
    case userConstants.GET_SETTING_SUCCESS:
       return {...state,settingFetching: false, settingData:action.response};
    case userConstants.GET_SETTING_FAILURE:
        return {...state,settingFetching: false};
    case userConstants.UPDATE_SETTING_REQUEST:
      return {...state, settingUpdating: true };
    case userConstants.UPDATE_SETTING_SUCCESS:
      return {...state,settingUpdating: false, settingData:action.response};
    case userConstants.UPDATE_SETTING_FAILURE:
      return {...state,settingUpdating: false};
    default:

      return state
  }
}