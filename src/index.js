import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import 'typeface-roboto';

import { getUser } from './utils';
import Login from './Container/login';
import ErrorPage from './Container/error';
import Dashboard from './Container/dashboard';

import Appointment from './Container/Appointment/appointment';

import Client from './Container/Client/client';
import NewClient from './Container/Client/newClient';
import ClientDetail from './Container/Client/clientDetail';
import UpdateClient from './Container/Client/updateClient';

import Staff from './Container/Staff/staff';
import NewStaff from './Container/Staff/newStaff';
import StaffDetail from './Container/Staff/staffDetail';

import Service from './Container/Service/service';
import NewService from './Container/Service/newService';
import ServiceDetail from './Container/Service/serviceDetail';
import NewCategory from './Container/Service/newCategory'

import Invoice from './Container/Invoice/invoices'
import InvoiceDetail from './Container/Invoice/invoiceDetail'

import Message from './Container/message';
import Report from './Container/report';
import Setting from './Container/setting';

//Kiosk
import Start from './Container/Kiosk/start';
import FacialLogin from './Container/Kiosk/facialLogin';
import MobileLogin from './Container/Kiosk/mobileLogin';
import Register from './Container/Kiosk/register';
import Snapshot from './Container/Kiosk/snapshot';
import SnapshotManual from './Container/Kiosk/snapshotManual';
import SelectService from './Container/Kiosk/selectservice';
import ClientDetails from './Container/Kiosk/clientDetails';
function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                props.user = getUser();
                if (props.user) { return <Component {...props} /> }
                else { return <Redirect to={{ pathname: "/login", state: { from: props.location } }} /> }
            }}
        />
    );
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#d32f2f',
        },
    }
});
function Routers() {

    return (
        <ThemeProvider theme={theme}>
            <Router basename={"/spa"}>
                <Switch>
                    <Route exact path="/start" component={Start} />
                    <Route exact path="/faciallogin" component={FacialLogin} />
                    <Route exact path="/mobilelogin" component={MobileLogin} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/snapshot" component={Snapshot} />
                    <Route exact path="/snapshotmanual" component={SnapshotManual} />
                    <Route exact path="/clientdetails" component={ClientDetails} />
                    <Route exact path="/selectservice" component={SelectService} />


                    <Route path="/login" component={Login} />
                    <Route exact path="/" component={Login} />
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />

                    <PrivateRoute exact path="/appointment" component={Appointment} />

                    <PrivateRoute exact path="/message" component={Message} />
                    <PrivateRoute exact path="/report" component={Report} />

                    <PrivateRoute exact path="/client" component={Client} />
                    <PrivateRoute exact path="/client/new" component={NewClient} />
                    <PrivateRoute exact path="/client/detail" component={ClientDetail} />
                    <PrivateRoute exact path="/client/update" component={UpdateClient} />

                    <PrivateRoute exact path="/staff" component={Staff} />
                    <PrivateRoute exact path="/staff/new" component={NewStaff} />
                    <PrivateRoute exact path="/staff/detail" component={StaffDetail} />

                    <PrivateRoute exact path="/service" component={Service} />
                    <PrivateRoute exact path="/service/new" component={NewService} />
                    <PrivateRoute exact path="/service/detail" component={ServiceDetail} />
                    <PrivateRoute exact path="/service/newcategory" component={NewCategory} />

                    <PrivateRoute exact path="/invoice" component={Invoice} />
                    <PrivateRoute exact path="/invoice/detail" component={InvoiceDetail} />

                    <PrivateRoute exact path="/setting" component={Setting} />

                    <Route component={ErrorPage} />
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

ReactDOM.render(<Routers />, document.getElementById('root'));

serviceWorker.unregister();
