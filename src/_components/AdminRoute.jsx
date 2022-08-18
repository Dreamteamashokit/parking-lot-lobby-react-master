import React, {Suspense, lazy} from 'react';
import { Route, Redirect } from 'react-router-dom';

const AdminHeaderPage = lazy(()=> import('../_privatePages/AdminHeaderPage'));



export const AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('admin')
            ? 
            <div className="wrapper">
            <Suspense fallback={<div className="txt-center">Loading....</div>}>
             <AdminHeaderPage></AdminHeaderPage>
            </Suspense>
            <Component {...props} />
            </div>
            : <Redirect to={{ pathname: '/admin/login', state: { from: props.location } }} />
    )} />
)