import { userConstants } from '../_constants';

export function users(state = {notification:[]}, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, deleting: true }
            : user
        )
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...userCopy } = user;
            // return copy of user with 'deleteError:[error]' property
            return { ...userCopy, deleteError: action.error };
          }

          return user;
        })
      };
    case userConstants.GET_NOTIFICATION_SUCCESS:
      return {...state, 
        notification: action.response
      };
    case userConstants.UPDATE_NOTIFICATION_SUCCESS:
       return {...state,
        notification: state.notification.filter(function (e) {
          return e.patientId._id !== action.patientId;
        })
      };
    case userConstants.UPDATE_ALL_NOTIFICATION_SUCCESS:
        return {...state,
         notification: []
       };
    case userConstants.VISITOR_LIST_REQUEST:
      return {fetchingVisitorList:true}
    case userConstants.VISITOR_LIST_SUCCESS:
        return {fetchingVisitorList:false, visitorList: action.list}
    case userConstants.VISITOR_LIST_FAILURE:
        return {fetchingVisitorList:false, visitoListError:true}
    case userConstants.VISITOR_REVIEW_REQUEST:
        return {fetchingVisitorReview:true}
    case userConstants.VISITOR_REVIEW_SUCCESS:
        return {fetchingVisitorReview:false, visitorReviews: action.reviews}
    case userConstants.VISITOR_REVIEW_FAILURE:
      return {fetchingVisitorReview:false, visitorReviewError:true}
    case userConstants.PATIENT_REQUEST:
        return {registeringPatient:true, isPatientRegisterError:false, isPatientRegisterComplete:false}
    case userConstants.PATIENT_SUCCESS:
        return {registeringPatient:false, isPatientRegisterError:false, isPatientRegisterComplete:true, redirect_url:action.user.url}
    case userConstants.PATIENT_FAILURE:
      return {registeringPatient:false, isPatientRegisterError:true, isPatientRegisterComplete:false}
     
    case userConstants.ADD_REVIEW_REQUEST:
       return {addReviewLoader:true, isAddReviewComplete:false}
    case userConstants.ADD_REVIEW_SUCCESS:
      return {addReviewLoader:false, isAddReviewComplete:true}
    case userConstants.ADD_REVIEW_FAILURE:
      return {addReviewLoader:false, isAddReviewComplete:false}
    
    case userConstants.FETCH_BUSINESS_DETAIL_REQUEST:
      return {getBusinessLoader:true}
    case userConstants.FETCH_BUSINESS_DETAIL_SUCCESS:
      console.log('\n action.businessDetail:', action.businessDetail)
      return {getBusinessLoader:false, businessDetail:action.businessDetail}
    case userConstants.FETCH_BUSINESS_DETAIL_FAILURE:
      return {getBusinessLoader:false}

    case userConstants.ANOTHER_PATIENT_REQUEST:
        return {registeringAnotherPatient:true, isAnotherPatientRegisterError:false, isAnotherPatientRegisterComplete:false}
    case userConstants.ANOTHER_PATIENT_SUCCESS:
        return {registeringAnotherPatient:false, isAnotherPatientRegisterError:false, isAnotherPatientRegisterComplete:true, another_redirect_url:action.user.url}
    case userConstants.ANOTHER_PATIENT_FAILURE:
      return {registeringAnotherPatient:false, isAnotherPatientRegisterError:true, isAnotherPatientRegisterComplete:false}
    
    default:
      return state
  }
}