var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var md5 = require('md5');

ChangePassword = (req, res) => {
    var response = {};
    var Id =req.body.id ? req.body.id :"";
    var current_password = req.body.old_password ? md5(req.body.old_password) : "";
    var new_password = req.body.new_password ? md5(req.body.new_password) : "";
    var confirm_new_password = req.body.new_password ? md5(req.body.new_password) : "";

    if (current_password == '') {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.OLD_PASSWORD_VALIDATION;
        res.send(response);
    }

    if(new_password == ''){
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.NEW_PASSWORD_VALIDATION;
        res.send(response);
    }

    if(confirm_new_password == ''){
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.CONFIRM_PASSWORD_VALIDATION;
        res.send(response);
    }

    sql = "SELECT * FROM `admin` WHERE id = '"+Id+"' AND password = '"+current_password+"'";
      
    dbConnection.query(sql, {type: dbConnection.QueryTypes.SELECT}).then(function(user){
        // console.log(user.length);
         if(user.length > 0)
         {

             sql="UPDATE `admin` SET  password = '"+new_password+"' WHERE id='"+Id+"' AND password='"+current_password+"'";
             dbConnection.query(sql, {type: dbConnection.QueryTypes.UPDATE}).then(function(result1){
                res.statusCode = constants.SuccessStatusCode;
                response.status = constants.SuccessStatusCode;
                response.message = "Password update successfull.";
                res.send(response);
            })
        }else{
            res.statusCode = constants.ValidationStatusCode;
            response.status = constants.ValidationStatusCode;
            response.message = "Not Update Successfull.";
            res.send(response);
        }
            
        
    }).catch(function (err) {
        console.log("Error into change_password.js", err);
        res.statusCode = constants.SomethingWentWrong;
        response.status = constants.SomethingWentWrong;
        response.message = constants.SOMETHING_WENT_WRONG;
        res.send(response);
    });
}
module.exports = ChangePassword;