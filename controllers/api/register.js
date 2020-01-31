var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
_ = require('lodash');
var EmailHelper = require('../../libraries/EmailHelper')();
let logourl =constants.LOGO
Register = (req, res) =>{

    var response = {
        message: constants.SomethingWentWrong,
        status:constants.ValidationStatusCode
    };
    //console.log(req.body)
    var promisses = [];

    var email = req.body.email ? req.body.email: "";
    var password = req.body.password ? md5(req.body.password) : "";
    var first_name = req.body.first_name ? req.body.first_name: "";
    var last_name = req.body.last_name ?  req.body.last_name : "";
    var phone = req.body.phone ? req.body.phone : '';
    var country_code = req.body.country_code ? req.body.country_code :"";
  
    var device_key = req.body.device_key ? req.body.device_key : "";
	var device_type = req.body.device_type ? req.body.device_type : "web";
	var app_version = req.body.app_version ? req.body.app_version : "";
    var notification_key = req.body.notification_key ? req.body.notification_key : "";
    

   
    if(first_name === ''){
        response.message = constants.FirstNameValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(last_name === ''){
        response.message = constants.LastNameValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(phone === ''){
        response.message = constants.PhoneValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }

    if(email === ''){
        response.message = constants.EmailValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }

      var data = {
        first_name:first_name,
        last_name:last_name,
        email:email,
        password:password,
        country_code:country_code,
        phone:phone,
        status:'active',
        device_key: device_key,
        device_type:device_type,
        app_version:app_version,
        notification_key:notification_key,
        
        
    }
    var randomNumber = _.random(1000, 9999);
    var todayDate = new Date();
    var _date = parseInt(todayDate.getFullYear() + "" + (todayDate.getMonth() + 1) + "" + todayDate.getDate());
    var _time = parseInt(todayDate.getHours() + "" + todayDate.getMinutes() + "" + todayDate.getSeconds());
    var public_id = parseInt(randomNumber +""+ _date +""+ _time);
    data.public_id = public_id;

    existsSql= "SELECT * FROM `users` WHERE email='"+email+"' OR phone='"+phone+"' && deleted_at is NULL";
    dbConnection.query(existsSql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length > 0){
            response.message = constants.AlreadyExists;
            response.status = constants.ConflictStatusCode;
            return res.status(response.status).json(response)
        }else{



            
            sql = "INSERT INTO `users` SET first_name=:first_name, last_name=:last_name, email=:email, password=:password, phone=:phone, country_code=:country_code,public_id=:public_id";
            sql+= ", device_type=:device_type, notification_key=:notification_key, device_key=:device_key, app_version=:app_version"
            dbConnection.query(sql, {replacements:data, type:dbConnection.QueryTypes.INSERT})
            .then(result => {
                const userId = result[0]; // To get inserted ID.
                response.result = result[0];

                // for(var i=0; i<)
                Promise.all(promisses).then(result=>{
                    var res_for_token = {};
                    response.status = constants.SuccessStatusCode;
                    response.message = constants.REGISTERD;
                    res_for_token.id = userId;
                    res_for_token.first_name = first_name;
                    res_for_token.last_name = last_name;
                    res_for_token.email = email;
                    res_for_token.phone = phone;
                   // delete response.result;
                    var token = jwt.sign(res_for_token, constants.TOKEN_VALUE);
                    res_for_token.token = token
                    response.result = {token: token}
                   // response.result.id = res_for_token.id;
                   // response.result = token;

                   // response.token = token;
                  //  console.log("hiiiiiii",response.result[0].token)
                   dbConnection.query('SELECT * FROM `email_template` WHERE id=3',{type:dbConnection.QueryTypes.SELECT}).then(template=>{
                        let emailtemplate = template[0].body.replace('[USERNAME]', first_name.concat(' ', last_name)).replace('[LOGO]', "<img src='"+logourl+"' >")
                        EmailHelper.sendEmail({email:email, subject:"Forgot Password", body:emailtemplate}, function(){
                            console.log("mail sent.....")
                        })
                   })

                   //response.token = response.result.token;

                    return res.status(response.status).json(response);
                   
                }).catch(function(err){
                    console.log('i am here first',err);
                   response.message = constants.SomethingWentWrong;
                   response.status = constants.ErrorStatusCode;
                   return res.status(response.status).json(response)
                })
                
            }).catch(function(err){
               console.log('i am here second',err);
               response.message = constants.SomethingWentWrong;
               response.status = constants.ErrorStatusCode;
               return res.status(response.status).json(response)
            })
        }
    })

    
}

module.exports = Register;
