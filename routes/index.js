var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'shUber'
    });
});

function onSignIn(req, res, next, collection, userName) {
    // Query DB for matching credentials
    collection.find({
            "username": userName
        },
        // Results of query returned as a js array called doc
        function(err, doc) {
            if (err) {
                res.send("ERROR");
            } else {
                // console.log prints to terminal
                // where you did "npm start"
                console.log(doc);
                // If the array has elements, 
                // then there was a matching username in our db
                // so authenticate the user. 
                if (doc.length > 0) {
                    // Give the user a cookie. 
                    res.cookie('username', userName);
                    // Determine if user is a rider or driver
                    // Then redirect to right page
                    if (doc[0].is_driver == "true") {
                        res.redirect('loginsuccessfuldriver');
                    } else {
                        res.redirect('requestride');
                    }
                } else {
                    res.send("Unable to authenticate");
                }
            }
        }
    );
}

function onSignUp(req, res, collection) {
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userLat = req.body.userlat;
    var userLon = req.body.userlon;
    var driverCheckBox = req.body.drivercheckbox;
    var is_busy = false;

    // Make sure username is not empty 
    if (userName == "") {
        res.redirect('registration_failure');
    } else {
        // Query DB for matching credentials
        collection.find({
                "username": userName
            },
            function(err, doc) {
                if (err) {
                    res.send("ERROR");
                } else {
                    console.log(doc);
                    if (doc.length > 0) {
                        res.redirect('registration_failure');
                    } else {
                        // Submit to the DB
                        if (driverCheckBox == 'on') {
                            is_driver = true;
                        } else {
                            is_driver = false;
                        }
                        collection.insert({
                            "username": userName,
                            "email": userEmail,
                            "latitude": userLat,
                            "longitude": userLon,
                            "is_driver": is_driver,
                            "is_busy": is_busy
                        }, function(err, doc) {
                            if (err) {
                                // If it failed, then return an error
                                res.send("There was an issue with adding the new information to the database.");
                            } else {
                                // And forward over to the success page
                                //res.redirect("userlist");
                                res.redirect("signupsuccessful");
                            }
                        });
                    }
                }
            }
        );
    }
}

/* POST home page */
router.post('/', function(req, res, next) {
    // Get name of button that was pressed
    var button = req.body.buttonname;
    // Set local var for db
    var db = req.db;
    // Set local var for collection
    var collection = db.get('usercollection');
    // Get username from form. 
    var userName = req.body.username;

    // Do the right thing...
    if (button == "signin") {
        onSignIn(req, res, next, collection, userName);
    } else if (button == "signup") {
        onSignUp(req, res, next, collection);
    } else {
        res.send("Check POST home page");
    }
});

/* GET offyougo Page */
router.get('/offyougo', function(req, res) {
    var msg = "off u go";
    res.render('offyougo', {
        title: 'shUber',
        message: msg
    });
});

/* GET Assignment Page */
router.get('/assignment', function(req, res) {
    var msg = "This is your assignment.";
    res.render('assignment', {
        title: 'shUber',
        message: msg
    });
});

/* GET Assignment Complete Page */
router.get('/assignmentcomplete', function(req, res) {
    var msg = "Mission accomplished!";
    res.render('assignmentcomplete', {
        title: 'shUber',
        msg: msg
    });
});


/* GET Request Ride Page */
router.get('/requestride', function(req, res) {
    // Get cookie information 
    var cookieinfo = req.cookies.username;
    // Check if the user has a cookie.  
    if (cookieinfo) {
        // Prepare a personalized greeting for the user
        // using their cookie information. 
        var greeting = "Hi, " + cookieinfo + "!";

        res.render('requestride', {
            title: 'Request a Ride',
            greeting: greeting
        });
    } else {
        /* Cookie not valid */
        res.send('You need to <a href="/">sign in</a> first!');
    }
});

function addrToCoordinates(street, zip) {
    var coordinates = [37.302847, -121.914271]; // placeholder coordinates
    return coordinates;
}

/* POST Request Ride Page */
router.post('/requestride', function(req, res) {
    var bestTime = 9007199254740992;
    var distance = require('google-distance');
    var userlat = req.body.userlat;
    var userlon = req.body.userlon;
    var bestDriver = null;

    // Get customer's destination in coordinates
    // addrToCoordinates returns a js array containing [ lat, lon ] 
    var dest_coord = addrToCoordinates(req.body.userdestst, req.body.userdestzip);
    var dest_lat = dest_coord[0]
    var dest_lon = dest_coord[1]

    // Set local var for db
    var db = req.db;
    // Set local var for collection
    var collection = db.get('usercollection');
    // Query DB to find best driver 
	collection.find({ $and : [ { "is_driver" : "true" }, { "is_busy" : "false" } ] },
	/*
    collection.find({
            "is_driver": true,
            "is_busy": false
        },
		*/
        // Results of query returned as a js array called doc
        function(err, doc) {
            if (err) {
                res.send("ERROR");
            } else {
                console.log("found soeme drivers...");
                // console.log prints to terminal
                // where you did "npm start"
                bestDriver = doc[0];
                console.log(bestDriver);
                var promises = 0;
                doc.forEach(function(value) {
                    distance.get({
                            index: 1,
                            origin: userlat + ',' + userlon,
                            destination: value.latitude + ',' + value.longitude
                        },
                        function(err, data) {

                            if (err) {
                                return console.log(err);
                            }

                            var time = data.durationValue;

                            if (time < bestTime) {
                                bestTime = time;
                                bestDriver = value;
                                console.log("Best time has been changed to: " + bestTime);
                                console.log("Your best driver has been changed to: " + bestDriver.username);
                            }
                            promises++;
                            if (promises >= doc.length) {
                                // Found best driver, so create a ride
                                createRide(req, res, bestDriver.username, req.cookies.username, dest_lat, dest_lon);
                                res.cookie('nearestdriver', bestDriver.username);
                                res.redirect('ontheway');
                                //res.send("Your best driver is : " + bestDriver.username);
                            }
                        });
                });
            }
        }
    );
});

