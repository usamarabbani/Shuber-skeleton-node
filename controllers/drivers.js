function filterByDrivers(obj) {
    if(obj.is_driver == 'true') {
        return true;
    } else {
        return false;
    }
}

exports.findAll = function(req, res){
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{}, function(e, drivers) {
        return res.jsonp(drivers.filter(filterByDrivers));
    });
};

exports.findById = function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    var id = req.params.id;

    collection.findOne({'_id':id}, function(e, driver) {
        return res.jsonp(driver)
    });
};

exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};