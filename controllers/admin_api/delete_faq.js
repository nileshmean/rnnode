var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment');
deleteFaq = (req, res) => {
    var response = {};
    var id = req.query.id ? req.query.id : "";
    var update = new Date();
    update = moment(update).format("YYYY-MM-DD HH:mm:ss");
    console.log(update);

    if (id == '') {
        response.message = constants.ID_VALIDATION;
        return res.status(constants.ValidationStatusCode).json(response);
    }

    var data = {
        id: id,
        deleted_at:update,
      }

   console.log(data);
    sql = "UPDATE `FAQ` SET `deleted_at`=:deleted_at WHERE `id`=:id";
    dbConnection.query(sql, { replacements:data,type: dbConnection.QueryTypes.UPDATE }).then(function (Faq) {
        console.log(Faq);
        if (Faq.length > 0) {
            var response = {
                status: constants.SuccessStatusCode,
                message: 'Delete Successfully.',
            };
            return res.status(constants.SuccessStatusCode).json(response);
        } else {
        var response = {};
        response.status = constants.ValidationStatusCode;
        response.message = constants.INVALID_USER;
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
module.exports = deleteFaq;
