// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

ContentDetail = (req, res) => {
    var response = {};
   
    var id = req.query.id;
    var query = "SELECT * FROM content WHERE id="+id;
    dbConnection.query(query, {type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.result = result[0];
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = ContentDetail;
