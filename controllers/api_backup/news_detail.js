var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

NewsDetail = (req, res)=>{
    var response = {};
    var id = req.query.id ? req.query.id : "";

    if(id == '' || id == undefined){
        response.status = constants.ValidationStatusCode;
        response.message = constants.ID_VALIDATION;
        return res.status(response.status).json(response);
    }
     
    sql = "SELECT news.id,title, description,logo_image, magazine_image,category, news_link,status,date,category_name FROM `news` JOIN categories ON categories.id = news.category WHERE status = 'active' && news.deleted_at is NULL && news.id = "+ id;
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length == 0){
            response.message = constants.RecordNotFound;
            response.status = constants.NotFoundStatusCode;
            return res.status(response.status).json(response)
        }
        response.result = result[0];
        response.status = constants.SuccessStatusCode;
        return res.status(response.status).json(response)
    }).catch(function(err){
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response)
    })
}

module.exports = NewsDetail;