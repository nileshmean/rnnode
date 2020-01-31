// Change status.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

ChangeStatus = (req, res) => {
	var response = {};
	var id = req.query.id ? req.query.id : "" ;
	var status = req.query.status ? req.query.status : "";
	var type = req.query.type ? req.query.type : "";
	var tableName = "";

	if (id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (status == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.STATUS_VALIDATION;
		res.send(response);
	}

	if (type == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.UserTypeValidation;
		res.send(response);
	}

	switch(type) {
		case "users":
			tableName = "users";
			break;
		case "subAdmin":
			tableName = "admin";
			break;
		case "news":
			tableName = "news";
			break;
		case "feed":
			tableName = "feeds";
			break;
		case "event":
			tableName = "event";
			break;
		case "question":
			tableName = "security_questions";
			break;
		case "social_products":
			tableName = "social_products";
			break;
	}

	var query = "UPDATE "+ tableName +" SET status = :status WHERE id = :id";
	dbConnection.query(query, {
		replacements: { tableName: tableName, id: id, status: status },
		type: dbConnection.QueryTypes.UPDATE
	})
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = constants.STATUS_ON_CHANGE.replace("STATUS", status);
		response.result = status;
		res.send(response);
	})
	.catch(err => {
		console.error("Error in change_status.js "+ err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = ChangeStatus;