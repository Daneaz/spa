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

function getTotal(bookings) {
    let total = 0
    for (let i = 0; i < bookings.length; i++) {
        total += bookings[i].service.price
    }
    return total
}

class InvoiceList extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <ListItem button onClick={this.props.click} >
                <Grid
                    container
                    direction="column">
                    {
                        this.props.bookings.map(booking => {

                            return (
                                <React.Fragment>
                                    <Grid item>
                                        <Grid
                                            container
                                            justify="space-between"
                                            direction="row">
                                            <h3><strong>{booking.service.name}</strong></h3>
                                            <h3><strong>S${booking.service.price}</strong></h3>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <light>{new Date(booking.start).toLocaleString()} with {booking.staff.displayName} </light>
                                    </Grid>
                                </React.Fragment>
                            )
                        })
                    }
                    <Grid item>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center">
                            <h3><strong>Total: ${getTotal(this.props.bookings)} </strong></h3>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItem>
        )
    }
}
export default withStyles(styles)(InvoiceList);