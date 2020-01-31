var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var fs = require('fs');

upload_remove = function(req, res) {
    
    var image_name = req.body.image_name ? req.body.image_name : '';
    var type = req.body.type ? req.body.type : '';

    if (image_name == '') {
        var response = {
            "status": constants.ValidationStatusCode,
            "message": "Image name is required"
        };
        res.json(response);
    }
    else if (type == '') {
        var response = {
            "status": constants.ValidationStatusCode,
            "message": 'Type is required'
        };
        res.json(response);
    }
     
    if (type == 'provider') {
      filePath = constants.ROOT_PATH+'/public/uploads/provider/'+image_name;
    } 
    else if (type == 'aesthetician') {
      filePath = constants.ROOT_PATH+'/public/uploads/aesthetician/' + image_name;
    } 
    else if (type == "news") {
      filePath = constants.ROOT_PATH+'/public/uploads/news/' + image_name;
    } 
    else if (type == "feeds") {
      filePath = constants.ROOT_PATH+'public/uploads/feeds/' + image_name;
    }
    else if (type == "event") {
      filePath = constants.ROOT_PATH+'public/uploads/event/' + image_name;
    }
    else {
      filePath = constants.ROOT_PATH+'/public/uploads/' + image_name;
    }
    
    try {
          var rmv = fs.unlinkSync(filePath);
          
            res.json({
              'status': constants.SuccessStatusCode,
              'message': "Image has been deleted successfully",
            });
          
      } catch(err) {
           console.error(err)
           res.status(constants.RecordNotFoundStatusCode).json({
              'status': constants.RecordNotFoundStatusCode,
              'message': "Image path not found", 
            });
        }

   

};
module.exports = upload_remove;