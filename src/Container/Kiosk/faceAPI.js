
const axios = require('axios');
const uriBase = 'https://spa-fr.cognitiveservices.azure.com/face/v1.0';
const subscriptionKey = '5463be0170e742d98bf5b3606727fbdb';

export const faceAPITrainStatus = () => {
    const fullUrl = `${uriBase}/persongroups/1/training`
    const options = {
        method: 'GET',
        url: fullUrl,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    axios(options).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.log('Error: ', error);
    });
}

export const faceAPITrain = () => {
    const fullUrl = `${uriBase}/persongroups/1/train`
    const options = {
        method: 'POST',
        url: fullUrl,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    axios(options).then(response => {
        console.log(response.data);
    }).catch(error => {
        console.log('Error: ', error);
    });
}

export const faceAPIAddFace = (personId, imageUrl) => {
    const fullUrl = `${uriBase}/persongroups/1/persons/${personId}/persistedFaces`
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
        // response.data;
        faceAPITrain();
        console.log(response.data);
    }).catch(error => {
        console.log('Error: ', error);
    });
}

export const faceAPIAddPerson = (imageUrl, userid) => {
    const fullUrl = `${uriBase}/persongroups/1/persons`
    const options = {
        method: 'POST',
        url: fullUrl,
        data: { name: userid },
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    axios(options).then(response => {
        faceAPIAddFace(response.data.personId, imageUrl)
        console.log(response.data.personId);
    }).catch(error => {
        console.log('Error: ', error);
    });
}

export const faceAPIIdentify = (faceIdData) => {
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
        console.log(response);
    }).catch(error => {
        console.log('Error: ', error);
    });

}

export const faceAPIDetect = (imageUrl) => {
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
        console.log(response.data);
        faceAPIIdentify(response.data);
    }).catch(error => {
        console.log('Error: ', error);
    });
}