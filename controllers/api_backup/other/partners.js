// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

Partners = (req, res) => {
    var response = {};
   
    
    var query = "SELECT * FROM partners WHERE deleted_at is null";
    dbConnection.query(query, {type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.result = result;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = Partners;