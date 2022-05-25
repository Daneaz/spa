import React from 'react';
import { withStyles } from '@material-ui/styles';
import {
  Typography, Fab, Hidden
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';


import AppLayout from '../Component/Layout/Layout'

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

class Message extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <AppLayout title="Message" {...this.props} >
        <Typography component="div"  >
          <h3>
            Hello World, i'm Message
      </h3>
        </Typography>
        <Hidden mdUp>
          <Fab color="primary" aria-label="Add" className={classes.fab}>
            <AddIcon />
          </Fab>
        </Hidden>
      </AppLayout>
    );
  }
}

export default withStyles(styles)(Message);
