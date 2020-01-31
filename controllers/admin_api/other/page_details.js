var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

GetPageDetails = (req, res) => {
    var response = {};
    var page_id = req.query.id ? req.query.id : "";

    if (page_id == "") {
        res.statusCode = constants.VALIDATION_STATUS_CODE;
        response.status = constants.VALIDATION_STATUS_CODE;
        response.message = constants.ID_VALIDATION;
        res.send(response);
    }

    var query = "SELECT * FROM pages WHERE id = :id";
    dbConnection.query(query, { replacements: { id: page_id }, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        if (result.length > 0) {
            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.SuccessStatusCode;
            response.message = "Page details.";
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
        console.error("Error in page_details.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = GetPageDetails;