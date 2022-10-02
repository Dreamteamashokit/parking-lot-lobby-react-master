import { commonConstants } from '../_constants';
export function commons(state = { waitingList: [], checkInOutList: [], servedPatient: [], addLocationError:null }, action) {
  switch (action.type) {
    case commonConstants.WAITING_PATIENT_LIST_REQUEST:
      return { ...state, isWaiting: true, waitingList: [] };
    case commonConstants.WAITING_PATIENT_LIST_SUCCESS:
      return { ...state, isWaiting: false, waitingList: action.response };
    case commonConstants.WAITING_PATIENT_LIST_FAILURE:
      return { ...state, isWaiting: false, waitingList: [] };

    case commonConstants.CHECKINOUT_PATIENT_LIST_REQUEST:
      return { ...state, isCheckInOUT: true, checkInOutList: [] };
    case commonConstants.CHECKINOUT_PATIENT_LIST_SUCCESS:
      return { ...state, isCheckInOUT: false, checkInOutList: action.response };
    case commonConstants.CHECKINOUT_PATIENT_LIST_FAILURE:
      return { ...state, isCheckInOUT: false, checkInOutList: [] };

    case commonConstants.SERVED_PATIENT_LIST_REQUEST:
      return { ...state, isServed: true, servedPatient: [] };
    case commonConstants.SERVED_PATIENT_LIST_SUCCESS:
      return { ...state, isServed: false, servedPatient: action.response };
    case commonConstants.SERVED_PATIENT_LIST_FAILURE:
      return { ...state, isServed: false, servedPatient: [] };

    case commonConstants.To_CHECKIN_REQUEST:
      return { ...state, isMoveToCheckIn: true, moveToCheckIN: action.patientId };
    case commonConstants.To_CHECKIN_SUCCESS:
      return {
        ...state, isMoveToCheckIn: false,
        moveToCheckIN: action.patientId,
        waitingList: state.waitingList.filter(function (e) {
          return e.patientId._id !== action.patientId.patientId;
        }),
        servedPatient: state.waitingList.filter(function (e) {
          return e.patientId._id !== action.patientId.patientId;
        })
      };
    case commonConstants.REMOVE_PATIENT_REQUEST:
      return { ...state };
    case commonConstants.To_CHECKIN_FAILURE:
      return { ...state, isMoveToCheckIn: false, moveToCheckIN: action.patientId };

    case commonConstants.To_SERVED_REQUEST:
      return { ...state, isMoveToServed: true, moveToCheckIN: action.patientId };
    case commonConstants.To_SERVED_SUCCESS:
      return {
        ...state, isMoveToServed: false,
        moveToCheckIN: action.patientId,
        checkInOutList: state.checkInOutList.filter(function (e) {
          return e.patientId._id !== action.patientId.patientId;
        })
      };
    case commonConstants.To_SERVED_FAILURE:
      return { ...state, isMoveToServed: false, moveToCheckIN: action.patientId };

    case commonConstants.NOTIFY_REQUEST:
      return { ...state, isNotifyProccess: true, notifyObject: action.payload };
    case commonConstants.NOTIFY_SUCCESS:
      return {
        ...state, isNotifyProccess: false,
        notifyObject: action.response,
        waitingList: state.waitingList.map(content =>
          content.patientId._id === action.response.patientId
            ? { ...content, isNotify: action.response.isNotify, notifyTime: action.response.notifyTime, notifyAt: action.response.notifyAt }
            : content
        )
      };
    case commonConstants.NOTIFY_FAILURE:
      return { ...state, isNotifyProccess: false, notifyObject: action.payload };
    case commonConstants.OVER_WAITING:
      if (state.waitingList[action.index] && state.waitingList[action.index].hasOwnProperty('overFlow')) {
        return { ...state };
      }
      return {
        ...state,
        waitingList: state.waitingList.map((content, index) => index === action.index ?
          { ...content, overFlow: action.overFlow } :
          content
        )
      };
    case commonConstants.REMOVE_PATIENT_SUCCESS:
      switch (action.payload.type) {
        case 1:
          return {
            ...state,
            waitingList: state.waitingList.filter(function (e) {
              return e.patientId._id !== action.payload.id;
            })
          };
        case 2:
          return {
            ...state,
            checkInOutList: state.checkInOutList.filter(function (e) {
              return e.patientId._id !== action.payload.id;
            })
          };
        case 3:
          return {
            ...state,
            servedPatient: state.servedPatient.filter(function (e) {
              return e.patientId._id !== action.payload.id;
            })
          };
        default:
          return { ...state };
      }
    case commonConstants.COUNTDOWN_FINISH:
      return {
        ...state,
        waitingList: state.waitingList.map((content, index) => index === action.index ?
          { ...content, countDownFinish: action.countDownFinish } :
          content
        )
      };
    case commonConstants.UPDATE_PATIENT_SUCCESS:
      return {
        ...state,
        waitingList: state.waitingList.map((content, index) => (content.patientId && content.patientId._id === action.response._id) ?
          { ...content, patientId: action.response } :
          content
        ),
        checkInOutList: state.checkInOutList.map((content, index) => (content.patientId && content.patientId._id === action.response._id) ?
          { ...content, patientId: action.response } :
          content
        ),
        servedPatient: state.servedPatient.map((content, index) => (content.patientId && content.patientId._id === action.response._id) ?
          { ...content, patientId: action.response } :
          content
        )
      };
    case commonConstants.UN_READ_MESSAGE:
      return {
        ...state,
        waitingList: state.waitingList.map((content, index) => (content.patientId && content.patientId._id === action.patientId) ?
          { ...content, chat_messages: 0 } :
          content
        ),
        checkInOutList: state.checkInOutList.map((content, index) => (content.patientId && content.patientId._id === action.patientId) ?
          { ...content, chat_messages: 0 } :
          content
        ),
        servedPatient: state.servedPatient.map((content, index) => (content.patientId && content.patientId._id === action.patientId) ?
          { ...content, chat_messages: 0 } :
          content
        )
      };
    case commonConstants.NO_SHOW_REQUEST:
      return { ...state, isNOSHOWProccess: true };
    case commonConstants.NO_SHOW_SUCCESS:
      return {
        ...state, isNOSHOWProccess: false,
        waitingList: state.waitingList.map(content =>
          content.patientId._id === action.response.patientId
            ? { ...content, noShow: action.response.noShow }
            : content
        )
      };
    case commonConstants.NO_SHOW_FAILURE:
      return { ...state, isDelayProccess: false };

    case commonConstants.DELAY_REQUEST:
      return { ...state, isDelayProccess: true };
    case commonConstants.DELAY_SUCCESS:
      return {
        ...state, isDelayProccess: false,
        waitingList: state.waitingList.map(content =>
          content.patientId._id === action.response.patientId
            ? { ...content, is_delay: action.response.is_delay }
            : content
        )
      };
    case commonConstants.DELAY_FAILURE:
      return { ...state, isDelayProccess: false };

    case commonConstants.NOTES_REQUEST:
      return { ...state, updatingNote: true };
    case commonConstants.NOTES_SUCCESS:
      return {
        ...state, updatingNote: false,
        waitingList: state.waitingList.map(content =>
          (content.patientId && (content.patientId._id === action.response._id))
            ? { ...content, patientId: action.response }
            : content
        ),
        checkInOutList: state.checkInOutList.map(content =>
          (content.patientId && (content.patientId._id === action.response._id))
            ? { ...content, patientId: action.response }
            : content
        ),
        servedPatient: state.servedPatient.map(content =>
          (content.patientId && (content.patientId._id === action.response._id))
            ? { ...content, patientId: action.response }
            : content
        )
      };
    case commonConstants.NOTES_FAILURE:
      return { ...state, updatingNote: false };

    case commonConstants.ADD_CLIENT_REQUEST:
      return { ...state, addClientProccess: true };
    case commonConstants.ADD_CLIENT_REQUEST:
      return { ...state, addClientProccess: false };
    case commonConstants.ADD_CLIENT_REQUEST:
      return { ...state, addClientProccess: false };

    case commonConstants.ADD_LOCATION_REQUEST:
      return { ...state, islocationRegister: true, isAddLocationComplete: false, addLocationError:null };
    case commonConstants.ADD_LOCATION_SUCCESS:
      return { ...state, islocationRegister: false, isAddLocationComplete: true,addLocationError:null };
    case commonConstants.ADD_LOCATION_FAILURE:
      return { ...state, islocationRegister: false, isAddLocationComplete: false, addLocationError: action?.error || 'contact to admin' };

    case commonConstants.FETCH_LOCATION_REQUEST:
      return { ...state, fetching_locations: true, clinic_locations: [], isAddLocationComplete: false };
    case commonConstants.FETCH_LOCATION_SUCCESS:
      return { ...state, fetching_locations: false, clinic_locations: action.response, isAddLocationComplete: false };
    case commonConstants.FETCH_LOCATION_FAILURE:
      return { ...state, fetching_locations: false, clinic_locations: [], isAddLocationComplete: false };

    case commonConstants.To_WAITINGBACK_REQUEST:
      return { ...state, isBackToWaiting: true, moveBackWaiting: action.recordId };
    case commonConstants.To_WAITINGBACK_SUCCESS:
      if (action.listType == 'checkInOut') {
        return {
          ...state, isBackToWaiting: false,
          moveBackWaiting: action.recordId,
          checkInOutList: state.checkInOutList.filter(function (e) {
            return e._id !== action.recordId;
          })
        };
      } else if (action.listType == 'servedSection') {
        return {
          ...state, isBackToWaiting: false,
          moveBackWaiting: action.recordId,
          servedPatient: state.servedPatient.filter(function (e) {
            return e._id !== action.recordId;
          })
        };
      } else {
        return { ...state, isBackToWaiting: false, moveBackWaiting: action.recordId }
      }
    case commonConstants.To_WAITINGBACK_FAILURE:
      return { ...state, isBackToWaiting: false, moveBackWaiting: action.recordId };

    case commonConstants.SUBMISSION_UPLOAD_REQUEST:
      return { ...state, fetching_uploads: true, isfetchUploadComplete: false };
    case commonConstants.SUBMISSION_UPLOAD_SUCCESS:
      return { ...state, fetching_uploads: false, isfetchUploadComplete: true, upload_list: action.imagesList };
    case commonConstants.SUBMISSION_UPLOAD_FAILURE:
      return { ...state, fetching_uploads: false, isfetchUploadComplete: false };
    
    case commonConstants.REVIEW_SUCCESS:
        return {
          ...state,
          waitingList: state.waitingList.map(content =>
            content._id === action.patientId
              ? { ...content, reviewDocument: true }
              : content
          )
        };


    default:
      return state
  }
}

