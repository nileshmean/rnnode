var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var _ = require("lodash");
const logger = require("../../config/winstonConfig");

Userdetail = (req, res) => {
  var response = {};
  var id=req.body.id ?req.body.id :"";
  var favPromises = [];
  var resource_detail = [];
  const select_replacement = {
    id:id,
  };

  sql = "SELECT users.id,users.user_name,users.image as image,users.password,users.status,users.price_per_hour,users.qualification, users.customerIds, users.type,users.email,users.phone,users.created_at, users.customerIds, GROUP_CONCAT(users_meta.meta_value SEPARATOR ' ') AS name FROM `users` JOIN users_meta ON users.id = users_meta.user_id WHERE `id`=:id";
  dbConnection.query(sql,{replacements:select_replacement,type: dbConnection.QueryTypes.SELECT}).then(function(result){
    console.log(result)
    var responce = result;
    if(result.length > 0){
      for(i=0; i< result.length; i++){
        (function(i){
          var resource_id = responce[i].resource_id;
          userSql = "SELECT meta_key, meta_value FROM `users_meta` WHERE user_id ='"+id+"'";
          favPromises.push(dbConnection.query(userSql,{type:dbConnection.QueryTypes.SELECT}).then(function(user){
            var detail = {id:resource_id, working_hours:responce[i].working_hours,image:user[0].image};
            responce[0].user = user;
          }))
        })(i)
       }

      //Select customer
      var customer_sql = "SELECT id, user_name FROM users where type = 'customer' AND deleted_at is NULL" 
      favPromises.push(dbConnection.query(customer_sql,{type:dbConnection.QueryTypes.SELECT}).then(function(customers){
            responce[0].customers = customers;
          }))

      Promise.all(favPromises).then(function(result) {
            console.log(result)
            delete responce[0].resource_id;
            delete responce[0].working_hours;
        response.result = responce[0];
        response.status = constants.SuccessStatusCode;
        return res.status(response.status).json(response);
         });
    }else{
      response.message = constants.RecordNotFound;
      response.status = constants.NotFoundStatusCode;
      return res.json(response);
    }
  }).catch(function(err){
    throw err;
    response.status = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    return res.status(response.status).json(response);
  })  
}
module.exports = Userdetail;
