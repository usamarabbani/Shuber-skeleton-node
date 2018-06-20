function getLatLon() {
    var nw = {"lat": 37.469168, "lon": -122.045672};
    var se = {"lat": 37.125515, "lon": -121.589153};

    var ptLat = Math.random() * (se.lat - nw.lat) + nw.lat;
    var ptLng = Math.random() * (se.lon - nw.lon) + nw.lon;

    return {"lat": ptLat, "lon": ptLng};
}

exports.import = function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');

    var dataJSON = require('../public/fakedata.json');

    for (var i = 0; i < dataJSON.length; i++) {
        var point = getLatLon();
        collection.insert({
                "username": dataJSON[i].username,
                "email": dataJSON[i].useremail,
                "latitude": point.lat,
                "longitude": point.lon,
                "is_driver": dataJSON[i].is_driver,
                "is_busy": dataJSON[i].is_busy
        }, function (err, doc) {
            if (err) {
                res.send("There was an issue with adding the new information to the database.");
            } else {
                res.send("Data imported successfully!"); 
            }
        }); 
    };

};