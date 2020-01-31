var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

SkillList = (req, res)=>{
    var response = {};
    var limit = req.query.limit ? req.query.limit : 10;
    var offset = req.query.offset ? req.query.offset : 0;
    var value = req.query.value ? req.query.value : "";
    sql = "SELECT * FROM `skills` WHERE status = 'active'";

    if(value !== ""){
       // sql = "SELECT * FROM `event` WHERE status = 'active' && "
    }
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        response.result = result;
        response.status = constants.SuccessStatusCode;
        return res.status(response.status).json(response)
    }).catch(function(err){
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response)
    })
}

module.exports = SkillList;