// Create user as Aesthetician.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var EmailHelper = require('./../../../libraries/EmailHelper')();
var nodemailer = require('nodemailer');
var md5 = require('md5');

AddAesthetician = (req, res) => {
	var response = {};
	var firstName = req.body.firstName ? req.body.firstName : "";
	var lastName = req.body.lastName ? req.body.lastName : "";
	var email = req.body.email ? req.body.email : "";
	var password = req.body.password ? md5(req.body.password) : "";
	var country_code = req.body.country_code ? req.body.country_code : "";
	var phone = req.body.phone ? req.body.phone : "";
	var prifileImage = req.body.prifileImage ? req.body.prifileImage : "";
	var address = req.body.address ? req.body.address : "";
	var latitude = req.body.latitude ? req.body.latitude : 0.0;
	var longitude = req.body.longitude ? req.body.longitude : 0.0;
	var state = req.body.state ? req.body.state : "";
	var city = req.body.city ? req.body.city : "";
	var zip_code = req.body.zip_code ? req.body.zip_code : "";
	var spa_name = req.body.spa_name ? req.body.spa_name : "";
	var spa_location = req.body.spa_location ? req.body.spa_location : "";
	var spa_location_lat = req.body.spa_location_lat ? req.body.spa_location_lat : 0.0;
	var spa_location_lng = req.body.spa_location_lng ? req.body.spa_location_lng : 0.0;
	var hydrafacialMachineId = req.body.hydrafacialMachineId ? req.body.hydrafacialMachineId : "";
	var securityQuestions = req.body.securityQuestions ? req.body.securityQuestions : "";

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

	var randomNumber = _.random(1000, 9999);
	var todayDate = new Date();
	var _date = parseInt(todayDate.getFullYear() + "" + (todayDate.getMonth() + 1) + "" + todayDate.getDate());
	var _time = parseInt(todayDate.getHours() + "" + todayDate.getMinutes() + "" + todayDate.getSeconds());
	var public_id = parseInt(randomNumber +""+ _date +""+ _time);



	var data = { public_id: public_id, first_name: firstName, last_name: lastName, email: email, image: prifileImage, country_code: country_code, phone: phone, password: password, user_type: 'aesthetician', address: address, location_lat: latitude, location_lng: longitude, city: city, state: state, hydra_facial_machine_id: hydrafacialMachineId, zip_code: zip_code, spa_location: spa_location, spa_location_lat: spa_location_lat, spa_location_lng: spa_location_lng, spa_name: spa_name };

	data.referral_link = "https://hydrafacialhub.com?public_id="+public_id;

	var query = "INSERT INTO users(public_id, first_name, last_name, email, password, phone, country_code, address, location_lat, location_lng, city, state, zip_code, spa_location, spa_location_lat, spa_location_lng, spa_name, type, hydra_facial_machine_id, image, referral_link) VALUES (:public_id, :first_name, :last_name, :email, :password, :phone, :country_code, :address, :location_lat, :location_lng, :city , :state, :zip_code, :spa_location, :spa_location_lat, :spa_location_lng, :spa_name, :user_type, :hydra_facial_machine_id, :image, :referral_link)";
	
	var data1 = { email: email };
	var query1 = "SELECT * FROM users WHERE email = :email AND deleted_at IS NULL";

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
				var user_id = result[0];	// To get last inserted ID.

				securityQuestions.forEach(function(element) {
					var userAnsData = { question_id: element.question_id, answer: element.answer, user_id: user_id };
					var query2 = "INSERT INTO user_answers(question_id, answer, user_id) VALUES (:question_id, :answer, :user_id)";
					dbConnection.query(query2, { replacements: userAnsData, type: dbConnection.QueryTypes.INSERT });
				});

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
				response.message = constants.AESTHETICIAN_REGISTER_SUCCESS;
				res.send(response);
			})
			.catch(err => {
				console.error("Error into add_aesthetician.js"+ err);
				res.statusCode = constants.ErrorStatusCode;
				response.message = constants.SomethingWentWrong;
				res.send(response);
			});
		}
	});
}
module.exports = AddAesthetician;