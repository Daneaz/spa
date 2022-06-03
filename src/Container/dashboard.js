import React from 'react';
import {withStyles} from '@material-ui/styles';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer, LineChart, Line
} from 'recharts';

import {
    Paper
} from '@material-ui/core';

import AppLayout from '../Component/Layout/Layout'
import {fetchAPI} from '../utils';
import Swal from 'sweetalert2';

const styles = theme => ({
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
});

function monthMapping(monthInt) {
    switch (monthInt) {
        case 1:
            return "Jan"
        case 2:
            return "Feb"
        case 3:
            return "Mar"
        case 4:
            return "Apr"
        case 5:
            return "May"
        case 6:
            return "Jun"
        case 7:
            return "Jul"
        case 8:
            return "Aug"
        case 9:
            return "Sep"
        case 10:
            return "Oct"
        case 11:
            return "Nov"
        case 12:
            return "Dec"
    }
}

class Dashboard extends React.Component {

    state = {
        bookingList: null,
        appointments: null,
    }

    async componentDidMount() {
        try {
            const response = await fetchAPI('GET', 'dashboardMgt/dashboard');
            this.setState({
                bookingList: response.bookingsByStaff,
                appointments: response.appointments
            });
        } catch (error) {
            Swal.fire({
                type: 'error',
                title: "Opps... Something Wrong...",
                text: error
            })
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <AppLayout title="Dashboard" {...this.props} >
                <Paper style={{marginTop: 20}}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={this.state.appointments}
                                   margin={{
                                       top: 20, right: 40, left: 20, bottom: 20,
                                   }}>
                            <XAxis dataKey="_id"/>
                            <YAxis/>
                            <Tooltip/>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                            <Line type="monotone" dataKey="Total" stroke="#4287f5"/>
                            <Line type="monotone" dataKey="Missed" stroke="#ba3091"/>
                            <Line type="monotone" dataKey="Completed" stroke="#82ca9d"/>
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
                <Paper style={{marginTop: 20}}>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={this.state.bookingList}
                            margin={{
                                top: 20, right: 40, left: 20, bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="staff"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="Bookings" fill="#82ca9d"/>
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </AppLayout>
        );
    }
}

export default withStyles(styles)(Dashboard);
