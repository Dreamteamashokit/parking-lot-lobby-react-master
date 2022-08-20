import React, {Suspense, lazy} from 'react';
import {BrowserRouter, Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute, AdminRoute } from '../_components';
import Dashboard from '../admin/dashboard';
import ClientList from '../admin/client/client_list';
import JotformList from '../admin/jotform/jotform-list';
import ClientLocation from '../admin/client/client_location';
import ClientRegisterPage from '../admin/client/client_register';
const LoginPage = lazy(()=> import('../_commanPages/LoginPage'));
const RegisterPage = lazy(()=> import('../_commanPages/RegisterPage'));
const ForgotPage = lazy(()=> import('../_commanPages/ForgotPage'));
const My404Component = lazy(()=> import('../_commanPages/My404Component'));
const ResetPasswordPage = lazy(()=> import('../_commanPages/ResetPasswordPage'));
const HomePage = lazy(()=> import('../_privatePages/HomePage'));
const SettingPage = lazy(()=> import('../_privatePages/SettingPage'));
const ModalPage = lazy(()=> import('../_privatePages/ModelPage'));
const PatientForm = lazy(()=> import('../_commanPages/PatientForm'));
const CommanHeader = lazy(()=> import('../_commanPages/CommanHeader'));
const AdminLoginHeader = lazy(()=> import('../_commanPages/AdminLoginHeader'));
const AdminLoginPage = lazy(()=> import('../_commanPages/AdminLoginPage'));
const ThankYouPage = lazy(()=> import('../_commanPages/ThankYouPage'));
const ReviewPage = lazy(()=> import('../_commanPages/Review'));
const AddAnotherPatientForm = lazy(()=> import('../_commanPages/AddAnotherPatient'));

class App extends React.Component {
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.clearAlerts();
        });
    }

    render() {
        const { alert } = this.props;
        return (
            <BrowserRouter>
            <div>
            <Router history={history}>
                <Suspense fallback={<div className="txt-center">Loading....</div>}>
                    <Switch>
                        <PrivateRoute exact path="/" component={HomePage} />
                        <PrivateRoute exact path="/settings" component={SettingPage} />
                        <PrivateRoute exact path="/modal" component={ModalPage} />
                        <PrivateRoute exact path="/visitor-reviews" component={lazy(()=> import('../_privatePages/VisitorReviews'))} />
                        <PrivateRoute exact path="/visitor-list" component={lazy(()=> import('../_privatePages/VisitorList'))} />
                        <Route exact path="/patient/:locationId/:patientId" component={PatientForm} />
                        <Route exact path="/add-another-patient/:locationId" component={AddAnotherPatientForm} />
                        <Route exact path="/review/:locationId/:patientId" component={ReviewPage} />
                        <Route path="/login">
                          <CommanHeader />
                          <LoginPage/>
                        </Route>
                        <Route path="/register" >
                           <CommanHeader />
                           <RegisterPage />
                        </Route>
                        <Route path="/forgot">
                            <CommanHeader />
                            <ForgotPage/>
                        </Route>
                        <Route path="/reset-password" >
                            <CommanHeader />
                            <ResetPasswordPage/>
                            </Route>
                        <Route path="/thank-you" component={ThankYouPage} />
                        <Route path="/admin/login">
                          <AdminLoginHeader />
                          <AdminLoginPage/>
                        </Route>
                        <AdminRoute path="/admin/dashboard" component={Dashboard} />
                        <AdminRoute path="/admin/client-list" component={ClientList} />
                        <AdminRoute path="/admin/jotform-list" component={JotformList} />
                        <AdminRoute path="/admin/client-location/:id" component={ClientLocation} />
                        <AdminRoute path="/admin/client-register" component={ClientRegisterPage} />
                        <Route path="*" component={My404Component} />
                    </Switch>
                </Suspense>
            </Router>
            <ToastContainer />
            </div>
            </BrowserRouter>
        );
    }
}

function mapState(state) {
    const { alert } = state;
    return { alert };
}

const actionCreators = {
    clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };