/**
 * token middleware file
 */

var constants = require("./../config/constants"),
    dbConnection = require("./../config/connection"),
    jwt = require("jsonwebtoken");


tokenOptionalMiddleWare = function(req, res, next) {


	var token = req.headers.token ? req.headers.token : "";
	if (token === '') {
		res.locals.userData = {
			"id": 0,
			"user_id": 0
		};
		next();
	} else {
		try {
			var user_token_info = jwt.verify(token, constants.TOKEN_VALUE);
			res.locals.userData = user_token_info;
			next();
		} catch (error) {
			var response = {
				"status": 0,
				"message": constants.TOKEN_INVALID,
			};
			res.send(response);
		}
	}
}

module.exports = tokenOptionalMiddleWare;
