import React from 'react';
import { withRouter, Link } from "react-router-dom";

import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Container, Box, Typography, Button } from '@material-ui/core';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class Error extends React.Component {

  render() {

    const { classes } = this.props;

    let { from } = this.props.location.state || { from: { pathname: "/" } };

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Box m={2}>
                <Typography variant="h3" noWrap>
                    Page not found
                </Typography>
            </Box>
            <Box m={2}>
                <Typography variant="subtitle1" >
                    Ooooups! Looks like you got lost.
                </Typography>
            </Box>
            <Box>
                <Button component={Link} to={from} >Go back</Button>
            </Box>
        </div>
      </Container>
    )
  }
}

export default withRouter(withStyles(styles)(Error));