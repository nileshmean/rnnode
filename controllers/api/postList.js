dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

FeedsList = (req, res)=>{
    var response = {};
    var limit = req.query.limit ? req.query.limit : 5;
    var offset = req.query.offset ? req.query.offset : 0;

    var user_id = req.query.user_id ? req.query.user_id : "";
    var category = req.query.category ? req.query.category : "";
    var filter = req.query.filter ? req.query.filter : "";
    var countQuery = "SELECT COUNT(AdId) as total FROM `post` WHERE AdStatus = 'active' AND DeletedOn IS null"
    if(category !== ''){
        countQuery = "SELECT COUNT(AdId) as total FROM `post` WHERE AdStatus = 'active' AND DeletedOn IS null && category= '"+category+"' ";
    }
    if(category != ""){
    }
    else{
        sql = "SELECT * FROM `post`  WHERE post.AdStatus= 'active' && post.DeletedOn IS NULL ORDER BY `post`.`AdId` DESC LIMIT "+ offset + "," + limit;
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