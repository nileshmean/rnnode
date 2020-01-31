// User details.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

UserDetails = (req, res) => {
	var response = {};
	var user_id = req.query.id ? req.query.id : "";

	if (user_id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var query = "SELECT * FROM admin WHERE deleted_at IS NULL AND user_type = 'sub_admin' AND id = :id";

	dbConnection.query(query, { replacements: { id: user_id }, type: dbConnection.QueryTypes.SELECT })
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
				info.status = element.status,
				info.image = element.image,
				info.permission = element.permission,
				info.created_at = moment(element.created_at).format("DD-MM-YYYY");
			});
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.SuccessStatusCode;
			response.message = "Sub admin Details";
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
		console.error("Error into getSubAdminDetails.js"+ err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = UserDetails;