var constants = require('./../../config/constants');
var dbConnection = require('../../config/connection');


Category = function(req, res) {

    var promisses = [];
    var response = {};
    

    sql3 = "SELECT id, category_name as name FROM `categories` WHERE type='feeds'";
   dbConnection.query(sql3, {type: dbConnection.QueryTypes.SELECT}).then(result => {
         
      response.result = result;
      response.status = constants.SuccessStatusCode
      return res.status(constants.SuccessStatusCode).json(response);
    }).catch(err => {
        console.log(err);
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode
        return res.status(constants.ErrorStatusCode).json(response);
    })
    // Promise.all(promisses).then(respons=>{
    //   return res.status(constants.SuccessStatusCode).json(response);
    // })
    

};

module.exports = Category;
