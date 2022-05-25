import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import { fetchAPI, getClient, removeClient } from '../../utils';
import { faceAPIAddPerson } from './faceAPI';
import Swal from 'sweetalert2';
import KioskLayout from '../../Component/Kiosk/KioskLayout/KioskLayout';

const STORAGE_URL = 'https://projectspa.blob.core.windows.net/spacontainer';
const MODEL_URL = '/models'

let faceBox = { detected: false, topLeftX: 0, topLeftY: 0, bottomRightX: 0, bottomRightY: 0 };

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

class Snapshot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            takingPicture: true,
            timerOn: false,
            timerTime: 3000,
            imageUrl: '',
        }
        this.webcam = React.createRef();
        this.canvas = React.createRef();
        this.canvasPicWebCam = React.createRef();
    }

    startTimer = () => {
        console.log("Start timer")
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
        });
        this.timer = setInterval(() => {
            console.log("in interval")
            const newTime = this.state.timerTime - 1000;
            if (newTime >= 0) {
                this.setState({
                    timerTime: newTime
                });
            } else {
                clearInterval(this.timer);
                this.setState({ timerOn: false });
            }
        }, 1000);
    };

    stopTimer = () => {
        console.log("stopTimer")
        clearInterval(this.timer);
        this.setState({ timerOn: false, timerTime: 3000 });
    };

    componentDidMount() {
        faceapi.loadFaceDetectionModel(MODEL_URL)
            .then(() => faceapi.loadTinyFaceDetectorModel(MODEL_URL)
                .then(() => {
                    setTimeout(() => this.startDetection(), 1000);
                })).catch(error => {
                    Swal.fire({
                        type: 'error',
                        title: "Opps... Something Wrong...",
                        text: error
                    })
                });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getTL(v) {
        v -= 70;
        return ((v <= 0) ? 0 : v);
    }
    getBR(v, x) {
        v += 70;
        if (x) { return ((v > 640) ? 640 : v) }
        else { return ((v > 480) ? 480 : v) }
    }



    startDetection = () => {
        try {
            const { timerTime, timerOn } = this.state;
            const canvas = document.getElementById('videoOverlay')
            let video = this.webcam.current;
            if (video && canvas && video.getCanvas()) {
                video = video.getCanvas();
                let inputSize = 512
                let scoreThreshold = 0.5
                faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).then((result) => {
                    if (result) {
                        if (!timerOn) {
                            this.setState({ timerTime: 3000 });
                            this.startTimer();
                        }
                        console.log(timerTime)
                        console.log("Result:  " + result);
                        canvas.width = video.width;
                        canvas.height = video.height;
                        canvas.style.display = "";
                        const dims = faceapi.matchDimensions(canvas, video, true)
                        faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims))
                        if (timerTime <= 0 && timerOn) {
                            if (result.box) {
                                let box = result.box;
                                faceBox.detected = true;
                                faceBox.topLeftX = this.getTL(box.x);
                                faceBox.topLeftY = this.getTL(box.y);
                                faceBox.bottomRightX = this.getBR((box.x + box.width), true);
                                faceBox.bottomRightY = this.getBR((box.y + box.height), false);
                            }
                            canvas.getContext('2d').drawImage(video, 0, 0);
                            this.capture(canvas.toDataURL('image/jpeg', 0.5))
                            return;
                        }
                        return setTimeout(() => this.startDetection(), 300);
                    } else {
                        console.log("not detected")
                        this.stopTimer();
                        canvas.style.display = "none"
                        return setTimeout(() => this.startDetection(), 300);
                    }
                });
            }
        } catch (error) {
            console.log(error)

        }
    }

    capture = async (imageUrl) => {
        try {

            console.log("capture")
            this.setState({ takingPicture: false })
            const taking = document.getElementById('photoTaking')
            const showing = document.getElementById('photoShowing')
            taking.style.display = 'none';
            showing.style.display = 'block';
            var photoCanvas = document.getElementById('showPhoto')
            var photoctx = photoCanvas.getContext("2d");
            var img = new Image();
            img.onload = async () => {
                photoctx.drawImage(img, 0, 0, photoCanvas.width, photoCanvas.height);
            };
            img.src = imageUrl;
            this.setState({ imageUrl: imageUrl })
        } catch (error) {
            console.log(error);
        }
    };

    retakePhoto() {
        console.log("retake")
        this.setState({ takingPicture: true });
        const taking = document.getElementById('photoTaking')
        const showing = document.getElementById('photoShowing')
        taking.style.display = 'block';
        showing.style.display = 'none'
        this.startDetection();
    }

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
        let displayText, button;
        if (this.state.timerOn) {
            displayText = `Keep still photo will be taken in ${this.state.timerTime / 1000}`
        } else {
            displayText = `Face not detected, adjust your position...`
        }
        if (this.state.takingPicture) {
            button = (
                <Button variant="contained" color="primary" fullWidth className={classes.submit}
                    style={{ display: 'block', fontSize: 40 }} onClick={() => {
                        this.setState({ takingPicture: false })
                        // this.capture();
                        this.props.history.push('/snapshotmanual');
                    }}
                >
                    Manual Mode
                </Button>
            );
        } else {
            button = [
                <Button key="btnRetake" variant="contained" color="primary" fullWidth className={classes.submit}
                    style={{ display: 'block', fontSize: 40 }} onClick={() => this.retakePhoto()}
                >
                    Retake A Snapshot
                </Button>,
                <Button key="btnDone" variant="contained" color="primary" fullWidth
                    style={{ display: 'block', fontSize: 40 }} onClick={() => this.createUser()}
                >
                    Done
                </Button>
            ]
        }

        return (
            <KioskLayout {...this.props} imageWidth={320} imagePadding={40} skip={true}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div id="photoTaking" >
                        <div style={{ height: 480, width: 600, alignItems: 'center' }}>
                            <Webcam
                                style={{ position: 'absolute', zIndex: 1 }}
                                audio={false}
                                height={480}
                                ref={this.webcam}
                                screenshotFormat="image/jpeg"
                                width={600}
                                videoConstraints={videoConstraints}
                            />
                            <canvas id='videoOverlay' ref={this.canvas} style={{ height: 480, width: 600, position: 'relative', zIndex: 2 }} />
                        </div>
                        <div>
                            <Typography style={{ fontSize: 30 }} align="center" color="primary" >
                                {displayText}
                            </Typography>
                        </div>
                    </div>
                    <div id="photoShowing" style={{ display: "none" }}>
                        <canvas id='showPhoto' style={{ height: 480, width: 600 }} />
                    </div>
                    {button}
                </div>
            </KioskLayout>
        );
    }
}

export default withStyles(styles)(Snapshot);
