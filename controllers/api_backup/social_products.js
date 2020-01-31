var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

social_products = (req, res)=>{

     var response = {};
     //sql = "SELECT * FROM `social_products` WHERE status = 'active' AND deleted_at is NULL and  ORDER BY id DESC";
       //var sql = "SELECT social_products.* FROM `social_products` WHERE (select COUNT(id) from saved_social_products WHERE saved_social_products.social_product_id = social_products.id) < 1";
      var sql = "SELECT * FROM `social_products` WHERE id NOT IN(SELECT social_product_id FROM saved_social_products)";
      
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

module.exports = social_products;