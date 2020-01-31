dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

MyPostList = (req, res)=>{
    var response = {};
    var countQuery = "SELECT COUNT(id) as total FROM `feeds` WHERE status = 'active' AND deleted_at IS null"
    var user_id = res.locals.userData.id;

    if(user_id != "" ){
         sql = "SELECT * FROM feeds WHERE feeds.status = 'active' && feeds.deleted_at IS NULL AND user_id = "+user_id+" ORDER BY `feeds`.`id`";
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

module.exports = MyPostList;