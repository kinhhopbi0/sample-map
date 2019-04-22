

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


var pos = ol.proj.fromLonLat([105.772597, 21.036241]);

// Vienna marker
var marker = new ol.Overlay({
    position: pos,
    positioning: 'center-center',
    element: document.getElementById('marker'),
    stopEvent: false
});
map.addOverlay(marker);

setTimeout(function () {
    console.log("timeout");
    var pos2 = ol.proj.fromLonLat([106.772597, 21.536241]);
    // marker.position = pos2;
    // marker.setGeometry(new ol.geom.Point(pos2));
    // marker.moveTo();
    console.log("timeout---end");
}, 4000);


$(document).ready(function(){
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


    var meberUser = database.ref('online-members');
    meberUser.on('value', function(snapshot) {
        console.log("online-members changed");

    });
});