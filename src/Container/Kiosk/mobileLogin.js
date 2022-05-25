import React from 'react';
import { withStyles } from '@material-ui/styles';
import {
    Button, Typography, Dialog, DialogContent, Slide, TextField,
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Keyboard from "react-simple-keyboard";
import KioskLayout from '../../Component/Kiosk/KioskLayout/KioskLayout';
import { fetchAPI, setClient, setToken } from '../../utils';

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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class MobileLogin extends React.Component {
    state = {
        layoutName: "default",
        input: {},
        inputName: "mobile",
        keyboardOpen: false,
    };

    onChangeAll = inputObj => {
        this.setState({
            input: inputObj
        });
    };

    onKeyPress = button => {
        if (button === "{enter}") {
            this.setState({
                keyboardOpen: false
            });
        } else if (button === "{clear}") {
            this.clearScreen();
        }
    };

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

    setActiveInput = () => {
        this.setState(
            {
                keyboardOpen: true
            },
        );
    };

    handleKeyboardClose = () => {
        this.setState({ keyboardOpen: false });
    }

    login = async () => {
        const { input } = this.state;

        if (!input.mobile) {
            Swal.fire({
                type: 'error', text: 'Please enter mobile number',
                title: "Error"
            })
            return;
        } else if (input.mobile.length < 8) {
            Swal.fire({
                type: 'error', text: 'Mobile must be 8 digit',
                title: "Error"
            })
            return;
        }
        fetchAPI('GET', `kioskMgt/mobilelogin/${input.mobile}`).then(respObj => {
            if (respObj && respObj.ok) {
                setToken(respObj.token);
                setClient(respObj.user);
                this.props.history.push('/clientdetails');
            } else {
                Swal.fire({
                    type: 'error', text: 'Please try again.',
                    title: respObj.error
                })
            }
        }).catch(error => {
            Swal.fire({
                type: 'error', text: 'Please try again.',
                title: error
            })
        })
    }

    render() {
        const { classes } = this.props;
        const { input } = this.state;


        return (
            <KioskLayout {...this.props} imageWidth={200} imagePadding={10} displayName={this.state.displayName}>

                <div style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }} >
                    <div style={{ display: "block" }} >
                        <Typography style={{ fontSize: 50, }} color="primary">
                            Login
                            </Typography>
                        <form style={{ flexDirection: 'column', alignItems: 'center', display: 'flex', minWidth: 600 }}>
                            <TextField style={{ backgroundColor: "#f2f1ed" }} autoComplete='off'
                                InputProps={{ style: { fontSize: mainFontSize } }} InputLabelProps={{ style: { fontSize: mainFontSize } }}
                                variant="outlined" margin="normal" fullWidth
                                name="mobile" label="Mobile" type="number"
                                onClick={this.setActiveInput}
                                value={input["mobile"] || ""}
                                onChange={e => this.onChangeInput(e)}
                            />
                            <Button variant="contained" color="primary" fullWidth className={classes.login}
                                style={{ fontSize: mainFontSize }} onClick={this.login}
                            >
                                Login
                        </Button>
                        </form>
                    </div>
                </div>
                <Dialog
                    fullWidth
                    maxWidth="xl"
                    style={{ fontSize: mainFontSize }}
                    open={this.state.keyboardOpen}
                    onEnter={() => {
                        //clear the display value when open
                        var value = this.refs.displayValue;
                        value.children[0].children[0].value = '';
                    }}
                    onClose={this.handleKeyboardClose}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent>
                        <div>
                            <TextField fullWidth InputProps={{ style: { fontSize: mainFontSize } }} InputLabelProps={{ style: { fontSize: mainFontSize } }}
                                ref="displayValue" value={input[this.state.inputName]} placeholder={"Tap to start"} onChange={e => this.onChangeAll(e)} />
                            <Keyboard
                                keyboardRef={r => (this.keyboard = r)}
                                inputName={this.state.inputName}
                                layoutName={this.state.layoutName}
                                onChangeAll={inputObj => this.onChangeAll(inputObj)}
                                onKeyPress={button => this.onKeyPress(button)}
                                theme={"hg-theme-default hg-layout-default myTheme"}
                                layout={{
                                    default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"],
                                }}
                                display={{
                                    '{bksp}': 'Bksp',
                                    '{enter}': 'Enter',
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </KioskLayout>
        );
    }
}

export default withStyles(styles)(MobileLogin);
