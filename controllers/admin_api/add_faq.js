var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var NotificationHelper = require('./../../library/NotificationHelper')();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment-timezone');

AddFaq = (req, res) => {

    var response = {};
    var created_at = moment().utc().format("YYYY-MM-DD HH:mm:ss");

    var question = req.body.question ? req.body.question : "";
    var IN_question = req.body.IN_question ? req.body.IN_question : "";
    var FR_question = req.body.FR_question ? req.body.FR_question : "";
    var IT_question = req.body.IT_question ? req.body.IT_question : "";
    var answer = req.body.answer ? req.body.answer : "";
    var IN_answer = req.body.IN_answer ? req.body.IN_answer : "";
    var FR_answer = req.body.FR_answer ? req.body.FR_answer : "";
    var IT_answer = req.body.IT_answer ? req.body.IT_answer : "";
    var status = req.body.status ? req.body.status : "active";
  
 

    var insertData = {
        question: question,
        IT_question: IT_question,
        FR_question: FR_question,
        IN_question: IN_question,
        answer: answer,
        IT_answer: IT_answer,
        FR_answer: FR_answer,
        IN_answer: IN_answer,
        status: status,
        created_at: created_at,
    };

    console.log(insertData);

    sql = "INSERT INTO `FAQ` SET " +
        "`question`=:question," +
        "`IN_question`=:IN_question," +
        "`IT_question`=:IT_question," +
        "`FR_question`=:FR_question," +
        "`answer`=:answer," +
        "`IN_answer`=:IN_answer," +
        "`IT_answer`=:IT_answer," +
        "`FR_answer`=:FR_answer," +
        "`status`=:status," +
        "`created_at`=:created_at";


    dbConnection.query(sql,
        {
            replacements: insertData,
            type: dbConnection.QueryTypes.INSERT
        }).then(function (user) {
            if (user.length > 0) {
                var response = {
                    status: constants.SuccessStatusCode,
                    message: 'Insert Successfully.',
                };
                return res.status(response.status).json(response);

            } else {
                var response = {};
                response.status = constants.ValidationStatusCode;
                response.message = constants.INVALID_USER;
                console.log(response)
                res.status(response.status).json(response);
            }
        }).catch(function (err) {
            throw err;
            console.log(' -- check verify user Query failed err.message: ' + err);
            response.message = constants.SOMETHING_WENT_WRONG;
            response.status = constants.SomethingWentWrong;
            return res.json(response);
        });

}

module.exports = AddFaq;
