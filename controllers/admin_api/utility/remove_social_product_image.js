// Remove image from folder.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var fs = require('fs');

RemoveImage = (req, res) => {
	var response = {};
	var image_name = req.body.image_name ? req.body.image_name : "";
	var folder_name = req.body.folder_name ? req.body.folder_name : "";
	var id = req.body.id ? req.body.id : "";

	if (id == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = "ID is required.";
        res.send(response);
    }

	if (image_name == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = "Image name is required.";
        res.send(response);
    }

    if (folder_name == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = "Folder name is required.";
        res.send(response);
    }

    var image_path = constants.APP_PATH + "public/uploads/" + folder_name + "/" + image_name;
    var query = "DELETE FROM saved_social_products WHERE id = :id";
    dbConnection.query(query, { replacements: { id: id }, type: dbConnection.QueryTypes.DELETE })
    .then(result => {
    	fs.access(image_path, error => {
			if (!error) {
				// The check succeeded.
				fs.unlink(image_path, function (err) {});
			}
		});
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = "Social product has been deleted!";
		res.send(response);
    })
    .catch(err => {
    	console.error("Error into remove_social_product_image.js: ", error);
		res.statusCode = constants.ErrorStatusCode;
		response.status = constants.ErrorStatusCode;
		res.send(response);
    });
}
module.exports = RemoveImage;