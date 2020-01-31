var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');

ChangeUserPassword = (req, res) => {
    var response = {};
    var Id =req.body.id ? req.body.id :"";
    var password = req.body.password ? md5(req.body.password) : "";

   
    if(password == ''){
        response.message = constants.NEW_PASSWORD_VALIDATION;
        return res.status(constants.ValidationStatusCode).json(response);
    }

    sql = "SELECT * FROM `users` WHERE id = '"+Id+"'";      
    dbConnection.query(sql, {type: dbConnection.QueryTypes.SELECT}).then(function(user){
        console.log(user.length);
         if(user.length > 0)
         {

             sql="UPDATE `users` SET  password = '"+password+"' WHERE id='"+Id+"'";
             dbConnection.query(sql, {type: dbConnection.QueryTypes.UPDATE}).then(function(result1){
                 console.log(result1);
                 var response = {
                     status: constants.SuccessStatusCode,
                     message: 'Update Password Successfull.',
                    };        
                    console.log(response)
                    return res.status(constants.SuccessStatusCode).json(response);
                    // return res.json(response);
                })
            }else{
                var response = {};
                response.status = constants.ValidationStatusCode;
                response.message = "Password Not Update Successfull.";
                console.log(response)
                res.status(response.status).json(response);
            }
            
        
    }).catch(function (err) {
        throw err;
        console.log(' -- check verify user Query failed err.message: ' + err);
        response.message = constants.SOMETHING_WENT_WRONG;
        response.status = constants.SomethingWentWrong;
         return res.json(response);
       // return res.status(constants.RecordNotFoundStatusCode).json(response);
    });
}
module.exports = ChangeUserPassword;
