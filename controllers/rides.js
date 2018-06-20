exports.findAll = function(req, res){
    var db = req.db;
    var ridescollection = db.get('rides');
    ridescollection.find({},{}, function(e, rides) {
        return res.jsonp(rides);
    });
};

exports.findById = function(req, res) {
    var db = req.db;
    var ridescollection = db.get('rides');
    var id = req.params.id;

    ridescollection.findOne({'_id':id}, function(e, ride) {
        return res.jsonp(ride)
    });
};

exports.add = function() {};
exports.update = function(req, res) {
   var db = req.db; 
   var ridescollection = db.get('rides'); 
   var id = req.params.id; 
   var attr = req.params.attr;
   var val = req.params.val; 
   if (val == 'true') {
      console.log("yes, it is true"); 
      val = true; 
   } else { 
      console.log("something is wrong"); 
      val = false; 
   }
   
   console.log("id: " + id + ", attr: " + attr + ", val: " + val);

   var setModifier = { $set: {} }; 
   setModifier.$set[attr] = val;    
   ridescollection.update({'driver_name':id}, setModifier); 
};
exports.delete = function() {};