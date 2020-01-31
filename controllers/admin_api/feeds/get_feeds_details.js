// Get news details.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

NewsDetails = (req, res) => {
	var response = {};
	var feed_id = req.query.id ? req.query.id : "";

	if (feed_id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var data = { id: feed_id };
	var query = "SELECT tbl_1.*, CONCAT(tbl_2.first_name,' ', tbl_2.last_name) AS user_name, tbl_2.type AS user_type FROM feeds AS tbl_1 LEFT JOIN users AS tbl_2 ON tbl_1.user_id = tbl_2.id WHERE tbl_1.deleted_at IS NULL AND tbl_1.id = :id";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			var feedData = {};
			result.forEach(function (element) {
				feedData.id = element.id,
				feedData.title = element.title,
				feedData.description = element.description,
				feedData.image = element.image.split(","),
				feedData.status = element.status,
				feedData.user_id = element.user_id,
				feedData.user_type = element.user_type,
				feedData.user_name = element.user_name,
				feedData.created_at = moment(element.created_at).format("DD-MM-YYYY")
			});
			response.status = constants.SuccessStatusCode;
			response.message = "Feed Details.";
			response.result = feedData;
		} else {
			response.status = constants.RecordNotFoundStatusCode;
			response.message = constants.RecordNotFound;
		}

		res.statusCode = constants.SuccessStatusCode;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into get_feeds_details.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = NewsDetails;