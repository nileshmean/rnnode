var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

var contact = function(req,res){

    var first_name = req.body.first_name ? req.body.first_name : "";
    var last_name = req.body.last_name ? req.body.last_name : "";
    var email = req.body.email ? req.body.email : "";
    var phone = req.body.phone ? req.body.phone : "";
    var state = req.body.state ? req.body.state : "";
    var title = req.body.title ? req.body.title : "";
    var description = req.body.description ? req.body.description : "";


    console.log("req.body === ", req.body);


           var response = {
              'status': constants.SuccessStatusCode,
              'message': "Sent Successfully.",
            };
            return res.status(constants.SuccessStatusCode).json(response);
 
};
module.exports=contact;
