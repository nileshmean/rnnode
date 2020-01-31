// Get all users.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

AllUsers = (req, res) => {
	var response = {};
	/*var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var search_value = req.query.value ? req.query.value : "";

	var replacements = { limit: limit, offset: offset, search_value: search_value };
	var replacements_cnt = { search_value: search_value };*/

	var query = "SELECT id, first_name, last_name, CONCAT(first_name, ' ', last_name) AS fullname FROM users WHERE deleted_at IS NULL";

	/*var que_cnt = "SELECT id, first_name, last_name, CONCAT(first_name, ' ', last_name) AS fullname FROM users WHERE deleted_at IS NULL";

	if (search_value != "") {
		query += " HAVING (fullname LIKE '%"+search_value+"%')";
		que_cnt += " HAVING (fullname LIKE '%"+search_value+"%')";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";*/
	
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			var data = [];
			result.forEach(function(element) {
				data.push({ value: element.id, label: element.fullname });
			});
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.SuccessStatusCode;
			response.message = "All Users.";
			response.result = data;
			res.send(response);
			/*var total = "";
			dbConnection.query(que_cnt, { replacements: replacements_cnt, type: dbConnection.QueryTypes.SELECT })
			.then(result_cnt => {
				total = result_cnt.length;
				res.statusCode = constants.SuccessStatusCode;
				response.count = total;
				response.status = constants.SuccessStatusCode;
				response.message = "All Users.";
				response.result = resul;
				res.send(response);
			});*/
		} else {
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.RecordNotFoundStatusCode;
			response.message = constants.RecordNotFound;
			response.result = [];
			res.send(response);
		}
	})
	.catch(err => {
		console.error("Error in aesthetician_list.js "+ err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = AllUsers;