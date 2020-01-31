// Get news details.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

NewsDetails = (req, res) => {
	var response = {};
	var news_id = req.query.id ? req.query.id : "";

	if (news_id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var data = { id: news_id };
	var query = "SELECT tbl_1.*, tbl_2.category_name FROM news AS tbl_1 LEFT JOIN categories AS tbl_2 ON tbl_1.category = tbl_2.id WHERE tbl_1.id = :id AND tbl_1.deleted_at IS NULL";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			var newsData = {};
			result.forEach(function (element) {
				newsData.id = element.id,
				newsData.title = element.title,
				newsData.description = element.description,
				newsData.logo_image = element.logo_image,
				newsData.magazine_image = element.magazine_image,
				newsData.news_link = element.news_link,
				newsData.status = element.status,
				newsData.date = moment(element.date).format("DD-MM-YYYY"),
				newsData.category_id = element.category,
				newsData.category_name = element.category_name,
				newsData.created_at = moment(element.created_at).format("DD-MM-YYYY")
			});
			response.status = constants.SuccessStatusCode;
			response.message = "New Details.";
			response.result = newsData;
		} else {
			response.status = constants.RecordNotFoundStatusCode;
			response.message = constants.RecordNotFound;
		}

		res.statusCode = constants.SuccessStatusCode;
		res.send(response);
	})
	.catch(err => {
		console.log("Error into get_news_details.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = NewsDetails;