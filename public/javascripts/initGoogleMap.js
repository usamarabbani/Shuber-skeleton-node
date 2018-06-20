if (document.getElementById('map-canvas')) {
	initMap();
}

function createInitialMapMarkers(map) {
    driverLocations = {};

    var request = new Request('/api/drivers/', {
        method: 'GET', 
        mode: 'cors', 
        redirect: 'follow',
        headers: new Headers({
            'Content-Type': 'text/plain'
        })
    });

    fetch(request).then(function(response) { 
        // Convert to JSON
        return response.json();
    }).then(function(jsonResponse) {
        // Yay, `jsonResponse` is a JavaScript object
        console.log(jsonResponse);

        for (var i = 0; i < jsonResponse.length; i++) {
            var driverId = jsonResponse[i]._id;
            var driverPos = { lat: parseFloat(jsonResponse[i].latitude), lng: parseFloat(jsonResponse[i].longitude) };
            var image = '/images/car_64.png';
            var marker = new google.maps.Marker({
                position: driverPos,
                icon: image,
                map: map
            });
            driverLocations[driverId] = marker;

        }
        setInterval(function() { updateMapMarkers(map, driverLocations) }, 10000);
    });
}

function updateMapMarkers(map) {
    console.log(driverLocations);
    for(var driver in driverLocations) {
        if(driverLocations.hasOwnProperty(driver)) {
            console.log(driver); // driver_id
            console.log(driverLocations[driver]); // driver_marker

            var individualRequest = new Request('/api/drivers/' + driver, {
                method: 'GET', 
                mode: 'cors', 
                redirect: 'follow',
                headers: new Headers({
                    'Content-Type': 'text/plain'
                })
            });

            fetch(individualRequest).then(function(individualRequest) { 
                // Convert to JSON
                return individualRequest.json();
            }).then(function(jsonResponse) {
                // Yay, `jsonResponse` is a JavaScript object
                // console.log(jsonResponse);

                var driverId = jsonResponse._id;
                var driverPos = { lat: parseFloat(jsonResponse.latitude), lng: parseFloat(jsonResponse.longitude) };
                driverLocations[driver]['position'] = driverPos;
                driverLocations[driver].setPosition(driverPos);
            });
        }
    }
}

var map; 
function initMap() {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: {lat: 37.332653, lng: -121.880462}, 
		zoom: 11
	});

    createInitialMapMarkers(map);
}	 