// Get all states list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

StatesList = (req, res) => {
	var response = {};
	var query = "SELECT id, name FROM states WHERE deleted_at IS NULL";
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.SuccessStatusCode;
			response.message = "States list.";
			response.result = result;
			res.send(response);
		} else {
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.RecordNotFoundStatusCode;
			response.message = constants.RecordNotFound;
			response.result = [];
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error in states_list.js ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
};
module.exports = StatesList;