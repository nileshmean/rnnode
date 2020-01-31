// Get app details.
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

AboutApp = (req, res) => {
    var response = {};
    var query = "SELECT * FROM about_apps WHERE id = '1' AND deleted_at IS NULL";
    dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        if (result.length > 0) {
            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.SuccessStatusCode;
            response.message = "App details.";
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
        console.error("Error in get_app_details.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = AboutApp;