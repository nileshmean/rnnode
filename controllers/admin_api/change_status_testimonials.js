var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment');

ChangeStatusTestimonials = (req, res) => {
    var response = {};
    var id = req.query.id ? req.query.id : "";
    var status=req.query.status ? req.query.status :"";
    var update = new Date();
    update = moment(update).format("YYYY-MM-DD HH:mm:ss");
    console.log(update);
    if (id == '') {
        response.message = constants.ID_VALIDATION;
        return res.status(constants.ValidationStatusCode).json(response);
    }
    var data = {
        id: id,
        status:status,
        updated_at:update,
      }
   console.log(data);
    sql = "UPDATE `testimonials` SET `status`=:status,`updated_at`=:updated_at WHERE `id`=:id";
    dbConnection.query(sql, { replacements:data,type: dbConnection.QueryTypes.UPDATE }).then(function (test) {
        console.log(test);
        if (test.length > 0) {
            var response = {
                status: constants.SuccessStatusCode,
                result:status,
                message: "Status "+status.charAt(0).toUpperCase() + status.slice(1)+" Successfully.",
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

module.exports = ChangeStatusTestimonials;
