var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

my_social_products = (req, res)=>{

     var user_id = res.locals.userData.id;
     var response = {};

     sql = "SELECT * FROM `saved_social_products` WHERE user_id = "+user_id+" and deleted_at is NULL ORDER BY id DESC";
       
     dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length > 0){
          response.result = result;
          response.message = "";
          response.status = constants.SuccessStatusCode; 
          return res.status(response.status).json(response)
        }else{
         response.message = constants.RecordNotFound;
         response.status = constants.RecordNotFoundStatusCode;
         return res.status(response.status).json(response)
        }

    }).catch(function(err){
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response)
    })
}

module.exports = my_social_products;