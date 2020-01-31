var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
md5 = require('md5');
_ = require('lodash');
var nodemailer = require('nodemailer');


forgotPassword = (req, res) => {
    var email = req.body.email ? req.body.email : '';
    var response = {};

    if (email == "") {
        response.message = constants.EmailValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(constants.ValidationStatusCode).json(response);
    }

    var query1 = "SELECT * FROM admin WHERE email = :email LIMIT 1";
    dbConnection.query(query1, { replacements: { email: email }, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        if (result.length > 0) {
            var result = result[0];
            var otp_code = _.random(1000000000, 9999999999);
            var query2 = "UPDATE admin SET remember_token = :remember_token WHERE id = :id";
            var data = { id: result.id, remember_token: otp_code };
            dbConnection.query(query2, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
            .then(result_update => {
                send_email_user(result.first_name, email, otp_code, result.id, function() {});
                response.message = constants.ForgotMail;
                response.status = constants.SuccessStatusCode;
                return res.status(constants.SuccessStatusCode).json(response);
            })
        } else {
            response.message = constants.EMAIL_NOT_REGISTER;
            response.status = constants.ValidationStatusCode;
            return res.status(constants.ValidationStatusCode).json(response);
        }
    })
    .catch(err => {
        console.log("Error into forgot_password.js ", err);
        response.message = constants.SomethingWentWrong;
        return res.status(constants.ErrorStatusCode).json(response);
    });
};
module.exports = forgotPassword;

function send_email_user(user_name, email, token, user_id,) {
    
    var FrogotURL = constants.BASEURL+'auth/reset-password?user_id='+user_id+'&token='+token;

    // console.log("FrogotURL : "+FrogotURL);

    var mainMsg =
        '<table style="margin: 0px auto; max-width: 440px; font-family: arial;" border="0" width="509" cellspacing="15" cellpadding="0" bgcolor="#f0f4f5">' +
        '<tbody>' +
        '<tr bgcolor="#ffffff">' +
        '<td>' +
        '<table border="0" width="100%" cellspacing="0" cellpadding="15">' +
        '<tbody> ' +
        '<tr>' +
        '<td>   <img src="' + constants.LOGO + '" alt="hydrafacial" style="width:150px; ">' +
        '</td>' +
        '</tr>' +
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
        '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">Someone recently requested a password change for your Hydrafacial account. If this was you, please click the link below and folow the instructions to create a new password here.</p>' +
        '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;"><a href="'+FrogotURL+'">CLICK HERE</a></p>' +
        '<p style="margin: 0; padding: 0px; font-family: arial; font-size: 13px; color: #121212; line-height: 18px; padding-bottom: 10px;">Thank you !<br />Hydarfacial Team.</p>' +
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
        // to:"jitendra.mankare@idealittechno.com",
        subject: 'Forgot Password', // Subject line
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
