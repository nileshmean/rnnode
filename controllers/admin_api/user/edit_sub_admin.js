// User details.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');
var fs = require('fs');

EditSubAdmin = (req, res) => {
	var response = {};
	var user_id = req.body.id ? req.body.id : "";
	var firstName = req.body.firstName ? req.body.firstName : "";
	var lastName = req.body.lastName ? req.body.lastName : "";
	var country_code = req.body.country_code ? parseInt(req.body.country_code) : "";
	var phone = req.body.phone ? parseInt(req.body.phone) : "";
	var permission = req.body.permission ? parseInt(req.body.permission) : "";
	var image = req.body.image ? req.body.image : "";
	var oldFile = req.body.oldImage ? req.body.oldImage : "";

	if (user_id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (firstName == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.FirstNameValidation;
		res.send(response);
	}

	if (lastName == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.LastNameValidation;
		res.send(response);
	}

	if (country_code == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.COUNTRY_CODE_VALIDATION;
		res.send(response);
	}

	if (phone == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.PhoneValidation;
		res.send(response);
	}

	if (permission == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.PhoneValidation;
		res.send(response);
	}

	if (oldFile != "") {
		var removeFile = constants.APP_PATH + "public/uploads/subAdmin/" + oldFile;
		fs.access(removeFile, error => {
			if (!error) {
				fs.unlink(removeFile, function (err) {
					if (err) throw err;
					// if no error, file has been deleted successfully
					console.log("File deleted!");
				});
			} else {
				// The check failed.
                console.error("Error into edit_sub_admin.js: ", error);
                console.log("File not found.");
			}
		});
	}

	var data = { id: user_id, first_name: firstName, last_name: lastName, image: image, country_code: country_code, phone: phone, permission: permission };
	var query = "UPDATE admin SET first_name = :first_name, last_name = :last_name, country_code = :country_code, phone = :phone, image = :image, permission = :permission WHERE id = :id";

	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = constants.SUB_ADMIN_EDIT_SUCCESS;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into edit_sub_admin.js"+ err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = EditSubAdmin;