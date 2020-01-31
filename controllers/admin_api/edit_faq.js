var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var moment = require('moment');
EditFaq = (req, res) => {
    var response = {};
    var id = req.body.id ? req.body.id : "";
    var status =req.body.status ? req.body.status:"active"; 
    var question = req.body.question ? req.body.question : "";
    var IN_question = req.body.IN_question ? req.body.IN_question : "";
    var IT_question = req.body.IT_question ? req.body.IT_question : "";
    var FR_question = req.body.FR_question ? req.body.FR_question : "";
    var answer = req.body.answer ? req.body.answer : "";
    var IN_answer = req.body.IN_answer ? req.body.IN_answer : "";
    var IT_answer = req.body.IT_answer ? req.body.IT_answer : "";
    var FR_answer = req.body.FR_answer ? req.body.FR_answer : "";
    var update = new Date();
    update = moment(update).format("YYYY-MM-DD HH:mm:ss");

    if (id == '') {
        response.message = constants.ID_VALIDATION;
        return res.status(constants.ValidationStatusCode).json(response);
    }

    var data = {
        id: id,
        question: question,
        answer: answer,
        IN_question: IN_question,
        IT_question: IT_question,
        FR_question: FR_question,
        IN_answer: IN_answer,
        IT_answer: IT_answer,
        FR_answer: FR_answer,
        updated_at: update,
    }

    sql = "UPDATE `FAQ` SET `question`=:question,`answer`=:answer,`IN_question`=:IN_question,`IT_question`=:IT_question,`FR_question`=:FR_question,`IN_answer`=:IN_answer,`IT_answer`=:IT_answer,`FR_answer`=:FR_answer,`updated_at`=:updated_at WHERE `id`=:id";
    dbConnection.query(sql, { replacements: data, type: dbConnection.QueryTypes.UPDATE }).then(function (faq) {
        // console.log(about);
        if (faq.length > 0) {
            var response = {
                status: constants.SuccessStatusCode,
                message: constants.FAQ,
            };
            return res.status(constants.SuccessStatusCode).json(response);
        } else {
            var response = {};
            response.status = constants.ValidationStatusCode;
            response.message = constants.INACTIVE_USER;
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
module.exports = EditFaq;
