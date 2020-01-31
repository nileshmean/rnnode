var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var moment = require('moment');

CreateProfile = (req, res) => {

    var response = {
        message: constants.SomethingWentWrong,
        status:constants.ValidationStatusCode
    };

    var response = {};
    var userId = res.locals.userData.id;
    var data = {id:userId};
   
    var title = req.body.title ? req.body.title: "";
    var description = req.body.description ? md5(req.body.description) : "";
    var category = req.body.first_name ? req.body.category: "1";
    var gender = req.body.gender ?  req.body.gender : "male";
    var phone = req.body.phone ? req.body.phone : '';
    var country_code = req.body.country_code ? req.body.country_code :"";
  
    var device_key = req.body.device_key ? req.body.device_key : "";
	var device_type = req.body.device_type ? req.body.device_type : "web";
	var app_version = req.body.app_version ? req.body.app_version : "";
    var notification_key = req.body.notification_key ? req.body.notification_key : "";
    

   
    if(title === ''){
        response.message = constants.FirstNameValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(description === ''){
        response.message = constants.LastNameValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }



    var data = {
        title:title,
        description:description,
        gender:gender,
        // incall:incall,
        // outcall:outcall,
        // exclusive_call:exclusive_call,
        // country:country,
        // state:state,
        // city:city,
        status:'active',
  
        
    }
  
    select_sql = "SELECT * FROM users WHERE id = "+userId;
    dbConnection.query(select_sql, {type:dbConnection.QueryTypes.SELECT}).then(result => {
        if(result.length > 0){
          //  sql = "INSERT INTO `users` SET first_name=:first_name, last_name=:last_name, email=:email, password=:password, phone=:phone, country_code=:country_code,public_id=:public_id";

            var sql = "INSERT INTO `feeds` SET title=:title, description=:description, status=:status, gender=:gender, user_id="+userId+"";
            dbConnection.query(sql, { replacements: data, type: dbConnection.QueryTypes.INSERT })
            .then(result => {
                
                        response.status = constants.SuccessStatusCode;
                        response.message = "Profile saved successfully.";
                        return res.status(response.status).json(response);
                             
            })
            .catch(err => {
                console.error("Error into edit_profile.js", err);
                response.message = constants.SomethingWentWrong;
                response.status = constants.ErrorStatusCode;
                return res.status(response.status).json(response);
            });
        }else{
            response.message = constants.INACTIVE_USER;
            response.status = constants.NotFoundStatusCode;
            return res.status(response.status).json(response)
        }
    
    })
   

}

module.exports = CreateProfile;