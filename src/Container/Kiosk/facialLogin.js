import React from 'react';
import {
    Button, Typography,
} from '@material-ui/core';
import KioskLayout from '../../Component/Kiosk/KioskLayout/KioskLayout';
import SelectService from '../../Component/Kiosk/Checkout/Checkout'
import { withStyles } from '@material-ui/styles';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import { fetchAPI, setToken, setClient } from '../../utils';
import Swal from 'sweetalert2';

const axios = require('axios');
const uriBase = 'https://spa-fr.cognitiveservices.azure.com/face/v1.0';
const subscriptionKey = '5463be0170e742d98bf5b3606727fbdb';
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

class FacialLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            takingPicture: true,
            timerOn: false,
            timerTime: 3000,
            displayName: '',
            login: false,
        }
        this.webcam = React.createRef();
        this.canvas = React.createRef();
    }

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
                })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    startTimer = () => {
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
        });
        this.timer = setInterval(() => {
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
        clearInterval(this.timer);
        this.setState({ timerOn: false, timerTime: 3000 });
    };

    getTL(v) {
        v -= 70;
        return ((v <= 0) ? 0 : v);
    }
    getBR(v, x) {
        v += 70;
        if (x) { return ((v > 640) ? 640 : v) }
        else { return ((v > 480) ? 480 : v) }
    }

    faceAPIVerify(faceId, personId) {
        const fullUrl = `${uriBase}/verify`

        const options = {
            method: 'POST',
            url: fullUrl,
            data: {
                personGroupId: "1",
                faceId: faceId,
                personId: personId,
            },
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
        axios(options).then(response => {
            if (response.error) {
                this.setState({ takingPicture: true });
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Authendication fail!',
                    showCancelButton: true,
                    confirmButtonText: 'Re-try!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true,
                    animation: false,
                    customClass: {
                        popup: 'animated tada'
                    },
                    preConfirm: () => {
                        return setTimeout(() => this.startDetection(), 500);
                    }
                })
                // return setTimeout(() => this.startDetection(), 500);
            }
            console.log("Verify:")
            console.log(response.data)
            if (response.data.isIdentical) {
                this.faceAPIGetPersonId(personId);
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Authendication fail!',
                    showCancelButton: true,
                    confirmButtonText: 'Re-try!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true,
                    animation: false,
                    customClass: {
                        popup: 'animated tada'
                    },
                    preConfirm: () => {
                        return setTimeout(() => this.startDetection(), 500);
                    }
                })
            }
        }).catch(error => {
            console.log('Error: ', error);
        });
    }

    faceAPIGetPersonId(personId) {
        const fullUrl = `${uriBase}/persongroups/1/persons/${personId}`

        const options = {
            method: 'GET',
            url: fullUrl,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
        axios(options).then(response => {
            fetchAPI('GET', `kioskMgt/faciallogin/${response.data.name}`).then(respObj => {
                if (respObj && respObj.ok) {
                    console.log("Client: ")
                    console.log(respObj)
                    setToken(respObj.token);
                    setClient(respObj.user);
                    this.setState({
                        displayName: respObj.user.displayName,
                        login: true,
                    })
                } else {
                    Swal.fire({
                        type: 'error', text: 'Please try again.',
                        title: "Authentication fail!",
                        preConfirm: () => {
                            return setTimeout(() => this.startDetection(), 500);
                        }
                    })
                }
            })
        }).catch(error => {
            console.log(error)
            Swal.fire({
                type: 'error', text: 'Please try again.',
                title: "Authentication fail!",
                preConfirm: () => {
                    return setTimeout(() => this.startDetection(), 500);
                }
            })
        });
    }

    faceAPIIdentify(faceIdData) {
        let faceIds = [];
        for (let i = 0; i < faceIdData.length; i++) {
            faceIds.push(faceIdData[i].faceId)
        }
        const fullUrl = `${uriBase}/identify`

        const options = {
            method: 'POST',
            url: fullUrl,
            data: {
                personGroupId: "1",
                faceIds: faceIds,
                maxNumOfCandidatesReturned: 1,
            },
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
        axios(options).then(response => {
            if (response.error) {
                this.setState({ takingPicture: true });
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Authendication fail!',
                    showCancelButton: true,
                    confirmButtonText: 'Re-try!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true,
                    animation: false,
                    customClass: {
                        popup: 'animated tada'
                    },
                    preConfirm: () => {
                        return setTimeout(() => this.startDetection(), 500);
                    }
                })
                // return setTimeout(() => this.startDetection(), 500);
            }
            console.log("Identify: ")
            console.log(response.data)
            if (response.data[0].candidates[0]) {
                this.faceAPIVerify(response.data[0].faceId, response.data[0].candidates[0].personId)
            } else {
                Swal.fire({
                    type: 'error', text: 'Please try again.',
                    title: "Authentication fail!",
                    preConfirm: () => {
                        return setTimeout(() => this.startDetection(), 500);
                    }
                })

            }
        }).catch(error => {
            console.log('Error: ', error);
        });
    }

    faceAPIDetect(imageUrl) {
        const fullUrl = `${uriBase}/detect?returnFaceId=true`
        const options = {
            method: 'POST',
            url: fullUrl,
            data: { url: imageUrl },
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };

        axios(options).then(response => {
            console.log("Detect: ")
            console.log(response.data)
            this.faceAPIIdentify(response.data);
        }).catch(error => {
            console.log('Error: ', error);
        });
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
            let data = {};
            data.imagebase64 = imageUrl;
            data.id = "auth";
            const respObj = await fetchAPI('POST', 'kioskMgt/savephoto', data);
            if (respObj && respObj.ok) {
                this.faceAPIDetect(`${STORAGE_URL}/${data.id}.jpg`);
            } else {
                Swal.fire({
                    type: 'error', text: 'Please try again.',
                    title: "Authentication fail!",
                    preConfirm: () => {
                        return setTimeout(() => this.startDetection(), 500);
                    }
                })
            }
        } catch (error) {
            Swal.fire({
                type: 'error', text: 'Please try again.',
                title: "Authentication fail!",
                preConfirm: () => {
                    return setTimeout(() => this.startDetection(), 500);
                }
            })
        }
    };

    render() {
        let displayText;
        if (this.state.timerOn) {
            displayText = `Identifying, please keep still`
        } else {
            displayText = `Face not detected, adjust your position...`
        }

        return (
            <KioskLayout {...this.props} imageWidth={200} imagePadding={40} displayName={this.state.displayName}>
                <div style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
                    {!this.state.login ?
                        <div style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }} >
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
                                <Typography style={{ fontSize: 30, fontWeight: 500 }} align="center" color="primary" >
                                    {displayText}
                                </Typography>
                            </div>
                            <Button onClick={() => { this.props.history.push('/mobilelogin'); }} variant="outlined" color="primary" style={{ top: 30, fontSize: 30 }}>
                                Login By Mobile
                        </Button>
                        </div> : null
                    }
                    {this.state.login ?
                        <SelectService {...this.props} />
                        : null
                    }
                </div>
            </KioskLayout>
        );
    }
}

export default withStyles(styles)(FacialLogin);
