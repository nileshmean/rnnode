var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

 Login = (req, res)=>{

    var response = {
        message: constants.SomethingWentWrong,
        status:constants.ValidationStatusCode
    };
    
    promisses = [];
    var res_for_token = {}
    var email = req.body.email ? req.body.email: "";
    var password = req.body.password ? md5(req.body.password) : "";   
    var app_version = req.body.app_version ? req.body.app_version : "1.0";
    var device_key = req.body.device_key ? req.body.device_key : "";
    var device_type = req.body.device_type ? req.body.device_type : "web";
    var notification_key = req.body.notification_key ? req.body.notification_key : "";

    if(email === ''){
        response.message = constants.EmailValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(password === ''){
        response.message = constants.PASSWORD_VALIDATION;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }

    if(device_type === ''){
        response.message = "device type is required."
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }

    var data = {email:email, password: password}


        sql = "SELECT * FROM `users` WHERE `email`=:email && `password`=:password && deleted_at IS NULL"; 

   
    dbConnection.query(sql, {replacements: data, type: dbConnection.QueryTypes.SELECT}).then(function(result){

        console.log(result)

        if(result.length == 0){
           
                response.message = constants.INVALID_USER;
                response.status = constants.NotFoundStatusCode;
                return res.status(response.status).json(response)
            
          
        }else{
            if(result[0].status == 'active'){
                update_noti_sql = "UPDATE `users` SET notification_key='' WHERE notification_key = '"+notification_key+"'";
                promisses.push(
                    dbConnection.query(update_noti_sql,
                      {type:dbConnection.QueryTypes.UPDATE})
                      .then(update_res=>{})
                )
                var data = {
                    notification_key:notification_key,
                    device_key:device_key,
                    device_type:device_type
                }
                update_sql = "UPDATE `users` SET device_key=:device_key, device_type=:device_type, notification_key=:notification_key WHERE id="+result[0].id;
                promisses.push(
                    dbConnection.query(update_sql,
                        {type:dbConnection.QueryTypes.UPDATE, replacements:data})
                        .then(res=>{})
                )
                Promise.all(promisses).then(responce=> {
                    res_for_token.id = result[0].id;
                    res_for_token.first_name = result[0].first_name;
                    res_for_token.email = result[0].email;
                    res_for_token.phone = result[0].phone;
                    res_for_token.last_name = result[0].last_name;
            
                    var token = jwt.sign(res_for_token,constants.TOKEN_VALUE);
                    result[0].token = token;
                    
                    result[0].notification_key = notification_key;
                    result[0].device_type = device_type;
                    result[0].app_version = app_version;
                    result[0].device_key = device_key;
                    if(result[0].status == 'active'){

                        response.message = constants.LOGIN_SUCCESSFULL;
                        response.status = constants.SuccessStatusCode;
                        response.result = result[0]
                        return res.status(response.status).json(response)
                    }else{
                        response.message = constants.INACTIVE_USER;
                        response.status = constants.UnauthorizedStatusCode;
                        return res.status(response.status).json(response)
                    }
                }).catch(function(err){
                    console.log(err)
                    response.message = constants.SomethingWentWrong;
                    response.status = constants.ErrorStatusCode;
                    return res.status(response.status).json(response)
                })
                
            }else{
                response.message = constants.INACTIVE_USER;
                response.status = constants.NotFoundStatusCode;
                return res.status(response.status).json(response)
            }
        }
      
       
    })
      
  }
 
 
  module.exports= Login;