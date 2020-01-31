// Edit user as Provider.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var fs = require('fs');
// var EmailHelper = require('./../../../libraries/EmailHelper')();
// var nodemailer = require('nodemailer');
// var md5 = require('md5');

EditProvider = (req, res) => {
	var response = {};
	var user_id = req.body.id ? req.body.id : "";
	var firstName = req.body.firstName ? req.body.firstName : "";
	var lastName = req.body.lastName ? req.body.lastName : "";
	var country_code = req.body.country_code ? req.body.country_code : "";
	var phone = req.body.phone ? req.body.phone : "";
	var prifileImage = req.body.prifileImage ? req.body.prifileImage : "";
	var address = req.body.address ? req.body.address : "";
	var state = req.body.state ? req.body.state : "";
	var city = req.body.city ? req.body.city : "";
	var zip_code = req.body.zip_code ? req.body.zip_code : "";
	var latitude = req.body.latitude ? req.body.latitude : 0.0;
	var longitude = req.body.longitude ? req.body.longitude : 0.0;
	var user_skills = req.body.user_skills ? req.body.user_skills.toString() : null;
	var education = req.body.education ? req.body.education : "";
	var designation = req.body.designation ? req.body.designation : "";
	var work_experience = req.body.work_experience ? req.body.work_experience : "";
	var about_me = req.body.about_me ? req.body.about_me : "";
	var spa_name = req.body.spa_name ? req.body.spa_name : "";
	var spa_location = req.body.spa_location ? req.body.spa_location : "";
	var spa_location_lat = req.body.spa_location_lat ? req.body.spa_location_lat : 0.0;
	var spa_location_lng = req.body.spa_location_lng ? req.body.spa_location_lng : 0.0;
	var hydrafacialMachineId = req.body.hydrafacialMachineId ? req.body.hydrafacialMachineId : "";
	var oldPrifileImage = req.body.oldPrifileImage ? req.body.oldPrifileImage : "";

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

	if (oldPrifileImage != "") {
        var image_path = constants.APP_PATH+'public/uploads/provider/' + oldPrifileImage;
        fs.access(image_path, error => {
            if (!error) {
                // The check succeeded.
                fs.unlink(image_path, function (err) {
                    // if no error, file has been deleted successfully.
                    console.log("File deleted!");
                });
            } else {
                // The check failed.
                console.error("Error into edit_provider.js: ", error);
                console.log("File not found.");
            }
        });
    }

    var skillArray = JSON.stringify(user_skills.split(","));

	var data1 = { id: user_id, first_name: firstName, last_name: lastName, image: prifileImage, country_code: country_code, phone: phone, user_type: 'provider', address: address, location_lat: latitude, location_lng: longitude, city: city, state: state, hydra_facial_machine_id: hydrafacialMachineId, education: education, designation: designation, work_experience: work_experience, about_me: about_me, hydra_facial_machine_id: hydrafacialMachineId, zip_code: zip_code, spa_location: spa_location, spa_location_lat: spa_location_lat, spa_location_lng: spa_location_lng, spa_name: spa_name, skill: skillArray };

	var query1 = "UPDATE users SET first_name=:first_name, last_name=:last_name, phone=:phone, country_code=:country_code, address=:address, location_lat=:location_lat, location_lng=:location_lng, city=:city, state=:state, zip_code=:zip_code, spa_location=:spa_location, spa_location_lat=:spa_location_lat, spa_location_lng=:spa_location_lng, spa_name=:spa_name, type=:user_type, hydra_facial_machine_id=:hydra_facial_machine_id, image=:image, skill=:skill, education=:education, designation=:designation, work_experience=:work_experience, about_me=:about_me WHERE id=:id";

	dbConnection.query(query1, { replacements: data1, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = constants.PROVIDER_EDIT_SUCCESS;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into edit_provider.js"+ err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = EditProvider;