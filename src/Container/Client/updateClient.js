import React from 'react';
import Select from 'react-select';
import { withStyles } from '@material-ui/styles';
import {
    Typography, Button, CssBaseline, Container, LinearProgress
} from '@material-ui/core';
import Datepicker from '@material-ui/core/TextField'

import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { fetchAPI } from '../../utils';
import Swal from 'sweetalert2';
import AppLayout from '../../Component/Layout/Layout'

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
});
const genderOptions = [
    { value: "M", label: 'M' },
    { value: "F", label: 'F' },
];
class UpdateClient extends React.Component {

    state = {
        gender: { value: this.props.location.state.data.gender, label: this.props.location.state.data.gender },
        birthday: null,
    }

    handleGenderSelection = (gender) => {
        this.setState({ gender });
    }
    handleChangeBirthday = (event) => {
        this.setState({ birthday: event.target.value });
    }

    render() {
        const { classes } = this.props;
        return (
            <AppLayout title="Staff Details" {...this.props} >
                <Container component="main" maxWidth="md" className={classes.container} >
                    <Typography>
                        <h3>
                            Update Client Details
                        </h3>
                    </Typography>
                    <CssBaseline />

                    <Formik
                        initialValues={{ mobile: this.props.location.state.data.mobile, displayName: this.props.location.state.data.displayName, email: this.props.location.state.data.email, nric: this.props.location.state.data.nric, credit: this.props.location.state.data.credit }}
                        validate={values => {
                            const errors = {};
                            if (!values.mobile) { errors.mobile = 'Please enter mobile number' }
                            if (!values.displayName) { errors.displayName = 'Please enter display name' }
                            if (values.password !== values.confirmPassoword) { errors.confirmPassoword = 'Password does not match' }
                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                values.gender = this.state.gender.value
                                values.birthday = this.state.birthday
                                const respObj = await fetchAPI('PATCH', `clientMgt/clients/${this.props.location.state.data._id}`, values);
                                if (respObj && respObj.ok) {
                                    const { history } = this.props;

                                    history.push({
                                        pathname: "/client/detail",
                                        state: {
                                            data: respObj.client
                                        }
                                    });
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
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="mobile" label="Mobile" type="number"
                                />
                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="password" label="New Passowrd" type="password"
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
                                    name="email" label="Email"
                                />

                                <Field
                                    component={TextField} variant="outlined" margin="normal" fullWidth
                                    name="nric" label="NRIC"
                                />
                                <Datepicker
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    id="date"
                                    label="Birthday"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.handleChangeBirthday}
                                />
                                <Typography>
                                    <h5>
                                        Gender
                                    </h5>
                                </Typography>
                                <Select className={classes.select}
                                    onChange={this.handleGenderSelection}
                                    options={genderOptions}
                                    value={this.state.gender}
                                />

                                <Button variant="contained" color="primary" fullWidth className={classes.submit}
                                    disabled={isSubmitting} onClick={submitForm}
                                >
                                    Update
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

export default withStyles(styles)(UpdateClient);
