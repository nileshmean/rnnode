/**
 * Add New User.
 */
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection')
var _ = require('lodash');
const UtilityHelper = require('./../../../library/UtilityHelper')();
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');
const uuidv1 = require('uuid/v1');

registration = function(req, res) {
	var first_name = req.body.first_name ? req.body.first_name : "";
    var last_name = req.body.last_name ? req.body.last_name : "";
	var email = req.body.email ? req.body.email : "";
	var password = req.body.password ? md5(req.body.password) : "";

	var mobile_number = req.body.mobile_number ? req.body.mobile_number : "";
	var country_code = req.body.country_code ? req.body.country_code : 0;

	var mobile_verification_code = req.body.mobile_verification_code ? req.body.mobile_verification_code : 0;

	var device_key = req.body.device_key ? req.body.device_key : "";
	var device_type = req.body.device_type ? req.body.device_type : "";
	var app_version = req.body.app_version ? req.body.app_version : "";
	var notification_key = req.body.notification_key ? req.body.notification_key : "";


     if (email == '') {
		var response = {
			"status": constants.ValidationStatusCode,
			"message": constants.EMAIL_VALIDATION
		};
		return res.status(constants.ValidationStatusCode).json(response);
	}  
	else if (password == '') {
		var response = {
			"status": constants.ValidationStatusCode,
			"msg": constants.PASSWORD_VALIDAATION
		};
		return res.status(constants.ValidationStatusCode).json(response);
	}
	else if (mobile_number == '') {
		var response = {
			"status": constants.ValidationStatusCode,
			"msg": "Phone number is required."
		};
		return res.status(constants.ValidationStatusCode).json(response);
	}
	else if (country_code == '') {
		var response = {
			"status": constants.ValidationStatusCode,
			"msg": "Country code is required."
		};
		return res.status(constants.ValidationStatusCode).json(response);
	}
	else if (mobile_verification_code == '') {
		var response = {
			"status": constants.ValidationStatusCode,
			"msg": "Mobile verify code is required."
		};
		return res.status(constants.ValidationStatusCode).json(response);
	}
	// else if (device_key == '') {
	// 	var response = {
	// 		"status": constants.ValidationStatusCode,
	// 		"message": constants.DEVICE_KEY_VALIDATION
	// 	};
	// return res.status(constants.ValidationStatusCode).json(response);
	// } 
	else if (device_type == '') {
		var response = {
			"status": constants.ValidationStatusCode,
			"message": constants.DEVICE_TYPE_VALIDATION
		};
		return res.status(constants.ValidationStatusCode).json(response);
	} else if (app_version == '') {
		var response = {
			"status": constants.ValidationStatusCode,
			"message": constants.APP_VERSION_VALIDATION
		};
		return res.status(constants.ValidationStatusCode).json(response);
	} else {
			email = UtilityHelper.encrypted(email); //--------------------  Encrypt Email  -------------
			mobile_number = UtilityHelper.encrypted(mobile_number); //--------------------  Encrypt Mobile Number  -------------
			//chk otp
			var user_sql = "SELECT * FROM user_temps WHERE mobile_number = '" + mobile_number +"' AND mobile_verification_code = '" + mobile_verification_code +"' ";
			dbConnection.query(user_sql, {
			 type: dbConnection.QueryTypes.SELECT
			 }).then(function(result) {
			if (result.length > 0) {
				var delete_sql = "DELETE FROM user_temps where email = '" +email+ "' ";
				dbConnection.query(delete_sql, {
					type: dbConnection.QueryTypes.DELETE
				}).then(function(delete_result) {});
				var insert_sql =
						"INSERT INTO `customers` (`first_name`, `last_name`, `email`, `password`, `country_code`, `mobile_number`, `customer_key`, `notification_key`, `device_key`, `device_type`, `status`, `remember_token`) VALUES ('" + first_name.trim() + "','" + last_name.trim() + "','" + email.trim() + "','" + password.trim() + "','" + country_code + "','" + mobile_number +"','" + uuidv1() +"','" + notification_key + "','" + device_key + "','" + device_type + "','active','')";

					//insert
					dbConnection.query(insert_sql, {
						type: dbConnection.QueryTypes.INSERT
					}).then(function(result2) {
						console.log(result2);
						if (result2.length > 0) {

							var user_sql = "SELECT * FROM customers WHERE id = '" + result2[0] + "'";

							//var user_sql = "SELECT id as user_id, customer_key as id, first_name, last_name, email, mobile_number, IFNULL(image, '') as image, status, status, country_code, IFNULL(address, '') as address, IFNULL(latitude, '') as latitude, IFNULL(longitude, '') as longitude, is_mobile_verify From customers Where `id` = '" + result2[0] +"' ";

							dbConnection.query(user_sql, {
								type: dbConnection.QueryTypes.SELECT
							}).then(function(user_data) {

								var info = JSON.stringify(user_data[0]); // remove datarowpacket in starting json 
								var token = jwt.sign(info, constants.TOKEN_VALUE) // generate token 

								user_data[0]["token"] = token;
								user_data[0]['email'] = UtilityHelper.decrypted(user_data[0]['email']);
								user_data[0]['mobile_number'] = UtilityHelper.decrypted(user_data[0]['mobile_number']);
	
								
								//send mail
								send_email_user(first_name, req.body.email, result2[0], function() {
									console.log('Send mail.....');
								});

								var response = {
									'status': constants.SuccessStatusCode,
									'message': constants.REGISTER_SUCCESS,
									'result': user_data[0],
								};
								return res.status(constants.SuccessStatusCode).json(response);
							});
						}
					}).catch(function(err) {
						console.log(' -- check users REGISTRATION Query failed err.message: ' + err);
						// response  to send
						var response = {
							'status': constants.ValidationStatusCode,
							'message': constants.SOMETHING_WENT_WRONG
						};
						return res.status(constants.SuccessStatusCode).json(response);
					});
			} else {
				 var response = {
				 	'status': constants.RecoredNotFoundStatusCode, 
				 	'message':  'Invalid verify code.',};
				     return res.status(constants.RecoredNotFoundStatusCode).json(response);
			}
		   });

	}
};
module.exports = registration;


