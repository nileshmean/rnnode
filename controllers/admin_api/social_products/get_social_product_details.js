// Get social product details.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

GetSocialProductDetails = (req, res) => {
	var response = {};
	var id = req.query.id ? req.query.id : "";

	if (id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}
	var data = { id: id };
	var query = "SELECT * FROM social_products WHERE id = :id";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = "Social product details";
		response.result = result[0];
		res.send(response);
	})
	.catch(err => {
		console.error("Error into get_social_product_details.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = GetSocialProductDetails;