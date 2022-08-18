import { adminConstants } from '../_constants';
let admin = JSON.parse(localStorage.getItem('admin'));
const initialState = admin ? { loggedIn: true, admin } : {};
export function adminAuthentication(state = initialState, action) {
  switch (action.type) {
    case adminConstants.ADMIN_LOGIN_REQUEST:
      return {
        loading: true
      };
    case adminConstants.ADMIN_LOGIN_SUCCESS:
      return {
        items: action.admin
      };
    case adminConstants.ADMIN_LOGIN_FAILURE:
        return {
          items: action.admin
    };
    default:
      return state
  }
}

export function adminClientlist(state = {fetchingClientList:false,clientList:[], registering:false, registerError:false, updateStatus:false}, action){
    switch(action.type){
        case adminConstants.CLIENT_LIST_REQUEST:
            return {...state, fetchingClientList:true}
        case adminConstants.CLIENT_LIST_SUCCESS:
            return {...state, fetchingClientList:false, clientList: action.data.providers}
        case adminConstants.CLIENT_LIST_FAILURE:
            return {...state, fetchingClientList:false, clientClientError:true}
        
        case adminConstants.REGISTER_REQUEST:
            return {...state, registering:true, registerError:false}
        case adminConstants.REGISTER_SUCCESS:
            return {...state, registering:false, registerError:false}
        case adminConstants.REGISTER_FAILURE:
            return {...state, registering:false, registerError:true}

        case adminConstants.UPDATE_CLIENT_STATUS_REQUEST:
          return {...state, updateStatus:true}
        case adminConstants.UPDATE_CLIENT_STATUS_SUCCESS:
          return {...state, 
            updateStatus:false,
            clientList: state.clientList.map(user => {
              if (user._id === action.data._id) {
                return { ...user, status: action.data.status };
              }
              return user;
            })
          }
        case adminConstants.UPDATE_CLIENT_STATUS_FAILURE:
          return {...state, updateStatus:false}

        case adminConstants.ALLOW_LOCATION_ADD_REQUEST:
            return {...state, updateStatus:true}
        case adminConstants.ALLOW_LOCATION_ADD_SUCCESS:
            return {...state, 
              updateStatus:false,
              clientList: state.clientList.map(user => {
                if (user._id === action.data._id) {
                  return { ...user, allowLocationAdd: action.data.allowLocationAdd };
                }
                return user;
              })
            }
        case adminConstants.ALLOW_LOCATION_ADD_FAILURE:
            return {...state, updateStatus:false}
        default : return state
    }
}

export function fetchDashboardCount(state = {fetchingDashboardCount:false, dashboardCount:{totalProvider:0,totalLocations:0}}, action){
  switch(action.type){
      case adminConstants.DASHBOARD_COUNT_REQUEST:
          return {...state, fetchingDashboardCount:true}
      case adminConstants.DASHBOARD_COUNT_SUCCESS:
          return {...state, fetchingDashboardCount:false, dashboardCount: action.data.data}
      case adminConstants.DASHBOARD_COUNT_FAILURE:
          return {...state, fetchingDashboardCount:false, DashboardCountError:true}
      default : return state
  }
}

export function fetchLocationList(state={fetchingLocationList:false, locationList:[], isLocationRegistering:false, locationRegisterError:false, locationRegistered:false, updateSmsLoader:false, locationAnalyticData:[],analyticLoader:false }, action){
  switch(action.type){
    case adminConstants.LOCATION_LIST_REQUEST:
          return {...state, fetchingLocationList:true}
      case adminConstants.LOCATION_LIST_SUCCESS:
          return {...state, fetchingLocationList:false, locationList: action.data.providers}
      case adminConstants.LOCATION_LIST_FAILURE:
          return {...state, fetchingLocationList:false, LocationListError:true}

      case adminConstants.LOCATION_ADD_REQUEST:
            return {...state, isLocationRegistering:true, locationRegisterError:false}
      case adminConstants.LOCATION_ADD_SUCCESS:
            return {...state, isLocationRegistering:false, locationRegisterError:false, locationRegistered:true}
      case adminConstants.LOCATION_ADD_FAILURE:
            return {...state, isLocationRegistering:false, locationRegisterError:true}
      case adminConstants.LOCATION_ADD_RESET:
            return {...state, isLocationRegistering:false, locationRegisterError:false, locationRegistered:false}
      

      case adminConstants.SMS_FEATURE_REQUEST:
            return {...state, updateSmsLoader:true}
      case adminConstants.SMS_FEATURE_SUCCESS:
            return {...state, 
              updateSmsLoader:false,
              locationList: state.locationList.map(location => {
                if (location._id === action.data._id) {
                  return { ...location, allowSmsFeature: action.data.allowSmsFeature };
                }
                return location;
              })
            }
      case adminConstants.SMS_FEATURE_FAILURE:
            return {...state, updateSmsLoader:false}

      
      case adminConstants.ANALYTIC_REQUEST:
            return {...state, analyticLoader:true}
      case adminConstants.ANALYTIC_SUCCESS:
            return {...state, 
              analyticLoader:false,
              locationAnalyticData: action.data
            }
      case adminConstants.ANALYTIC_FAILURE:
            return {...state, analyticLoader:false}

      case adminConstants.resetAnalyticData:
        return {...state, analyticLoader:false, locationAnalyticData:[]}
        
      case adminConstants.RESET_LOCATION:
        return {...state, fetchingLocationList:false, locationList:[]}

      default : return state
  }
}

export function addTwilioNumber(state={}, action){
  switch(action.type){
    case adminConstants.ADD_TWILIO_REQUEST:
      return{...state, addingTwilioNumber:true}
    case adminConstants.ADD_TWILIO_SUCCESS:
        return {...state, addingTwilioNumber:false}
    case adminConstants.ADD_TWILIO_FAILURE:
        return {...state, addingTwilioNumber:false}
    default : return state
  }
}