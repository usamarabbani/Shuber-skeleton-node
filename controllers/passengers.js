function filterByPassengers(obj) {
    if(obj.is_driver == 'true') {
        return false;
    } else {
        return true;
    }
}

exports.findAll = function(req, res){
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{}, function(e, passengers) {
        return res.jsonp(passengers.filter(filterByPassengers));
    });
};

exports.findById = function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    var id = req.params.id;

    collection.findOne({'_id':id}, function(e, passenger) {
        return res.jsonp(passenger)
    });
};

exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};