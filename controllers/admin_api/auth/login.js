var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

Login = (req, res) => {
  var email = req.body.email ? req.body.email : "";
  var password = req.body.password ? md5(req.body.password) : "";

  var res_for_token = {};
  var response = {};

  response.status = constants.ValidationStatusCode;
  
  if (email == "") {
    response.message = constants.EmailValidation;
    response.status = constants.ValidationStatusCode;
    return res.status(constants.ValidationStatusCode).json(response);
  }

  if (password == "") {
    response.message = constants.PASSWORD_VALIDATION;
    response.status = constants.ValidationStatusCode;
    return res.status(constants.ValidationStatusCode).json(response);
  }

  var data = { email: email, password: password };
  var query = "SELECT * FROM admin WHERE email = :email AND password = :password LIMIT 1";

  dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.SELECT })
  .then(result => {
    if (result.length > 0) {
      var result = result[0];
      res_for_token.id = result.id;
      res_for_token.first_name = result.first_name;
      res_for_token.last_name = result.last_name;
      res_for_token.email = result.email;
      res_for_token.image = result.image;
      res_for_token.permission = result.permission;
      var token = jwt.sign(res_for_token, constants.TOKEN_VALUE);
      result["token"] = token;

      response.message = constants.LOGIN_SUCCESSFULL;
      response.status = constants.SuccessStatusCode;
      response.result = result;
      return res.status(constants.SuccessStatusCode).json(response);
    } else {
      response.message = constants.INVALID_USER;
      response.status = constants.ValidationStatusCode;
      return res.status(constants.ValidationStatusCode).json(response);
    }
  })
  .catch(err => {
    console.log("Error into login.js ", err);
    response.message = constants.SomethingWentWrong;
    return res.status(constants.ErrorStatusCode).json(response);
  });
}
module.exports = Login;