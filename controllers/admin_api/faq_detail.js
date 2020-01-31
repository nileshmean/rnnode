var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

Faqdetail = (req, res) => {
    var response = {};
    var id =req.body.id ? req.body.id: ""; 
    
    if (id == '') {
        response.message = constants.ID_VALIDATION;
        return res.status(constants.ValidationStatusCode).json(response);
    }
    
    var sql = "SELECT * FROM `FAQ` WHERE deleted_at IS NULL && id='"+id+"'";
    dbConnection.query(sql, { type: dbConnection.QueryTypes.SELECT }).then(function (result) {
            response.result = result;
            response.status = constants.SuccessStatusCode;
            return res.status(response.status).json(response);

    }).catch(function (err) {
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response);
    })
}
module.exports = Faqdetail;