function send_email_user(user_name, email,id) {
	// create a Email Template
	var id = (987654321+id);
	var mainMsg =
		'<table style="margin: 0px auto; max-width: 440px; font-family: arial;" border="0" width="509" cellspacing="15" cellpadding="0" bgcolor="#f0f4f5">' +
		'<tbody>' +
		'<tr bgcolor="#ffffff">' +
		'<td>' +
		'<table border="0" width="100%" cellspacing="0" cellpadding="15">' +
		'<tbody>' +
		'</tbody>' +
		'</table>' +
		'</td>' +
		'</tr>' +
		'<tr bgcolor="#ffffff">' +
		'<td>' +
		'<table style="border-color: gray;" border="0" cellspacing="0" cellpadding="15">' +
		'<tbody>' +
		'<tr>' +
		'<td>' +
		'<h5>Hello ' + user_name + ',</h5>' +
		'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">Welcome and thank you for signing up with VerAnd!</p>' +
		// '<p><a href ="'+constants.BASEURL+'web/email-veryfy?id='+id+'" style="background:#00715C; padding:5px 15px; border-radius:4px; -webkit-border-radius:4px; color:#fff; text-align:center; font-size:12px; text-decoration:none;">Click here to verify your email</a></p>'+
		'<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">Thank you !<br />VerAndi Team.</p>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>';
	//Mail to user 

	let transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.MAIL_USERNAME, // generated ethereal user
			pass: process.env.MAIL_PASSWORD // generated ethereal password
		}
	});
	let mailOptions = {
		from: '' + process.env.MAIL_FROM_NAME + ' <' + process.env.MAIL_FROM_EMAIL + '>', // sender address
		to: email, // list of receivers
		subject: 'Innsea Registration', // Subject line
		html: mainMsg // html body
	};

	
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	});
	//end mail
}