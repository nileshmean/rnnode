var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(constants.TOKEN_VALUE);

ResetPassword=(req,res)=>{
      var response = {};
      console.log(req.body)
      var Id = req.body.id ? cryptr.decrypt(req.body.id) :"";
      if(Id == ""){
          response.status = constants.ValidationStatusCode;
          response.message = constants.ID_VALIDATION;
          return res.status(response.status).json(response);
      }
      var remember_token = req.body.remember_token ? cryptr.decrypt(req.body.remember_token) : "";
      var password = req.body.password ? md5(req.body.password) : "";

      selectSql = "SELECT * FROM `users` WHERE id="+Id+" AND remember_token='"+remember_token+"' AND deleted_at is null ";
    
      dbConnection.query(selectSql, {type: dbConnection.QueryTypes.SELECT}).then(function(user){
          console.log(user.length);
           if(user.length > 0)
           {
               sql="UPDATE `users` SET  password = '"+password+"',remember_token='' WHERE id='"+Id+"'";
               dbConnection.query(sql, {type: dbConnection.QueryTypes.UPDATE}).then(function(result1){
                   console.log(result1);
                    response.status = constants.SuccessStatusCode;
                    response.message = "Updated Successfully.";
                    console.log(response)
                    return res.status(response.status).json(response);
                      // return res.json(response);
                  })
              }else{
                  response.status = constants.ValidationStatusCode;
                  response.message = constants.SomethingWentWrong;
                  console.log(response)
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

module.exports = ResetPassword;