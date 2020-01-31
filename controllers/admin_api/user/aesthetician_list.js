var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

AestheticianList = (req, res) => {
	var response = {};
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var offset = req.query.offset ? parseInt(req.query.offset) : 0;
	var status = req.query.status ? req.query.status : "";
	var search_value = req.query.value ? req.query.value : "";

	var replacements = { limit: limit, offset: offset, status: status, search_value: search_value };
	var replacements_cnt = { status: status, search_value: search_value };

	var query = "SELECT id, first_name, last_name, CONCAT(first_name, ' ', last_name) AS fullname, email, spa_name, image, status FROM users WHERE type = 'aesthetician' AND deleted_at IS NULL";

	var que_cnt = "SELECT id, first_name, last_name, CONCAT(first_name, ' ', last_name) AS fullname, email, spa_name, image, status FROM users WHERE type = 'aesthetician' AND deleted_at IS NULL";

	if (status != "") {
		query += " AND status = :status";
		que_cnt += " AND status = :status";
	}

	if (search_value != "") {
		query += " HAVING (fullname LIKE '%"+search_value+"%' OR email LIKE '%"+search_value+"%' OR spa_name LIKE '%"+search_value+"%')";
		que_cnt += " HAVING (fullname LIKE '%"+search_value+"%' OR email LIKE '%"+search_value+"%' OR spa_name LIKE '%"+search_value+"%')";
	}

	query += " ORDER BY id DESC LIMIT :offset, :limit";
	
	dbConnection.query(query, { replacements: replacements, type: dbConnection.QueryTypes.SELECT })
	.then(resul => {
		if (resul.length > 0) {
			var total = "";
			dbConnection.query(que_cnt, { replacements: replacements_cnt, type: dbConnection.QueryTypes.SELECT })
			.then(result_cnt => {
				total = result_cnt.length;
				res.statusCode = constants.SuccessStatusCode;
				response.count = total;
				response.status = constants.SuccessStatusCode;
				response.message = "Aesthetician List";
				response.result = resul;
				res.send(response);
			});
		} else {
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.RecordNotFoundStatusCode;
			response.message = constants.RecordNotFound;
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
module.exports = AestheticianList;