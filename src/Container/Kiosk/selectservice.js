import React from 'react';
import { withStyles } from '@material-ui/styles';
import {
    Button, Typography, Dialog, DialogContent, Slide, TextField,
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Keyboard from "react-simple-keyboard";
import KioskLayout from '../../Component/Kiosk/KioskLayout/KioskLayout';
import SelectService from '../../Component/Kiosk/Checkout/Checkout'
import { fetchAPI, setClient, setToken, getClient } from '../../utils';

const mainFontSize = 35;

const styles = theme => ({
    root: {
        height: 180,
    },
    login: {
        margin: theme.spacing(3),
        minWidth: 220,
    },
    cancel: {
        margin: theme.spacing(3),
        minWidth: 220,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(3),
        minWidth: 500,
    },
    bold: {
        margin: theme.spacing(3),
        fontWeight: 500,
    },
});

class Appointment extends React.Component {
    state = {
        input: {},
    };

    componentDidMount() {
        try {
            let user = getClient();
            this.setState({ displayName: user.displayName })
        } catch (error) {
            Swal.fire({
                type: 'error',
                title: "Opps... Something Wrong...",
                text: error
            })
        }
    }

    onChangeInput = event => {
        let inputVal = event.target.value;

        let updatedInputObj = {
            ...this.state.input,
            [this.state.inputName]: inputVal
        };

        this.setState(
            {
                input: updatedInputObj
            },
            () => {
                this.keyboard.setInput(inputVal);
            }
        );
    };

    render() {
        const { classes } = this.props;
        const { input } = this.state;

        return (
            <KioskLayout {...this.props} imageWidth={200} imagePadding={10} displayName={this.state.displayName}>

                <div style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }} >
                    <SelectService {...this.props} />
                </div>

            </KioskLayout>
        );
    }
}

export default withStyles(styles)(Appointment);
