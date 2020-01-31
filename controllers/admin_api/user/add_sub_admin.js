// Create sub admin.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var EmailHelper = require('./../../../libraries/EmailHelper')();
var nodemailer = require('nodemailer');
var md5 = require('md5');

AddSubAdmin = (req, res) => {
	var response = {};
	var firstName = req.body.firstName ? req.body.firstName : "";
	var lastName = req.body.lastName ? req.body.lastName : "";
	var email = req.body.email ? req.body.email : "";
	var password = req.body.password ? md5(req.body.password) : "";
	var country_code = req.body.country_code ? parseInt(req.body.country_code) : "";
	var phone = req.body.phone ? parseInt(req.body.phone) : "";
	var permission = req.body.permission ? parseInt(req.body.permission) : "";
	var image = req.body.image ? req.body.image : "";

	if (firstName == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.FirstNameValidation;
		res.send(response);
	}

	if (lastName == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.LastNameValidation;
		res.send(response);
	}

	if (email == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.EmailValidation;
		res.send(response);
	}

	if (password == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.PASSWORD_VALIDATION;
		res.send(response);
	}

	if (country_code == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.COUNTRY_CODE_VALIDATION;
		res.send(response);
	}

	if (phone == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.PhoneValidation;
		res.send(response);
	}

	if (permission == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.PhoneValidation;
		res.send(response);
	}

	var data = { first_name: firstName, last_name: lastName, email: email, image: image, country_code: country_code, phone: phone, password: password, user_type: 'sub_admin', permission: permission };
	var query = "INSERT INTO admin(first_name, last_name, email, image, country_code, phone, password, user_type, permission) VALUES (:first_name,:last_name,:email,:image,:country_code,:phone,:password,:user_type,:permission)";
	
	var data1 = { email: email }
	var query1 = "SELECT * FROM admin WHERE email = :email AND deleted_at IS NULL";
	dbConnection.query(query1, { replacements: data1, type: dbConnection.QueryTypes.SELECT })
	.then(result => {
		if (result.length > 0) {
			res.statusCode = constants.SuccessStatusCode;
			response.status = constants.ValidationStatusCode;
			response.message = constants.AlreadyExists;
			res.send(response);
		} else {
			dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
			.then(result => {
				// Send email to user.
				var query = "SELECT * FROM email_template WHERE id = '1'";
				dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
				.then(result => {
					var emailTemplete = result[0];
					// var LOGO = constants.BASEURL+'public/images/logo.svg';
					var LOGO = '<img src="'+ constants.LOGO +'" alt="hydrafacial" />';
					var USERNAME = (firstName+" "+lastName).toUpperCase();
					var EMAIL = email;
					var PASSWORD = req.body.password;
					var mailContent = emailTemplete.body.replace(/[\s]/gi, ' ').replace('[LOGO]', LOGO).replace("[USERNAME]", USERNAME).replace("[EMAIL]", EMAIL).replace("[PASSWORD]", PASSWORD);
					var mailOptions = {
						email: email,
						subject: emailTemplete.subject,
						body: mailContent
					}
					EmailHelper.sendEmail(mailOptions, function(mailResutl) { console.log("Email response: ", mailResutl); });
				});

				res.statusCode = constants.SuccessStatusCode;
				response.status = constants.SuccessStatusCode;
				response.message = constants.SUB_ADMIN_REGISTER_SUCCESS;
				res.send(response);
			})
			.catch(err => {
				console.error("Error into create_sub_admin.js"+ err);
				res.statusCode = constants.ErrorStatusCode;
				response.message = constants.SomethingWentWrong;
				res.send(response);
			});
		}
	});
}
module.exports = AddSubAdmin;