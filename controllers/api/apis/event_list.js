var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var moment = require('moment-timezone');

EventList = (req, res)=>{
    var response = {};
    var limit = req.query.limit ? req.query.limit : "";
    var offset = req.query.offset ? req.query.offset : 0;
 
    var type = req.query.type ? req.query.type : "upcoming"; //upcoming, completed

    var dateTime = moment().utc().format("YYYY-MM-DD HH:mm:ss");
  if(limit !== ""){

      if(type == 'upcoming'){
       sql = "SELECT * FROM `event` WHERE status = 'active' && deleted_at IS NULL && ends_date > '"+dateTime+"' LIMIT "+ offset + "," + limit;
      }else{
          sql = "SELECT * FROM `event` WHERE status = 'active' && deleted_at IS NULL && ends_date <= '"+dateTime+"'  LIMIT "+ offset + "," + limit;
      }
  }else{
      console.log(req.query)
      sql = "SELECT * FROM `event` WHERE status = 'active' && deleted_at IS NULL ";
  }
    
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length > 0)
        {
          response.result = result;
          response.status = constants.SuccessStatusCode;
          return res.status(response.status).json(response)
        }
         response.message = constants.RecordNotFound;
         response.status = constants.RecordNotFoundStatusCode;
         return res.status(response.status).json(response)
    }).catch(function(err){
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response)
    })
}

module.exports = EventList;