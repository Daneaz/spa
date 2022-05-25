import React from 'react';
import { Animated } from "react-animated-css";
import { Paper, IconButton, Button, Typography } from '@material-ui/core';
import { Home as HomeIcon } from '@material-ui/icons';
import Swal from 'sweetalert2';
import BackGroundImage from '../../../images/kiosk_bg.png';

const HomeButton = (props) => {
    if (!props.homePage) {
        return (
            <IconButton onClick={() => { props.history.push('/start'); }} color="primary" style={{ position: 'fixed', top: 50, left: 50 }}>
                <HomeIcon style={{ height: 50, width: 50 }} />
            </IconButton>
        )
    } else {
        return null;
    }
}

const SkipButton = (props) => {
    if (props.skip) {
        return (
            <Button onClick={() => {
                props.history.push('/start');
                Swal.fire({
                    type: 'success', text: "Register Success",
                    title: "Success!"
                })
            }} color="primary" style={{ position: 'fixed', fontSize: 30, right: 50, top: 50 }}>
                Skip
            </Button>
        )
    } else {
        return null;
    }
}

const WelcomeMessage = (props) => {
    if (props.displayName) {
        return (
            <Typography style={{ fontSize: 50, position: 'fixed', top: props.imageWidth + props.imagePadding }} color="primary">
                Welcome {props.displayName}
            </Typography>
        );
    }
    else {
        return null;
    }
}



const KioskLayout = (props) => {
    return (
        <div>
            <Animated animationIn="fadeIn" animationOut="fadeOut">
                <Paper style={{ zIndex: -1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100vh", backgroundImage: `url(${BackGroundImage})` }}>
                    <img src={require('../../../images/logo.png')} alt="" style={{ width: props.imageWidth, position: 'fixed', top: props.imagePadding }} />
                    <WelcomeMessage {...props} displayName={props.displayName} />
                    <HomeButton {...props} homePage={props.homePage} />
                    <SkipButton {...props} skip={props.skip} />
                    {props.children}
                </Paper>
            </Animated>
        </div>
    )
}

export default KioskLayout;
