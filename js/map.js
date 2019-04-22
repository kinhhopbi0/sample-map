

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([105.772597, 21.036241]),
        zoom: 12
    })
});



$(document).ready(function(){

    function addMarker(lat, long, userName, imageUrl){
        console.log("add marker long: " + long + ", lat: " + lat);
        var pos = ol.proj.fromLonLat([parseFloat(long), parseFloat(lat)]);
        console.log(pos);

        var marker = new ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: document.getElementById('marker'),
            stopEvent: false
        });
        map.addOverlay(marker);
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


        for (const [key, value] of Object.entries(onlineUsers)) {
            console.log(key, value);
            addMarker(value.lat, value.long, value.user_name, value.img_url);
        }
    });
});