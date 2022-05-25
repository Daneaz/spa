import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    Grid, IconButton, Paper, ListItem,
    InputLabel, FormControl, Select, Input, MenuItem,
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    formControl: {
        margin: theme.spacing(3),
        minWidth: 500,
    },
    serviceControl: {
        margin: theme.spacing(3),
        minWidth: 500,
    },
    staffControl: {
        margin: theme.spacing(3),
        minWidth: 150,
    },
    paperMargin: {
        margin: theme.spacing(1),
    },
});

class SelectService extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paperMargin}>
                <ListItem>
                    <Grid
                        container
                        direction="column">
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">
                            <Grid item xs={2}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        ampm={false}
                                        minutesStep={5}
                                        autoOk
                                        label="Start Time"
                                        value={this.props.start}
                                        onChange={this.props.changeTime}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                        disabled={this.props.disable}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.serviceControl} >
                                    <InputLabel htmlFor="age-native-simple" >Service Category</InputLabel>
                                    <Select
                                        value={this.props.category}
                                        onChange={this.props.changeCategory}
                                        input={<Input id="age-native-simple" />}
                                        disabled={this.props.disable}
                                    >
                                        {this.props.categoryList.map((category, i) => (
                                            <MenuItem id={i} value={category.value}>
                                                {category.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">
                            <Grid item>
                                <FormControl className={classes.serviceControl} >
                                    <InputLabel htmlFor="age-native-simple" >Service Type</InputLabel>
                                    <Select
                                        value={this.props.service}
                                        onChange={this.props.changeService}
                                        input={<Input id="age-native-simple" />}
                                        disabled={this.props.disable}
                                    >
                                        {this.props.serviceList.map((service, i) => (
                                            <MenuItem id={i} value={service._id}>
                                                {`${service.name} ( ${service.duration} mins $${service.price} )`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.staffControl}>
                                    <InputLabel htmlFor="age-native-simple" >Staff Name</InputLabel>
                                    <Select
                                        value={this.props.staff}
                                        onChange={this.props.changeStaff}
                                        input={<Input id="age-native-simple" />}
                                        disabled={this.props.disable}
                                    >
                                        {this.props.staffList.map(staff => (
                                            <MenuItem value={staff._id}>
                                                {staff.displayName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <IconButton color="secondary" onClick={this.props.removeBooking} aria-label="close" disabled={this.props.disable}>
                        <CloseIcon />
                    </IconButton>
                </ListItem>
            </Paper>
        )
    }
}
export default withStyles(styles)(SelectService);