import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';
import { faceAPIAddPerson } from './faceAPI';
import { fetchAPI, getClient, removeClient } from '../../utils';
import KioskLayout from '../../Component/Kiosk/KioskLayout/KioskLayout';

const STORAGE_URL = 'https://projectspa.blob.core.windows.net/spacontainer';

const videoConstraints = {
    width: 800,
    height: 600,
    facingMode: 'user',
};


const styles = theme => ({
    root: {
        height: 180,
    },
    submit: {
        margin: theme.spacing(5),
    },
});

class FacialLogin extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            takingPicture: true,
        }
        this.webcam = React.createRef();
        this.canvasPicWebCam = React.createRef();
    }

    capture = () => {
        this.setState({ takingPicture: false })
        const imageUrl = this.webcam.current.getScreenshot();
        const ctx = this.canvasPicWebCam.current.getContext("2d");
        var image = new Image();

        image.onload = async () => {
            ctx.drawImage(image, 0, 0);
        };
        image.src = imageUrl;
        this.setState({ imageUrl: imageUrl })
    };

    createUser() {
        const userid = getClient();
        let data = {
            imagebase64: this.state.imageUrl,
            id: userid
        };
        fetchAPI('POST', 'kioskMgt/savephoto', data).then(respObj => {
            if (respObj && respObj.ok) {
                faceAPIAddPerson(`${STORAGE_URL}/${data.id}.jpg`, data.id);
                removeClient();
                this.props.history.push('/start')
            } else {
                Swal.fire({
                    type: 'error',
                    title: "Opps... Something Wrong...",
                    text: respObj.error
                })
            }
        }).catch(error => {
            Swal.fire({
                type: 'error',
                title: "Opps... Something Wrong...",
                text: error
            })
        });
    }

    render() {
        const { classes } = this.props;
        let showCanvas, showWebcam, button;
        if (this.state.takingPicture) {
            showWebcam = { display: 'block' }
            showCanvas = { display: 'none' }
        } else {
            showWebcam = { display: 'none' }
            showCanvas = { display: 'block' }
        }

        if (this.state.takingPicture) {
            button = [
                <Button variant="contained" color="primary" fullWidth className={classes.submit}
                    style={{ display: 'block', fontSize: 40 }} onClick={() => {
                        this.setState({ takingPicture: false })
                        // this.capture();
                        this.props.history.push('/snapshot');
                    }}
                >
                    Auto Mode
                </Button>,
                <Button variant="contained" color="primary" fullWidth
                    style={{ display: 'block', fontSize: 40 }} onClick={this.capture}
                >
                    Take A Snapshot
            </Button>
            ]

        } else {
            button = [
                <Button key="btnRetake" variant="contained" color="primary" fullWidth className={classes.submit}
                    style={{ display: 'block', fontSize: 40, paddingTop: 10 }} onClick={() => this.setState({ takingPicture: true })}
                >
                    Retake A Snapshot
                </Button>,
                <Button key="btnDone" variant="contained" color="primary" fullWidth
                    style={{ display: 'block', fontSize: 40, paddingTop: 10 }} onClick={() => this.createUser()}
                >
                    Done
                </Button>
            ]
        }
        return (
            <KioskLayout {...this.props} imageWidth={320} imagePadding={40} skip={true}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Webcam
                        style={showWebcam}
                        audio={false}
                        height={480}
                        ref={this.webcam}
                        screenshotFormat="image/jpg"
                        width={600}
                        videoConstraints={videoConstraints}
                    />
                    <canvas ref={this.canvasPicWebCam} width={600} height={480} style={showCanvas} />
                    {button}
                </div>
            </KioskLayout>
        );
    }
}

export default withStyles(styles)(FacialLogin);
