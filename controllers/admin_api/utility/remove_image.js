// Remove image from folder.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var fs = require('fs');

RemoveImage = (req, res) => {
	var response = {};
	var image_name = req.body.image_name ? req.body.image_name : "";
	var folder_name = req.body.folder_name ? req.body.folder_name : "";

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

	fs.access(image_path, error => {
		if (!error) {
			// The check succeeded.
			fs.unlink(image_path, function (err) {
				// if no error, file has been deleted successfully.
				res.statusCode = constants.SuccessStatusCode;
				response.status = constants.SuccessStatusCode;
				response.message = "File deleted!";
				res.send(response);
			});
		} else {
			// The check failed.
			console.error("Error into remove_image.js: ", error);
			res.statusCode = constants.ErrorStatusCode;
			response.status = constants.ErrorStatusCode;
			response.message = "File not found.";
			res.send(response);
		}
	});
}
module.exports = RemoveImage;