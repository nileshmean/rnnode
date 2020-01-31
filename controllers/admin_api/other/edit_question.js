// Edit security question.
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

EditQuestion = (req, res) => {
    var response = {};
    var id = req.body.id ? req.body.id : "";
    var question = req.body.question ? req.body.question : "";
    
    var data = { id: id, question: question };
    var query = "UPDATE security_questions SET question=:question WHERE id=:id";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.QUESTION_UPDATE;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditQuestion;