// Add security question.
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

AddQuestion = (req, res) => {
    var response = {};
    var question = req.body.question ? req.body.question : "";
    
    var query = "INSERT INTO security_questions(question) VALUES (:question)";
    dbConnection.query(query, { replacements: { question: question }, type: dbConnection.QueryTypes.INSERT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.QUESTION_ADD_SUCCESS;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = AddQuestion;