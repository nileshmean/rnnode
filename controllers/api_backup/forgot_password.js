var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
md5 = require('md5'),
_ = require('lodash');
var nodemailer = require('nodemailer');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(constants.TOKEN_VALUE);
var EmailHelper = require('../../libraries/EmailHelper')();
let logourl = constants.LOGO;


forgotPassword = function(req, res) {
    var response = {};
    var email = req.body.email ? req.body.email : '';
  
    if (email == '') {
           response.status = constants.ValidationStatusCode;
           response.message = constants.EmailValidation;
           res.status(response.status).json(response);
    } else {
     
        var user_exist_sql = "SELECT * FROM users WHERE email = '" + email + "'";
          
        dbConnection.query(user_exist_sql, {
            type: dbConnection.QueryTypes.SELECT
        }).then(function(result) {
            if (result.length > 0) {
                var otp_code = _.random(1000000000, 9999999999);

                var update_sql = "UPDATE users SET remember_token = '" +otp_code +"' WHERE id = '" + result[0].id + "'";

                dbConnection.query(update_sql, {
                    type: dbConnection.QueryTypes.UPDATE
                }).then(function(update_result) {
       
                const id = cryptr.encrypt(result[0].id);
                const code = cryptr.encrypt(otp_code);
                var resetLink = constants.WEBSITE_PATH+'reset-password?id='+id+'&remember_token='+code;
                dbConnection.query('SELECT * FROM `email_template` WHERE id=4',{type:dbConnection.QueryTypes.SELECT}).then(template=>{
                    let emailtemplate = template[0].body.replace('[USERNAME]', result[0].first_name.concat(' ', result[0].last_name)).replace('[LOGO]', "<img src='"+logourl+"' >").replace('[FrogotURL]', resetLink)
                    console.log('------------html templatae',emailtemplate,'-----------------------')
                    EmailHelper.sendEmail({email:email, subject:template[0].subject, body:emailtemplate}, function(){
                        console.log("mail sent.....")
                    })
                })
               // response.resetLink = resetLink;
                response.status = constants.SuccessStatusCode;
                response.message = constants.ForgotMail;
                res.status(response.status).json(response);
                   
                }).catch(function(err) {
                    console.log(' -- check forgot password Query failed err.message: ' +err.message);
                    // response  to send
                    response.status = constants.ErrorStatusCode;
                    response.message = constants.SomethingWentWrong;
                    res.status(response.status).json(response);
                });
            } else {
                response.status = constants.RecordNotFoundStatusCode;
                response.message = constants.ForgotMail;
                res.status(response.status).json(response);
            }
        });
    }
};
module.exports = forgotPassword;
