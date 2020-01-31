// Check email exist into database or not.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

CheckEmail = (req, res) => {
	var response = {};
	var email = req.body.email ? req.body.email : "";
	var query = "SELECT * FROM users WHERE email=:email && deleted_at IS NULL";
	dbConnection.query(query, { replacements: { email: email }, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			response.status = constants.ConflictStatusCode;
            response.message = constants.AlreadyExists;
            return res.status(response.status).json(response);
		} else {
			response.status = constants.SuccessStatusCode;
            response.message = constants.Success;
            return res.status(response.status).json(response);
		}
	})
	.catch(err => {
		console.error("Error in check_email_existence.js ", err);
		response.status = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		return res.status(response.status).json(response);
	});
};
module.exports = CheckEmail;