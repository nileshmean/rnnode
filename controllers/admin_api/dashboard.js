var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

Dashboard = (req, res) => {
    var response = {};
    var responce = [];
    var favPromises = [];

    var sql = "SELECT * FROM `users` WHERE type='aesthetician'";
    dbConnection.query(sql, { 
        type: dbConnection.QueryTypes.SELECT 
        }).then(function (result) {
            response.registeredAesthetician = result.length;
            response.status = constants.SuccessStatusCode;
            return res.status(response.status).json(response);
       
    }).catch(function (err) {
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response);
    })
}
module.exports = Dashboard;