import React, {Suspense, lazy} from 'react';
import { Route, Redirect } from 'react-router-dom';

const HeaderPage = lazy(()=> import('../_privatePages/HeaderPage'));



export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? 
            <div className="wrapper">
            <Suspense fallback={<div className="txt-center">Loading....</div>}>
             <HeaderPage></HeaderPage>
            </Suspense>
            <Component {...props} />
            </div>
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)