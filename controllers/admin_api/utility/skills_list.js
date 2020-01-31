// Get all skills.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

SkillsList = (req, res) => {
	var response = {};
	var query = "SELECT id, title FROM skills WHERE deleted_at IS NULL";
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.SuccessStatusCode;
			response.message = "Skills list.";
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
		console.error("Error in skills_list.js ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
};
module.exports = SkillsList;