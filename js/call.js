
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
        peer = new Peer(uniqueId, keyConfig);
        console.log("id: " + uniqueId);

        console.log("peer:");
        console.log(peer);

        initVideoPlayer();


        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(localStream => {
            localStreamView.srcObject = localStream;

            // var call = peer.call('vinhpd94739', stream);
            //
            // call.on('stream', function(remoteStream) {
            //     const video = document.getElementById("remoteVideo");
            //     video.srcVideo = remoteStream;
            //     console.log("on stream...");
            // });

            peer.on('call', function(call) {
                // Answer the call, providing our mediaStream
                call.answer(localStream);

                call.on('stream', function(remoteStream) {
                    remoteStreamView.srcObject = remoteStream;
                    console.log("on stream of receiver");
                });
                console.log("on call of receiver");
            });



        }).catch(err => console.log(err));


    }

    function callRtc(remoteId){
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(localStream => {
            localStreamView.srcObject = localStream;

            const call = peer.call(remoteId, localStream);

            call.on('stream', function(remoteStream) {
                remoteStreamView.srcObject = remoteStream;
                console.log("on stream of caller");
            });


        }).catch(err => console.log(err));
    }

    // initRtc();

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