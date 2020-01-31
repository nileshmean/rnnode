// Get question details.
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

GetQuestion = (req, res) => {
    var response = {};
    var id = req.query.id ? req.query.id : "";

    var query = "SELECT * FROM security_questions WHERE id=:id AND deleted_at IS NULL";
    dbConnection.query(query, { replacements: { id: id }, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        if (result.length > 0) {
            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.SuccessStatusCode;
            response.message = "Question details.";
            response.result = result[0];
            res.send(response);
        } else {
            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.RecordNotFoundStatusCode;
            response.message = constants.RecordNotFound;
            res.send(response);
        }
    })
    .catch(err => {
        console.error("Error in get_question_details.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = GetQuestion;