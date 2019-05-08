
$(document).ready(function(){
    var localStreamView = null;
    var remoteStreamView = null;
    var peer = null;

    function initVideoPlayer() {
        localStreamView = document.getElementById("localVideo");
        localStreamView.onloadedmetadata = function(){
            localStreamView.play();
            console.log("played local stream");
        };


        remoteStreamView = document.getElementById("remoteVideo");
        remoteStreamView.onloadedmetadata = function(){
            remoteStreamView.play();
            console.log("played remote stream");
        };

    }

    function initRtc() {
        const peerJsConfig = {
            host: "vinhpd-peerjs-server.herokuapp.com",
            port: 443,
            secure: true,
            key: "peerjs"
        };
        const keyConfig =  {key: 'lwjd5qra8257b9'};

        const uniqueId = Math.random().toString(36).substring(2)
            + (new Date()).getTime().toString(36);
        const roomId = "com_cmc_tracking_app_" + uniqueId;

        peer = new Peer(roomId, keyConfig);


        console.log("init client peer id: " + roomId);

        console.log(peer);

        initVideoPlayer();


        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(localStream => {
            localStreamView.srcObject = localStream;

            const hash = window.location.hash;
            if(hash){
                console.log("make call after");
                const remoteId = hash.replace("#", "");
                console.log("calling to peer id: " + remoteId);

                const call = peer.call(remoteId, localStream);

                call.on('stream', function(remoteStream) {
                    remoteStreamView.srcObject = remoteStream;
                    console.log("on stream of caller");
                });

            }else {
                console.log("waiting call before");
                peer.on('call', function(call) {
                    console.log("on call of receiver");
                    call.answer(localStream);

                    call.on('stream', function(remoteStream) {
                        remoteStreamView.srcObject = remoteStream;
                        console.log("on stream of receiver");
                    });

                });
            }

        }).catch(err => console.log(err));


    }

    // function callRtc(remoteId){
    //     navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(localStream => {
    //         localStreamView.srcObject = localStream;
    //
    //
    //
    //     }).catch(err => console.log(err));
    // }

    initRtc();

    $('.btn-call').on('click', function () {
        console.log("btn-call click");
        var remoteId = $('#remoteId').val();
        console.log("call remote id: "  + remoteId);
        callRtc(remoteId);

    })
});



// var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// getUserMedia({video: false, audio: true}, function(stream) {
//
// }, function(err) {
//     console.log('Failed to get local stream' ,err);
// });