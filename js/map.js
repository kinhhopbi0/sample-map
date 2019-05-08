
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
            `<a href="#"><img class="img-call" src="img/phone-call.png" ></a>` +
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


    var meberUser = database.ref('online-users');
    meberUser.on('value', function(snapshot) {
        console.log("online-users changed");
        const onlineUsers = snapshot.val();


        if(!onlineUsers){
            clearAllMaker()
        }else {
            for (const [key, value] of Object.entries(onlineUsers)) {
                console.log(key, value);
                addMarker(value.lat, value.long, value.user_name, value.img_url);
            }

            for (const [key, value] of Object.entries(listMarker)) {
                if(!onlineUsers.hasOwnProperty(key)){
                    removeMaker(key);
                }
            }
        }

    });
});