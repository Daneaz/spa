import React from 'react';
import {
    Grid, TextField, Paper, ListItem,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

    listitem: {
        margin: theme.spacing(1),
        width: '100%'
    },
});

class Invoice extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            // <Paper className={classes.paperMargin}>
            <ListItem >
                <Grid
                    container
                    direction="column">
                    <Grid item>
                        <Grid
                            container
                            justify="space-between"
                            direction="row">
                            <h3><strong>{this.props.booking.service.name}</strong></h3>
                            <h3><strong>S${this.props.booking.service.price}</strong></h3>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <light>{new Date(this.props.booking.start).toTimeString().split(' ')[0]} with {this.props.booking.staff.displayName} </light>
                    </Grid>
                </Grid>
            </ListItem>
            // </Paper>
        )
    }
}
export default withStyles(styles)(Invoice);