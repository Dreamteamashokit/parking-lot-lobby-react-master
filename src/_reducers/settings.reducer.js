import { userConstants } from '../_constants';
import { updatelocationOpen } from '../_helpers';

export function settings(state = {settingFetching: false, settingData:{}}, action) {
  switch (action.type) {
    case userConstants.GET_SETTING_REQUEST:
        return {...state,settingFetching: true };
    case userConstants.GET_SETTING_SUCCESS:
      updatelocationOpen(action.response.scheduleInformation?.isOpen, true)
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

export function plan(state = {plan:{ plan: 0, amount: 0}, cards: []}, action) {
  switch (action.type) {
    // case userConstants.MY_PLAN_REQUEST:
    //   return {fetchingVisitorList:true}
    case userConstants.MY_PLAN_SUCCESS:
        return { ...state, plan: action.response }
    // case userConstants.MY_PLAN_FAILURE:
    //     return {fetchingVisitorList:false, visitoListError:true}
    case userConstants.GET_CARDS_SUCCESS:
      console.log('car', action.response);
      return { ...state, cards: action.response }
    default:

      return state
  }
}