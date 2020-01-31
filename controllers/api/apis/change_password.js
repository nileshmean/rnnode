var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(constants.TOKEN_VALUE);

ChangePassword=(req,res)=>{
      var response = {};
     // console.log(res.locals.userData)
      var Id = res.locals.userData.id ? res.locals.userData.id :"";
      if(Id == ""){
          response.status = constants.ValidationStatusCode;
          response.message = constants.ID_VALIDATION;
          return res.status(response.status).json(response);
      }
      var old_password = req.body.old_password ? md5(req.body.old_password) : "";
      var new_password = req.body.new_password ? md5(req.body.new_password) : "";

      if(old_password == ""){
        response.status = constants.ValidationStatusCode;
        response.message = constants.CURRENT_PASSWORD_VALIDATION;
        return res.status(response.status).json(response);
     }
     if(new_password == ""){
        response.status = constants.ValidationStatusCode;
        response.message = constants.PASSWORD_VALIDATION;
        return res.status(response.status).json(response);
     }
      selectSql = "SELECT * FROM `users` WHERE id="+Id+" && password='"+old_password+"'";
    
      dbConnection.query(selectSql, {type: dbConnection.QueryTypes.SELECT}).then(function(user){
         // console.log(user.length);
           if(user.length > 0)
           {
               sql="UPDATE `users` SET  password = '"+new_password+"',remember_token='' WHERE id='"+Id+"'";
               dbConnection.query(sql, {type: dbConnection.QueryTypes.UPDATE}).then(function(result1){
                   //console.log(result1);
                    response.status = constants.SuccessStatusCode;
                    response.message = "Password change successfully";
                   // console.log(response)
                    return res.status(response.status).json(response);
                      // return res.json(response);
                  })
              }else{
                  response.status = constants.ValidationStatusCode;
                  response.message = constants.PASSWORD_NOT_MATCH;
                 // console.log(response)
                  return res.status(response.status).json(response);
              }
  
  
      }).catch(function (err) {
         // throw err;
          console.log(' -- check verify user Query failed err.message: ' + err);
          response.message = constants.SomethingWentWrong
          response.status = constants.ErrorStatusCode;
           return res.status(response.status).json(response);
         // return res.status(constants.RecordNotFoundStatusCode).json(response);
      });
     
  
}

module.exports = ChangePassword;