/**
 * token middleware file
 */
var constants = require("./../config/constants"),
    dbConnection = require("./../config/connection"),
    jwt = require("jsonwebtoken");

tokenMiddleware = function(req, res, next) {
    var token = req.headers.token ? req.headers.token : "";
    var response = {
        message: constants.TOKEN_VALIDATION
    };
    if (token === "") {
        response.status = 400;
        response.message = constants.TOKEN_VALIDATION;
        return res.json(response);
    } else {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) { console.log('error=====',err)
                response.status = 400;
                response.message = err.message;
                res.send(response);
            } else {
                res.locals.userData = decoded;
                next();
            }
        });
    }
};
module.exports = tokenMiddleware;
