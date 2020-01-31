var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

NewsList = (req, res)=>{

    var response = {};
    var promisses = [];
    var limit = req.query.limit ? req.query.limit : 30;
    var offset = req.query.offset ? req.query.offset : 0;

    var category_id = req.query.category_id ? req.query.category_id : 0;

    var sql = "SELECT news.id,title, description,logo_image, magazine_image,category, news_link,status,date,category_name FROM `news` JOIN categories ON categories.id = news.category WHERE status = 'active' AND news.deleted_at IS null";
    var countQuery = "SELECT COUNT(id) as total FROM `news` WHERE status = 'active' AND news.deleted_at IS null"
    if(category_id != 0 && limit != 0){
        countQuery = "SELECT COUNT(id) as total FROM `news` WHERE status = 'active' AND news.deleted_at IS null"
      var sql = "SELECT news.id,title, description,logo_image, magazine_image,category, news_link,status,date,category_name FROM `news` JOIN categories ON categories.id = news.category WHERE status = 'active' AND news.deleted_at IS null AND category = "+category_id+" LIMIT "+ offset + "," + limit;
     }else if(limit != 0 && category_id == 0){
        var sql = "SELECT news.id,title, description,logo_image, magazine_image,category, news_link,status,date,category_name FROM `news` JOIN categories ON categories.id = news.category WHERE status = 'active' AND news.deleted_at IS null LIMIT "+ offset + "," + limit;
     }else if(category_id != 0){
         var sql = "SELECT news.id,title, description,logo_image, magazine_image,category, news_link,status,date,category_name FROM `news` JOIN categories ON categories.id = news.category WHERE status = 'active' AND news.deleted_at IS null AND category = "+category_id+" LIMIT "+ offset + "," + limit;
     }

    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        promisses.push(dbConnection.query(countQuery, {type:dbConnection.QueryTypes.SELECT}).then(count=>{
            console.log('count of news---------',count[0].total)
            response.total = count[0].total;
            
        }))
        if(result.length > 0){
            response.result = result;
            response.status = constants.SuccessStatusCode;
            //return res.status(response.status).json(response)
            
        }else{
            response.message = constants.RecordNotFound;
         response.status = constants.RecordNotFoundStatusCode;
         //return res.status(response.status).json(response)
        }
        Promise.all(promisses).then(respons =>{
            return res.status(response.status).json(response)
        }).catch(err=>{
            console.log(err)
            response.message = constants.SomethingWentWrong;
            response.status = constants.ErrorStatusCode;
            return res.status(response.status).json(response)
        })
        
    }).catch(function(err){
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response)
    })
   
}

module.exports = NewsList;