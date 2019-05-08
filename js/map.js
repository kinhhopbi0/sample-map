
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 21.036, lng: 105.772},
        zoom: 14
    });
}

$(document).ready(function(){
    var listMarker = {};
    var listPopup = {};

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA70nuqyypEmN7f_hw3cSJ6NhVtDxYxtzI",
        authDomain: "meber-tracking.firebaseapp.com",
        databaseURL: "https://meber-tracking.firebaseio.com",
        projectId: "meber-tracking",
        storageBucket: "meber-tracking.appspot.com",
        messagingSenderId: "764503948585"
    };
    firebase.initializeApp(config);
    var database = firebase.database();


    $('body').on("click", ".btn-make-call", function () {
       const username = $(this).attr('data-username');
        const uniqueId = Math.random().toString(36).substring(2)
            + (new Date()).getTime().toString(36);
       const callId = "com_cmc_tracking_call_" + uniqueId;
       const urlCall = "https://appr.tc/r/" + callId;
       window.open(urlCall);

       // notify client:
        database.ref('online-users/' + username + '/' + 'calling-info').set({
            "call-id": callId,
            "status": "ringing"
        });

    });

    function addMarker(lat, long, userName, imageUrl){
        console.log("add marker long: " + long + ", lat: " + lat);

        var marker = listMarker[userName];
        var userPos = {lat: parseFloat(lat), lng: parseFloat(long)};
        // popup
        var contentString =
            '<div class="map-marker-container">' +
            '<div id="marker" title="Marker">' +
            `<img class="img-avatar" src="${imageUrl}" alt="Avatar">` +
            `<span>${userName}</span>` +
            `<a href="#" class="btn-make-call" data-username="${userName}"><img class="img-call" src="img/phone-call.png" ></a>` +
            '</div>' +
            '</div>';

        if(marker){
            marker.setPosition(userPos);
            var olInfoWindow = listPopup[userName];
            olInfoWindow.setContent(contentString);
        }else {
            marker = new google.maps.Marker({
                position: userPos,
                map: map,
                title: userName
            });
            listMarker[userName] = marker;

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
            listPopup[userName] = infowindow;
        }
    }

    function removeMaker(userName){
        console.log("clear user name: " + userName);
        listMarker[userName].setMap(null);
    }

    function clearAllMaker() {
        console.log("clear maker");
        for (const [key, value] of Object.entries(listMarker)) {
            value.setMap(null);
        }
    }


    var meberUser = database.ref('online-users');
    meberUser.on('value', function(snapshot) {
        console.log("online-users changed");
        const onlineUsers = snapshot.val();


        if(!onlineUsers){
            clearAllMaker()
        }else {
            for (const [key, value] of Object.entries(onlineUsers)) {
                console.log(key, value);
                var trackingInfo = value['tracking-info'];
                addMarker(trackingInfo.lat, trackingInfo.long, trackingInfo.user_name, trackingInfo.img_url);
            }

            for (const [key, value] of Object.entries(listMarker)) {
                if(!onlineUsers.hasOwnProperty(key)){
                    removeMaker(key);
                }
            }
        }

    });
});