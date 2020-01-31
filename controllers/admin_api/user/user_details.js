// User details.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

UserDetails = (req, res) => {
	var response = {};
	var user_id = req.query.id ? req.query.id : "";
	var user_type = req.query.user_type ? req.query.user_type : "";
	var tableName = "";
	var data = {};
	var promises = [];

	if (user_id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (user_type == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.UserTypeValidation;
		res.send(response);
	}

	/*switch(user_type) {
		case "users":
			tableName = "users";
			break;
		case "subAdmin":
			tableName = "admin";
			break;
	}*/

	var query = "SELECT * FROM users WHERE type = :type AND deleted_at IS NULL AND id = :id";
	var query1 = "SELECT id, social_product_id, image FROM saved_social_products WHERE user_id = :id AND deleted_at IS NULL ORDER BY id DESC";

	promises.push(
		dbConnection.query(query, { replacements: { id: user_id, type: user_type }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			if (result.length > 0) {
				var info = {};
				result.forEach(function (element) {
					info.id = element.id,
					info.first_name = element.first_name,
					info.last_name = element.last_name,
					info.email = element.email,
					info.phone = element.phone,
					info.country_code = element.country_code,
					info.address = element.address,
					info.location_lat = element.location_lat,
					info.location_lng = element.location_lng,
					info.city = element.city,
					info.state = element.state,
					info.zip_code = element.zip_code,
					info.spa_location = element.spa_location,
					info.spa_location_lat = element.spa_location_lat,
					info.spa_location_lng = element.spa_location_lng,
					info.spa_name = element.spa_name,
					info.status = element.status,
					info.type = element.type,
					info.hydra_facial_machine_id = element.hydra_facial_machine_id,
					info.image = element.image,
					info.skill = element.skill,
					info.education = element.education,
					info.designation = element.designation,
					info.work_experience = element.work_experience,
					info.about_me = element.about_me,
					info.created_at = moment(element.created_at).format("DD-MM-YYYY");
				});
				data.user_details = info;
			} else {
				data.user_details = "";
			}
		}),

		dbConnection.query(query1, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
		.then(result => {
			if (result.length > 0) {
				data.social_products = result;
			} else {
				data.social_products = "";
			}
		}),
	);

	Promise.all(promises)
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = "User details.";
		response.result = data;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into user_details.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});

	/*dbConnection.query(query, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			var info = {};
			result.forEach(function (element) {
				info.id = element.id,
				info.first_name = element.first_name,
				info.last_name = element.last_name,
				info.email = element.email,
				info.phone = element.phone,
				info.country_code = element.country_code,
				info.address = element.address,
				info.location_lat = element.location_lat,
				info.location_lng = element.location_lng,
				info.city = element.city,
				info.state = element.state,
				info.zip_code = element.zip_code,
				info.spa_location = element.spa_location,
				info.spa_location_lat = element.spa_location_lat,
				info.spa_location_lng = element.spa_location_lng,
				info.spa_name = element.spa_name,
				info.status = element.status,
				info.type = element.type,
				info.hydra_facial_machine_id = element.hydra_facial_machine_id,
				info.image = element.image,
				info.skill = element.skill,
				info.education = element.education,
				info.designation = element.designation,
				info.work_experience = element.work_experience,
				info.about_me = element.about_me,
				info.created_at = moment(element.created_at).format("DD-MM-YYYY");
			});
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.SuccessStatusCode;
			response.message = "User Details";
			response.result = info;
			res.send(response);
		} else {
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.RecordNotFoundStatusCode;
			response.message = constants.RecordNotFound;
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error into user_details.js"+ err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});*/
}
module.exports = UserDetails;