export function quickResponse(state = { fetchingQuick: false, quickResponseData: [] }, action) {
  switch (action.type) {
    case commonConstants.GET_QUICK_REQUEST:
      return { ...state, fetchingQuick: true };
    case commonConstants.GET_QUICK_SUCCESS:
      return { ...state, fetchingQuick: false, quickResponseData: action.response };
    case commonConstants.GET_QUICK_FAILURE:
      return { ...state, fetchingQuick: false };

    case commonConstants.CREATE_QUICK_REQUEST:
      return { ...state, creatingQuick: true };
    case commonConstants.CREATE_QUICK_SUCCESS:
      state.quickResponseData = (action.response) ? [action.response].concat(state.quickResponseData) : state.quickResponseData;
      return {
        ...state,
        creatingQuick: false
      };
    case commonConstants.CREATE_QUICK_FAILURE:
      return { ...state, creatingQuick: false };

    case commonConstants.UPDATE_QUICK_REQUEST:
      return { ...state, updateQuick: true };
    case commonConstants.UPDATE_QUICK_SUCCESS:
      return {
        ...state,
        quickResponseData: state.quickResponseData.map((content, index) => index === action.index ?
          { ...content, message: action.response.message } :
          content
        )
      };
    case commonConstants.UPDATE_QUICK_FAILURE:
      return { ...state, updateQuick: false };

    case commonConstants.REMOVE_QUICK_REQUEST:
      return { ...state, removeQuick: true };
    case commonConstants.REMOVE_QUICK_SUCCESS:
      return {
        ...state,
        quickResponseData: state.quickResponseData.filter(function (e) {
          return e._id !== action.payload.id;
        })
      };
    case commonConstants.REMOVE_QUICK_FAILURE:
      return { ...state, removeQuick: false };

    default:
      return state
  }
}

export function chat(state = { fetchingChat: false, chatData: [] }, action) {
  switch (action.type) {
    case commonConstants.GET_CHAT_REQUEST:
      return { ...state, fetchingChat: true };
    case commonConstants.GET_CHAT_SUCCESS:
      return { ...state, fetchingChat: false, chatData: action.response };
    case commonConstants.GET_CHAT_FAILURE:
      return { ...state, fetchingChat: false };

    case commonConstants.CREATE_CHAT_REQUEST:
      return { ...state, creatingChat: true };
    case commonConstants.CREATE_CHAT_SUCCESS:
      state.chatData = (action.response) ? state.chatData.concat([action.response]) : state.quickResponseData;
      return { ...state, creatingChat: false };
    case commonConstants.CREATE_CHAT_FAILURE:
      return { ...state, creatingChat: false };
    default:
      return state
  }
}