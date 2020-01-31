var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

TestimonialsList = (req, res) => {
    var response = {};

    var limit = req.body.limit ? parseInt(req.body.limit) : 10;
    var offset = req.body.offset ? parseInt(req.body.offset) : 0;
    var status = req.body.status ? req.body.status : "";
    //for search variable
    var search = req.body.search ? req.body.search : "";

    console.log(search);

    var sql = "SELECT * FROM `testimonials` WHERE deleted_at IS NULL"

    var countSQL = "SELECT * FROM `testimonials` WHERE deleted_at IS NULL"

    //   sql = sql+" group by news.id";

    //   countSQL = countSQL+" group by news.id";

    if (status !== "") {
        sql = sql + "&& status ='" + status + "' "
        countSQL = countSQL + "&& status= '" + status + "'"
    }

    if (search !== "") {
        sql = sql + "&& name LIKE '%" + search + "%' "
        countSQL = countSQL + "&& name LIKE '%" + search + "%'"
    }

    sql = sql + " ORDER BY id DESC LIMIT " + offset + ", " + limit;
    dbConnection.query(sql, { type: dbConnection.QueryTypes.SELECT }).then(function (result) {
        dbConnection.query(countSQL, { type: dbConnection.QueryTypes.SELECT }).then(function (countResult) {
            response.result = result;
            response.count = countResult.length;
            response.status = constants.SuccessStatusCode;
            return res.status(response.status).json(response);
        })
    }).catch(function (err) {
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response);
    })
}
module.exports = TestimonialsList;