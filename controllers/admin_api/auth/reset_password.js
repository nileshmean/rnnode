// Reset password.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var md5 = require('md5');

ResetPassword = (req, res) => {
	var response = {};
	var new_password = req.body.new_password ? md5(req.body.new_password) : "";
	var reset_password_token = req.body.reset_password_token ? req.body.reset_password_token : "";

	if (new_password == "") {
        response.message = constants.PASSWORD_VALIDATION;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response);
    }

    if (reset_password_token == "") {
        response.message = constants.RESET_PASSWORD_TOKEN_VALIDATION;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response);
    }

    var data = { password: new_password, remember_token: reset_password_token };
    var query = "UPDATE admin SET password = :password, remember_token = '' WHERE remember_token = :remember_token";

    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
    	if (result[1] == 1) {
			response.status = constants.SuccessStatusCode;
			response.message = constants.RESET_PASSWORD_SUCCESS;
			return res.status(response.status).json(response);
    	} else {
    		response.status = constants.ValidationStatusCode;
			response.message = constants.RESET_PASSWORD_LINK_EXPIRED;
			return res.status(response.status).json(response);
    	}
    })
    .catch(err => {
		console.error("Error into reset_password.js: ", err);
		response.message = constants.SomethingWentWrong;
		return res.status(constants.ErrorStatusCode).json(response);
    });
}
module.exports = ResetPassword;