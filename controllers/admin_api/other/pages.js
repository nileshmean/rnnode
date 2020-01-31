var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

Page = (req, res) => {
    var response = {};
    var query = "SELECT * FROM pages WHERE deleted_at IS NULL";
    dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        if (result.length > 0) {
            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.SuccessStatusCode;
            response.message = "All pages list.";
            response.result = result;
            res.send(response);
        } else {
            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.RecordNotFoundStatusCode;
            response.message = constants.RecordNotFound;
            res.send(response);
        }
    })
    .catch(err => {
        console.error("Error in pages.js ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = Page;