function createRide(req, res, driver_name, passenger_name, dest_lat, dest_lon) {
    // We need driver's name, passenger's name, destination longitude, and 
    // destination latitude. 

    // Set up database connections
    // Set our internal DB variable
    var db = req.db;
    var usercollection = db.get('usercollection');
    var ridescollection = db.get('rides');

    // Insert a new ride into the rides collection
    ridescollection.insert({
        "driver_name": driver_name,
        "passenger_name": passenger_name,
        "destination_lat": dest_lat,
        "destination_lon": dest_lon,
        "pickup_ready": false
    });

    // Set driver to BUSY 
    usercollection.update({
        'username': driver_name
    }, {
        $set: {
            'is_busy': true
        }
    });

    // That's it!   
}

/* GET Driver on the Way Page */
router.get('/ontheway', function(req, res) {
    var cookie_nearestdriver = req.cookies.nearestdriver;
    var msg = cookie_nearestdriver + " is your nearest driver, and he is " +
        "on the way!"
    res.render('ontheway', {
        title: 'shUber',
        message: msg
    });
});

/* GET Login Successful Driver Page */
router.get('/loginsuccessfuldriver', function(req, res) {
    var cookieinfo = req.cookies.username;

    if (cookieinfo) {
        res.render('loginsuccessfuldriver', {
            title: 'driver login successful'
        });
    } else {
        /* Cookie not valid */
        res.send('You need to <a href="/">sign in</a> first!');
    }
});

/* POST Login Successful Driver Page */
router.post('/loginsuccessfuldriver', function(req, res) {
    var cookieinfo = req.cookies.username;
    if (cookieinfo) {
        var db = req.db;
        var collection = db.get('usercollection');

        // Update DB with drivers current location
        var newLat = req.body.userlat;
        console.log("New Lat: " + newLat);
        var newLon = req.body.userlon;
        console.log("New Lon: " + newLon);

        collection.update({
            'username': cookieinfo
        }, {
            $set: {
                'latitude': newLat,
                'longitude': newLon
            }
        });

        // Send driver to waiting for assignment page
        res.redirect('waitingforassignment');

    } else {
        /* Cookie not valid */
        res.send('You need to <a href="/">sign in</a> first!');
    }
});

/* GET waiting for assignment Page */
router.get('/waitingforassignment', function(req, res) {
    res.render('waitingforassignment', {
        title: 'Waiting for next assignment'
    });
});

/* GET Sign in Successful Page */
router.get('/loginsuccessful', function(req, res) {
    // Requests the username stored in the user's cookie
    // and stores it in a local variable
    // to be passed as an argument to res.render()
    var penis = req.cookies.username;

    res.render('loginsuccessful', {
        title: 'login valid',
        userid: penis
    });
});

/* GET Sign up Successful page. */
router.get('/signupsuccessful', function(req, res) {
    res.render('signupsuccessful', {
        title: 'Sign Up Successful!'
    });
});

/* GET Add User page. */
router.get('/signup', function(req, res) {
    res.render('signup', {
        title: 'Create a new user account'
    });
});

/* GET Username already exists page. */
router.get('/registration_failure', function(req, res) {
    res.render('registration_failure', {
        title: 'That username already exists!'
    });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Set our collection
    var collection = db.get('usercollection');
    // Sign up the user
    onSignUp(req, res, collection);
});

/* GET Userlist. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {}, function(e, docs) {
        res.render('userlist', {
            "userlist": docs
        });
    });
});

/* POST logout */
router.post('/logout', function(req, res) {
    // Delete the user's cookie then send them to home page. 
    res.clearCookie('username');
    res.clearCookie('nearestdriver');
    res.redirect('/');
});

/* GET AJAX test page */
router.get('/ajax', function(req, res) {
    res.render('ajax', {
        title: 'what'
    });
});

var drivers = require('../controllers/drivers');
router.get('/api/drivers', drivers.findAll);
router.get('/api/drivers/:id', drivers.findById);
router.post('/api/drivers', drivers.add);
router.put('/api/drivers/:id', drivers.update);
router.delete('/api/drivers/:id', drivers.delete);

var passengers = require('../controllers/passengers');
router.get('/api/passengers', passengers.findAll);
router.get('/api/passengers/:id', passengers.findById);
router.post('/api/passengers', passengers.add);
router.put('/api/passengers/:id', passengers.update);
router.delete('/api/passengers/:id', passengers.delete);

var rides = require('../controllers/rides');
router.get('/api/rides', rides.findAll);
router.get('/api/rides/:id', rides.findById);
router.post('/api/rides', rides.add);
router.put('/api/rides/:id/:attr/:val', rides.update);
router.delete('/api/rides/:id', rides.delete);

var data_importer = require('../controllers/dummy_data_importer');
router.get('/api/dummy_data_importer', data_importer.import);

module.exports = router;