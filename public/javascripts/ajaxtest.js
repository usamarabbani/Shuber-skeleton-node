if (document.getElementById('ajaxtest')) {
	initMap();
}

var map; 
function initMap() {
	map = new google.maps.Map(document.getElementById('ajaxtest'), {
		center: {lat: 37.332653, lng: -121.880462}, 
		zoom: 14
	});
}	 