import { userConstants } from '../_constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true,registerationCompleted:false, registerError:false };
    case userConstants.REGISTER_SUCCESS:
      return {registering:false, registerationCompleted:true, registerError:false};
    case userConstants.REGISTER_FAILURE:
      return {registering: false,registerationCompleted:false, registerError:true};
    default:
      return state
  }
}