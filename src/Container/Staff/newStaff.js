import React from 'react';
import Select from 'react-select';
import { withStyles } from '@material-ui/styles';
import {
    Typography, Button, CssBaseline, Container, LinearProgress, Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';

import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { fetchAPI } from '../../utils';
import Swal from 'sweetalert2';
import AppLayout from '../../Component/Layout/Layout'
import InfiniteCalendar, { Calendar, defaultMultipleDateInterpolation, withMultipleDates } from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'


const styles = theme => ({
    container: {
        marginTop: theme.spacing(5)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cancel: {
        margin: theme.spacing(0, 0, 0),
    },
    select: {
        margin: theme.spacing(2, 0, 0),
    },

});

class NewStaff extends React.Component {

    state = {
        selectedOption: {},
        roleList: [],
        selectedLeaves: [],
        selectedOff: [],
        offDays: [],
        leaveOpen: false,
        offOpen: false,
    };

    async componentDidMount() {
        try {
            const roleList = await fetchAPI('GET', 'staffMgt/roles');
            this.setState({
                roleList: roleList,
                selectedOption: roleList[0]
            });
        } catch (error) {
            Swal.fire({
                type: 'error',
                title: "Opps... Something Wrong...",
                text: error
            })
        }
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
    };

    handleLeaveSelection(selectedDate) {
        let selectedLeave = defaultMultipleDateInterpolation(selectedDate, this.state.selectedLeaves)
        this.setState({
            selectedLeaves: selectedLeave
        })
    }

    handleOffSelection(selectedDate) {
        let selectedOff = defaultMultipleDateInterpolation(selectedDate, this.state.selectedOff)
        let disabledDays = selectedOff.map(day => {
            return day.getDay();
        })
        this.setState({
            offDays: disabledDays,
            selectedOff: selectedOff
        })
    }

    handleLeaveClickOpen = () => {
        this.setState({ leaveOpen: true });
    };

    handleLeaveOpen = () => {
        this.setState({ leaveOpen: false });
    }

    handleLeaveClose = () => {
        this.setState({ leaveOpen: false });
    }

    handleOffClickOpen = () => {
        this.setState({ offOpen: true });
    };

    handleOffOpen = () => {
        this.setState({ offOpen: false });
    }

    handleOffClose = () => {
        this.setState({ offOpen: false });
    }

    handleOffReset = () => {
        this.setState({
            offDays: [],
            selectedOff: [],
        });
    }
    render() {
        const { classes } = this.props;
        const { selectedOption } = this.state;
        return (
            <AppLayout title="New Staff" {...this.props} >
                <Container component="main" maxWidth="md" className={classes.container} >
                    <Typography>
                        <h3>
                            Personal Infomation
                        </h3>
                    </Typography>
                    <CssBaseline />
                    <Formik
                        initialValues={{ username: '', password: '', confirmPassoword: '', mobile: '', email: '', }}
                        validate={values => {
                            const errors = {};
                            if (!values.username) { errors.username = 'Please enter username' }
                            if (!values.password) { errors.password = 'Please enter password' }
                            if (!values.confirmPassoword) { errors.confirmPassoword = 'Please enter password' }
                            if (!values.displayName) { errors.displayName = 'Please enter display name' }
                            if (!values.mobile) { errors.mobile = 'Please enter mobile number' }
                            if (!values.email) { errors.email = 'Please enter email address' }
                            if (values.password !== values.confirmPassoword) { errors.confirmPassoword = 'Password does not match' }
                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting, setErrors }) => {
                            try {
                                values.role = this.state.selectedOption.value;
                                values.offDays = this.state.offDays;
                                values.leaveDays = this.state.selectedLeaves;

                                const respObj = await fetchAPI('POST', 'staffMgt/staffs', values);

                                if (respObj && respObj.ok) {
                                    window.history.back();
                                } else {
                                    Swal.fire({
                                        type: 'error',
                                        title: "Opps... Something Wrong...",
                                        text: respObj.error
                                    })
                                }
                            } catch (error) {
                                Swal.fire({
                                    type: 'error',
                                    title: "Opps... Something Wrong...",
                                    text: error
                                })
                            }
                            setSubmitting(false);
                        }}
                        render={({ submitForm, isSubmitting, values, setFieldValue, errors, setErrors }) => (
                            <Form>
                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth autoFocus
                                    name="username" label="Username"
                                />
                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="password" label="Password" type="password"
                                />
                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="confirmPassoword" label="Confirm Password" type="password"
                                />
                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="displayName" label="Display Name"
                                />
                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="mobile" label="Mobile" type="number"
                                />
                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="email" label="Email"
                                />
                                <Typography>
                                    <h5>
                                        Role
                                    </h5>
                                </Typography>
                                <Select className={classes.select}
                                    onChange={this.handleChange}
                                    options={this.state.roleList}
                                    value={selectedOption}
                                />
                                <Typography>
                                    <h5>
                                        On Leave
                                    </h5>
                                </Typography>
                                <Button variant="outlined" color="primary" onClick={this.handleLeaveClickOpen}>
                                    Please Select Leave Days...
                                </Button>
                                <Dialog open={this.state.leaveOpen} onClose={this.handleLeaveClose} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                                    <DialogContent>
                                        <InfiniteCalendar id="leaveCalendar"
                                            Component={withMultipleDates(Calendar)}
                                            selected={this.state.selectedLeaves}
                                            minDate={new Date()}
                                            disabledDays={this.state.offDays}
                                            interpolateSelection={defaultMultipleDateInterpolation}
                                            onSelect={(selectedDate) => { this.handleLeaveSelection(selectedDate) }}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleLeaveClose} color="primary">
                                            Done
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                <Button variant="contained" color="primary" fullWidth className={classes.submit}
                                    disabled={isSubmitting} onClick={submitForm}
                                >
                                    Register
                                </Button>
                                <Button variant="contained" color="secondary" fullWidth className={classes.cancel}
                                    onClick={() => { window.history.back(); }}
                                >
                                    Cancel
                                </Button>
                                {isSubmitting && <LinearProgress />}
                            </Form>
                        )}
                    />
                </Container>
            </AppLayout>
        );
    }
}

export default withStyles(styles)(NewStaff);