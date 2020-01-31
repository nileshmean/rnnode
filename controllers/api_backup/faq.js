var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

faq = (req, res)=>{

    var response = {};
 
        sql = "SELECT * FROM `FAQ` WHERE status = 'active' ";
       
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length > 0){
          response.result = result;
          response.status = constants.SuccessStatusCode;  console.log(result)
          return res.status(response.status).json(response)
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

module.exports = faq;