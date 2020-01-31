var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

FeedsList = (req, res)=>{
    var response = {};
    var limit = req.query.limit ? req.query.limit : 10;
    var offset = req.query.offset ? req.query.offset : 0;

    var user_id = req.query.user_id ? req.query.user_id : "";
    var countQuery = "SELECT COUNT(id) as total FROM `feeds` WHERE status = 'active' AND deleted_at IS null"
    if(user_id != ""){
         sql = "SELECT feeds.id, title, description, user_id, feeds.image as feed_image,category,feeds.updated_at,users.type as user_type, users.first_name, users.last_name, email, users.image as user_image, (SELECT count(*) FROM feeds_comment where feed_id = feeds.id) as total_comment FROM `feeds` JOIN `users` ON users.id = feeds.user_id WHERE feeds.status = 'active' && feeds.deleted_at IS NULL AND user_id = "+user_id+" ORDER BY `feeds`.`id` DESC LIMIT "+ offset + "," + limit;
    }
    else{
        sql = "SELECT feeds.id, title, description, user_id, feeds.image as feed_image,category,feeds.updated_at,users.type as user_type, users.first_name, users.last_name, email, users.image as user_image, (SELECT count(*) FROM feeds_comment where feed_id = feeds.id) as total_comment FROM `feeds` JOIN `users` ON users.id = feeds.user_id WHERE feeds.status = 'active' && feeds.deleted_at IS NULL ORDER BY `feeds`.`id` DESC LIMIT "+ offset + "," + limit;
       }
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        
        if(result.length > 0){
            dbConnection.query(countQuery, {type:dbConnection.QueryTypes.SELECT}).then(count => {
                response.total = count[0].total;
                response.result = result;
                response.status = constants.SuccessStatusCode;  console.log(result)
                return res.status(response.status).json(response)
            })
         
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

module.exports = FeedsList;