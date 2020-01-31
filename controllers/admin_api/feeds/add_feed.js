var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

AddFeed = (req, res) => {
  var response = {};
  var title = req.body.title ? req.body.title : "";
  var description = req.body.description ? req.body.description : "";
  var feed_image = req.body.feed_image ? req.body.feed_image : "";
  var user_id = req.body.user_id ? req.body.user_id : "";
  var slug  = req.body.title ? req.body.title.replace(/\s+/g, '-') : '';

  if (title == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.TitleValidation;
    res.send(response);
  }

  if (description == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.DESCRIPTION_VALIDATION;
    res.send(response);
  }

  if (user_id == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.ID_VALIDATION;
    res.send(response);
  }

  var data = { title: title, description: description, image: feed_image, user_id: user_id,slug: slug };
  existsSql = "SELECT * FROM `feeds` WHERE title='"+title+"'";

  dbConnection.query(existsSql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
    if(result.length > 0){
      response.status = constants.ValidationStatusCode;
      response.message = "This title is already exists, Change title and post again.";
      return res.status(response.status).json(response)
  }else{

    var query = "INSERT INTO feeds(title, description, image, user_id) VALUES (:title, :description, :image, :user_id)";
    dbConnection.query(query, {replacements: data, type: dbConnection.QueryTypes.INSERT})
    .then(result => {
      res.statusCode = constants.SuccessStatusCode;
      response.status = constants.SuccessStatusCode;
      response.message = constants.FEED_ADD_SUCCESS;
      res.send(response);
    })
    .catch(err => {
      console.error("Error into add_feed.js: ", err);
      res.statusCode = constants.ErrorStatusCode;
      response.message = constants.SomethingWentWrong;
      res.send(response);
    });
  }
  })
}
module.exports = AddFeed;