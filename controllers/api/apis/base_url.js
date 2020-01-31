var constants = require('./../../config/constants');
var dbConnection = require('../../config/connection');


baseUrl = function(req, res) {

    var promisses = [];
    var cat = [];
    
    var response = {
      message: "Success",
      status: constants.SuccessStatusCode,
      base_url: constants.APIURL,
      app_version: "1.0",
      copyright: "Copyright @ 2019 Hydra",
      provider_image: constants.BASEURL+"public/uploads/provider/",
      aesthetician_image: constants.BASEURL+"public/uploads/aesthetician/",
      news_image: constants.BASEURL+"public/uploads/news/",
      feeds_image: constants.BASEURL+"public/uploads/feeds/",
      event_image: constants.BASEURL+"public/uploads/event/",
      social_products_image: constants.BASEURL+"public/uploads/social_products/",
    };

    sql = "SELECT id, question FROM `security_questions` WHERE status = 'active' and deleted_at is null";
    promisses.push(dbConnection.query(sql, {type: dbConnection.QueryTypes.SELECT}).then(result => {
      response.security_questions = result;
    }))

    sql2 = "SELECT id, name FROM `states` WHERE status = 'active' and deleted_at is null";
    promisses.push(dbConnection.query(sql2, {type: dbConnection.QueryTypes.SELECT}).then(result => {
      response.states = result;
    }))

    sql3 = "SELECT id, category_name as name FROM `categories` WHERE type='news' and deleted_at is null";
    promisses.push(dbConnection.query(sql3, {type: dbConnection.QueryTypes.SELECT}).then(result => {
      var item = {"id": 0,"name": "all"};
      cat.push(item);
      for(var i=0; i<result.length; i++){
        cat.push(result[i]);
      }
      
      response.category = cat;
    }))
    Promise.all(promisses).then(respons=>{
      return res.status(constants.SuccessStatusCode).json(response);
    })
    

};

module.exports = baseUrl;
