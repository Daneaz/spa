import React from 'react';
import { withRouter, Redirect } from "react-router-dom";

import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Container, Box, Button, Typography, LinearProgress } from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import Swal from 'sweetalert2';

import { fetchAPI, setToken, setUser, removeToken, removeUser } from '../utils';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends React.Component {

  state = { redirectToReferrer: false };

  render() {

    const { classes } = this.props;

    let { from } = this.props.location.state || { from: { pathname: "/dashboard" } };
    let { redirectToReferrer } = this.state;
    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Box m={3}><img src={require('../images/logo.png')} alt="Logo" style={{ width: 320 }} /></Box>
          <Typography component="h1" variant="h5">
            Spa Management System
        </Typography>
          <Formik
            initialValues={{ username: '', password: '' }}
            validate={values => {
              const errors = {};
              if (!values.username) { errors.username = 'Please enter username' }
              //else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) { errors.username = 'Invalid email address' }
              if (!values.password) { errors.password = 'Please enter password' }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                const respObj = await fetchAPI('POST', 'auth/login', values);
                if (respObj && respObj.ok && respObj.token && respObj.user) {
                  setToken(respObj.token);
                  setUser(respObj.user);
                  this.setState({ redirectToReferrer: true });
                } else {
                  Swal.fire({
                    type: 'error', text: 'Please try again.',
                    title: 'Invalid email or password!'
                  })
                }
              } catch (err) {
                removeToken(); removeUser();
                setErrors({ username: "Invalid username", password: "Invalid password" });
                Swal.fire({
                  type: 'error', text: 'Please try again.',
                  title: 'Invalid email or password!'
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
                <Button variant="contained" color="primary" fullWidth className={classes.submit}
                  disabled={isSubmitting} type="submit"
                >
                  Login
              </Button>
                {isSubmitting && <LinearProgress />}
              </Form>
            )} />
          <small>{process.env.REACT_APP_VERSION}</small>
        </div>
      </Container>
    )
  }
}

export default withRouter(withStyles(styles)(Login));
