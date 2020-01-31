// Email from Hydrafacial to user.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var EmailHelper = require('./../../../libraries/EmailHelper')();
var UtilityHelper = require('./../../../libraries/UtilityHelper')();
var nodemailer = require('nodemailer');

EmailToUser = (req, res) => {
	var response = {};
	var first_name = req.body.first_name ? req.body.first_name : "";
	var last_name = req.body.last_name ? req.body.last_name : "";
	var message = req.body.message ? req.body.message : "";
	var subject = req.body.subject ? req.body.subject : "";
	var user_email = req.body.user_email ? req.body.user_email : "";

	if (first_name == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.FirstNameValidation;
		res.send(response);
	}

	if (last_name == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.LastNameValidation;
		res.send(response);
	}

	if (user_email == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.EmailValidation;
		res.send(response);
	}

	if (message == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.MessageValidation;
		res.send(response);
	}

	if (subject == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.SUBJECT_VALIDATION;
		res.send(response);
	}
	
	var query = "SELECT * FROM email_template WHERE id = '2'";
	dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		var emailTemplete = result[0];
		// var LOGO = constants.BASEURL+'public/images/logo.svg';
		var LOGO = '<img src="'+ constants.LOGO +'" alt="hydrafacial" />';
		var USERNAME = UtilityHelper.ucwords(first_name+" "+last_name);
		var MESSAGE = message;
		var mailContent = emailTemplete.body.replace(/[\s]/gi, ' ').replace('[LOGO]', LOGO).replace("[USERNAME]", USERNAME).replace("[MESSAGE]", MESSAGE);
		var mailOptions = {
			email: user_email,
			subject: subject,
			body: mailContent
		}
		
		EmailHelper.sendEmail(mailOptions, function(mailResutl) { console.log("Email response: ", mailResutl); });
	});

	res.statusCode = constants.SuccessStatusCode;
	response.status = constants.SuccessStatusCode;
	response.message = constants.EMAIL_SENT;
	res.send(response);
}
module.exports = EmailToUser;