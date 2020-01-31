var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

CheckEmail=(req,res)=>{
    var response = {};
    var email = req.body.email ? req.body.email : '';

    if(email == ''){
        response.status = constants.ValidationStatusCode;
        response.message = constants.EmailNotRegistered;
        return res.status(response.status).json(response)
    }
    sqlExists = "SELECT * FROM `users` WHERE email=:email && deleted_at IS NULL";
    dbConnection.query(sqlExists, {replacements:{email:email}, type:dbConnection.QueryTypes.SELECT})
    .then(function(result){
        if(result.length >0){
            response.status = constants.ConflictStatusCode;
            response.message = constants.AlreadyExists;
            return res.status(response.status).json(response)
        }else{
            response.status = constants.SuccessStatusCode;
            response.message = constants.Success;
            return res.status(response.status).json(response)
        }
    })
}
module.exports= CheckEmail