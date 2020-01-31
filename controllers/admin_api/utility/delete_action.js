// Delete action.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

Delete = (req, res) => {
	var response = {};
	var id = req.body.id ? req.body.id : "";
	var type = req.body.type ? req.body.type : "";
	var email = req.body.email;
	var tableName = "";
	var text = "";

	if (id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (type == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.TYPE_VALIDATION;
		res.send(response);
	}

	switch(type) {
		case "sub_admin":
			tableName = "admin";
			text = "Sub Admin";
			break;
		case "aesthetician":
			tableName = "users";
			text = "Aesthetician";
			break;
		case "provider":
			tableName = "users";
			text = "Provider";
			break;
		case "news":
			tableName = "news";
			text = "News";
			break;
		case "feed":
			tableName = "feeds";
			text = "Feed";
			break;
		case "event":
			tableName = "event";
			text = "Event";
			break;
		case "question":
			tableName = "security_questions";
			text = "Question";
			break;
		case "social_products":
			tableName = "social_products";
			text = "Social Product";
			break;
	}

	// Current date.
	var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
	
	if ((type == "aesthetician") || (type == "provider")) {
		var deleteEmail = "deleted_" + id + "_" + email;
		var data = { deleted_at: datetime, id: id, email: deleteEmail };
		var query = "UPDATE "+ tableName +" SET email=:email, deleted_at= :deleted_at WHERE id= :id";
	} else {
		var data = { deleted_at: datetime, id: id };
		var query = "UPDATE "+ tableName +" SET deleted_at= :deleted_at WHERE id= :id";	
	}
	
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = constants.DELETE_MESSAGE.replace("TEXT", text);
		res.send(response);
	})
	.catch(err => {
		console.error("Error in delete_action.js "+ err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = Delete;