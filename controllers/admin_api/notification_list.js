var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

NotificationList = (req, res)=>{
  var response = {};


//  var lang = req.body.lang ? req.body.lang : "EN";

  var limit = req.body.limit ? parseInt(req.body.limit) : 10;
  var offset = req.body.offset ? parseInt(req.body.offset) : 0;

  //for search variable
  var search = req.body.search ? req.body.search : "";

  console.log(search);
  
  var sql = "SELECT id,user_from_id,user_tO_id,site_id,title,type,message,created_at FROM `notifications` WHERE deleted_at IS NULL" 
 
  var countSQL = "SELECT id,user_from_id,user_tO_id,site_id,title,type,message,created_at FROM `notifications` WHERE deleted_at IS NULL"

    //   sql = sql+" group by news.id";
    //   countSQL = countSQL+" group by news.id";

  if(search!== ""){
    sql = sql+"&& title LIKE '%"+search+"%' "
    countSQL = countSQL+"&& title LIKE '%"+search+"%'"
   }

  sql = sql+" ORDER BY id DESC LIMIT "+offset+", "+limit;
  
  dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT }).then(function(result){
    dbConnection.query(countSQL, {type:dbConnection.QueryTypes.SELECT }).then(function(countResult){
        response.result=result;
         response.count= countResult.length;
        response.status = constants.SuccessStatusCode;
         return res.status(response.status).json(response);
   })
  }).catch(function(err){
    console.log(err)
      response.message = constants.SomethingWentWrong;
      response.status = constants.ErrorStatusCode;
      return res.status(response.status).json(response);
  })
}
module.exports = NotificationList;