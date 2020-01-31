var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment');
Userdrop = (req, res) => {
    var response = {};
    sql = "SELECT users_meta.meta_key, users_meta.meta_value, users.id ,GROUP_CONCAT(users_meta.meta_value SEPARATOR ' ') AS Name FROM users_meta JOIN users ON users.id = users_meta.user_id WHERE users.type = 'customer' AND users_meta.meta_key LIKE 'EN%'  AND deleted_at IS NULL GROUP BY users.id";
    dbConnection.query(sql, {type: dbConnection.QueryTypes.SELECT }).then(function (user) {
        console.log(user);
        if (user.length > 0) {
        
            var response = {
                status: constants.SuccessStatusCode,
                result:user,
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
module.exports = Userdrop;
