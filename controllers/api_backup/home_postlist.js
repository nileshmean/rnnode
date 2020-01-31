dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

HomePostList = (req, res)=>{
    var response = {};
    var limit = req.query.limit ? req.query.limit : 5;
    var offset = req.query.offset ? req.query.offset : 0;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    var countQuery = "SELECT COUNT(id) as total FROM `feeds` WHERE status = 'active' AND deleted_at IS null";
    //var user_id = res.locals.userData.id;


         sql = "SELECT * FROM feeds WHERE feeds.status = 'active' && feeds.deleted_at IS NULL ORDER BY `feeds`.`id` DESC LIMIT "+ offset + "," + limit;
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        
        if(result.length > 0){
            dbConnection.query(countQuery, {type:dbConnection.QueryTypes.SELECT}).then(count => {
                response.total = count[0].total;
                response.result = result;
                response.status = constants.SuccessStatusCode; 
                return res.status(response.status).json(response)
            })
         
        }else{
         response.message = constants.RecordNotFound;
         response.status = constants.RecordNotFoundStatusCode;
         return res.status(response.status).json(response)
        }

    }).catch(function(err){
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response)
    })
}

module.exports = HomePostList;