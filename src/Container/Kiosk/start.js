import React from 'react';
import { Animated } from "react-animated-css";
import { ButtonBase, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { removeToken, removeLocalStorage, removeClient } from '../../utils';
import KioskLayout from '../../Component/Kiosk/KioskLayout/KioskLayout';
import Swal from 'sweetalert2'
import LoginImage from '../../images/login.png';
import RegisterImage from '../../images/register.png';


const styles = theme => ({
    root: {
        height: 180,
    },
    container: {
        display: 'flex',
    },
    paper: {
        margin: theme.spacing(1),
    },
    svg: {
        width: 100,
        height: 100,
    },
    polygon: {
        fill: theme.palette.common.white,
        stroke: theme.palette.divider,
        strokeWidth: 1,
    },
    button: {
        height: "10%",
        width: "20%",
    },
    image: {
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: '100% !important', // Overrides inline-style
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
});

class FacialLogin extends React.Component {

    componentDidMount() {
        try {
            removeLocalStorage("userid");
            removeToken();
            removeClient();
        } catch (error) {
            Swal.fire({
                type: 'error',
                title: "Opps... Something Wrong...",
                text: error
            })
        }
    }

    handleRegisterClick = () => {
        const { history } = this.props;
        setTimeout(function () {
            history.push('/register');
        }, 500);
    }

    handleFacialLoginClick = () => {
        const { history } = this.props;
        setTimeout(function () {
            history.push('/mobilelogin');
        }, 500);
    }

    render() {
        const { classes } = this.props;
        return (
            <KioskLayout {...this.props} imageWidth={320} imagePadding={50} homePage={true} >
                <Grid
                    container
                    spacing={5}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Animated animationInDelay={500} animationIn="bounceInLeft" animationOut="fadeOut" >
                            <ButtonBase
                                focusRipple
                                className={classes.image}
                                focusVisibleClassName={classes.focusVisible}
                                style={{
                                    width: 300,
                                    height: 360,
                                }}
                                onClick={this.handleRegisterClick}
                            >
                                <span
                                    className={classes.imageSrc}
                                    style={{
                                        backgroundImage: `url(${RegisterImage})`,
                                    }}
                                />
                            </ButtonBase>
                        </Animated>
                    </Grid>
                    <Grid item>
                        <Animated animationInDelay={500} animationIn="bounceInRight" animationOut="fadeOut">
                            <ButtonBase
                                focusRipple
                                className={classes.image}
                                focusVisibleClassName={classes.focusVisible}
                                style={{
                                    width: 300,
                                    height: 360,
                                }}
                                onClick={this.handleFacialLoginClick}
                            >
                                <span
                                    className={classes.imageSrc}
                                    style={{
                                        backgroundImage: `url(${LoginImage})`,
                                    }}
                                />
                            </ButtonBase>
                        </Animated>
                    </Grid>
                </Grid>
            </KioskLayout>
        );
    }
}

export default withStyles(styles)(FacialLogin);
