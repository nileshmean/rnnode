// Get all security questions.
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

QuestionsList = (req, res) => {
    var response = {};
    var questionData = {};
    var promises = [];
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;
    var offset = req.query.offset ? parseInt(req.query.offset) : 0;
    var status = req.query.status ? req.query.status : "";
    var search_value = req.query.value ? req.query.value : "";

    var data1 = { limit: limit, offset: offset, status: status, search_value: search_value };
    var data2 = { status: status, search_value: search_value };

    var query1 = "SELECT * FROM security_questions WHERE deleted_at IS NULL";
    var query2 = "SELECT COUNT(*) AS count FROM security_questions WHERE deleted_at IS NULL";

    if (status != "") {
        query1 += " AND status=:status";
        query2 += " AND status=:status";
    }

    if (search_value != "") {
        query1 += " AND question LIKE '%"+ search_value +"%'";
        query2 += " AND question LIKE '%"+ search_value +"%'";
    }

    query1 += " ORDER BY id DESC LIMIT :offset, :limit";

    promises.push(
        dbConnection.query(query1, { replacements: data1, type: dbConnection.QueryTypes.SELECT })
        .then(result => {
            if (result.length > 0) {
                questionData.data = result;
            } else {
                questionData.data = [];
            }
        }),
        dbConnection.query(query2, { replacements: data2, type: dbConnection.QueryTypes.SELECT })
        .then(result => {
            questionData.count = result[0].count;
        }),
    );

    Promise.all(promises)
    .then(result => {
        if (questionData.data.length > 0) {
            response.status = constants.SuccessStatusCode;
            response.message = "Security question list.";
        } else {
            response.status = constants.RecordNotFoundStatusCode;
            response.message = constants.RecordNotFound;
        }
        res.statusCode = constants.SuccessStatusCode;
        response.result = questionData;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into security_question_list.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = QuestionsList;