import { combineReducers } from 'redux';

import { authentication, forgot, resetPassword } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { adminAuthentication, addTwilioNumber, resetClientPassword, addLocationJotform, fetchLocationList, fetchDashboardCount, adminClientlist, adminJotformlist } from './admin.reducer';
import { alert } from './alert.reducer';
import {settings} from './settings.reducer';
import {commons, quickResponse, chat} from './commons.reducer';
const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  adminAuthentication,
  adminClientlist,
  adminJotformlist,
  fetchDashboardCount,
  fetchLocationList,
  addTwilioNumber,
  resetClientPassword,
  addLocationJotform,
  alert,
  forgot,
  resetPassword,
  settings,
  commons,
  quickResponse,
  chat
});

export default rootReducer;