var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

feeds_user = (req, res)=>{
    var response = {};

    //var limit = req.query.limit ? req.query.limit : 6;
   // var offset = req.query.offset ? req.query.offset : 0;   
    var userId = res.locals.userData.id; 
 
    sql = "SELECT users.id, users.type as user_type, users.first_name, users.last_name, users.image as user_image FROM `feeds` JOIN `users` ON users.id = feeds.user_id WHERE feeds.status = 'active' and feeds.deleted_at is null group by users.id ";
       
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length > 0){
          response.result = result;
          response.status = constants.SuccessStatusCode;  console.log(result)
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

module.exports = feeds_user;