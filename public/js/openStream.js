function openStream(cb) {
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices.getUserMedia({
        audio: {
            volume: 0.4,
            echoCancellation: true,
            noiseSuppression: true
        },
        video: true
    })
        .then(stream => {
            cb(stream);
        })
        .catch(err => console.log(err));
}

function openCall(cb) {
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices.getUserMedia({
        audio: {
            volume: 0.4,
            echoCancellation: true,
            noiseSuppression: true
        },
        video: false
    })
        .then(stream => {
            cb(stream);
        })
        .catch(err => console.log(err));
}

function openVideo(cb) {
    navigator.getUserMedia = navigator.getUserMedia;
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
        .then(stream => {
            cb(stream);
        })
        .catch(err => console.log(err));
}