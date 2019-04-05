function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
var userName = JSON.parse(b64_to_utf8(sessionStorage.getItem('auth')))[0].userName;
var checkCall = document.getElementById('checkcall').value;
var nguoiNhan = document.getElementById('userName').value;
var hoTen = document.getElementById('hoTen').value;

const connecttion = {
    host: 'peerjssever.herokuapp.com',
    port: 443,
    secure: true,
    key: 'peerjs'
};
const peer = new Peer(connecttion);
var chapnhan = 0;
peer.on('open', (id) => {
    var peerID = id;
    socket.emit('user-login', { userName, peerID });
    if (checkCall == 0 || checkCall == 3) {
        socket.emit('start-videocall', { nguoiNhan, peerID, userName });
    }
    if (checkCall == 1 || checkCall == 2) {
        socket.emit('videocall', { nguoiNhan, userName, checkCall });
    }
});
setTimeout(function () {
    if (chapnhan == 0 && (checkCall == 0 || checkCall == 3)) {
        socket.emit('stop-call', nguoiNhan);
        this.close();
    }
}, 40 * 1000);


socket.on('user-stop-call', (data) => {
    this.close();
})

socket.on('server-start-videocall', (data) => {
    var html = `<audio autoplay Loop preload>
                    <source src="audio/phone_calling.mp3" type="audio/mpeg">
                </audio>`;
    $('#LocalVideo').append(html);
    if (checkCall == 1) {
        $('.video').css("display", "block");
        $('.FriendVideo').css("display", "none");
        $('.div-end-Call').css("display", "block");
        openStream(stream => {
            playVideo(stream, 'LocalStream');
            const call = peer.call(data.peerID, stream);
            call.on('stream', remoteStream => {
                $('.FriendVideo').css("display", "block");
                playVideo(remoteStream, 'FriendStream');
                $('.calling').css("display", "none");
                $('audio').remove();
            });
            window.existingCall = call;
            localStream = stream;
            call.on('close', () => {
                localStream.getVideoTracks()[0].stop();
                localStream.getAudioTracks()[0].stop();
            })
        });
    } else {
        openCall(stream => {
            $('.div-end-Call').css("display", "block");
            const call = peer.call(data.peerID, stream);
            call.on('stream', remoteStream => {
                playVideo(remoteStream, 'FriendStream');
                $('.calling').css("display", "none");
                $('audio').remove();
            });
            window.existingCall = call;
            localStream = stream;
            call.on('close', () => {
                localStream.getAudioTracks()[0].stop();
            })
        });
    }
})

peer.on('call', (call) => {
    var html = `<audio autoplay Loop preload>
                    <source src="audio/phone_ringtone.mp3" type="audio/mpeg">
                </audio>`;
    $('#LocalVideo').append(html);
    $('#btnChapNhan').click(() => {
        $('.btnStop').css("display", "block");
        $('.calling').css("display", "none");
        $('.video').css("display", "block");
        $('.div-end-Call').css("display", "block");
        $('audio').remove();
        chapnhan = 1;
        if (checkCall == 0) {
            openStream(stream => {
                playVideo(stream, 'LocalStream');
                call.answer(stream);
                call.on('stream', remoteStream => {
                    playVideo(remoteStream, 'FriendStream');
                });
                window.existingCall = call;
                FriendStream = stream;
            });
            call.on('close', () => {
                FriendStream.getVideoTracks()[0].stop();
                FriendStream.getAudioTracks()[0].stop();
            })
        } else {
            openCall(stream => {
                call.answer(stream);
                call.on('stream', remoteStream => playVideo(remoteStream, 'FriendStream'));
                window.existingCall = call;
                FriendStream = stream;
            });
            call.on('close', () => {
                FriendStream.getAudioTracks()[0].stop();
            })
        }
    });
    $('#btnTuChoi').click(() => {
        socket.emit('stop-call', nguoiNhan);
        this.close();
        $('audio').remove();
    });
});
$('#btnTuChoi1').click(() => {
    socket.emit('stop-call', nguoiNhan);
    this.close();
    $('audio').remove();
});
$('#btnTuChoi2').click(() => {
    socket.emit('stop-call', nguoiNhan);
    this.close();
    $('audio').remove();
});
