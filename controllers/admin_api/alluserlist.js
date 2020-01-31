var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var _ = require("lodash");
const logger = require("../../config/winstonConfig");

Userlist = (req, res) => {

  var response = {};
  var status = req.query.status ? req.query.status : "";
  var type= req.query.type ? req.query.type:"provider";
  var search = req.query.value ? req.query.value : "";
  var offset = req.query.offset ? parseInt(req.query.offset) : 0;
  var limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let user_promises = [];

  // create replacement for get listing query
  const select_replacement = {
    search: "%" + search + "%",
    status: status,
    limit: limit,
    offset: offset,
    type:type
  };

  const count_replacement = {
    search: "%" + search + "%",
    status: status,
  };

  let select_query = "SELECT * FROM `users`  WHERE type=:type";
  let count_query = "SELECT id , first_name,last_name,email FROM `users`  WHERE type=:type" ;

  if (status != '') {
    select_query += " AND status = :status";
    count_query += " AND status = :status";
  }

  select_query += " AND deleted_at IS NULL";
  if (search != '') {
    select_query += " HAVING CONCAT(first_name, ' ', last_name) LIKE :search ";
    count_query += " HAVING CONCAT(first_name, ' ', last_name) LIKE :search ";
  }
  //dbConnection.query(select_query,{type})
    user_promises.push(
      dbConnection.query(count_query,
        {type:dbConnection.QueryTypes.SELECT,
        replacements: select_replacement,
        }).then(user=>{
          response.count = user.length;
        console.log(user.length)
      })
    )
  select_query += " LIMIT "+offset+", "+limit;
   user_promises.push(
      dbConnection.query(select_query , {
      replacements: select_replacement,
      type: dbConnection.QueryTypes.SELECT
      }).then(results => {
        response.result = results;
        response.status=constants.SuccessStatusCode;
        console.log(results)
        
      })
    );

    Promise.all(user_promises).then(result=>{
      if(response.result.length > 0 ){
        
        return res.status(response.status).json(response);
      }
      else {
        // send response and with status code 200
        response.status=constants.NotFoundStatusCode;
        response.message = constants.RECORD_NOT_FOUND;
        return res.json(response);
      }
    }).catch((err)=> {
      console.log("On users.listing.promise.all() failed.", err);
      // send response and with status code 404
      res.status =  constants.ErrorStatusCode;
      res.status= constants.ErrorStatusCode;
      return res.json(response);
    });

}
module.exports = Userlist;
