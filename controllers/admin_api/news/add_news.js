var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var Busboy = require('busboy');
var fs = require('fs');

AddNews = (req, res) => {
  var response = {};
  // var title = req.body.title ? req.body.title : "";
  // var description = req.body.description ? req.body.description : "";
  var news_link = req.body.news_link ? req.body.news_link : "";
  var category = req.body.category ? req.body.category : "";
  var publish_date = req.body.publish_date ? req.body.publish_date : "";
  var logo_image = req.body.logo_image ? req.body.logo_image : "";
  var magazine_image = req.body.magazine_image ? req.body.magazine_image : "";

  /*if (title == "") {
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
  }*/

  /*if (news_link == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.NEWS_LINK_VALIDATION;
    res.send(response);
  }*/

  if (publish_date == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.PUBLISH_DATE_VALIDATION;
    res.send(response);
  }

  if (category == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.CATEGORY_VALIDATION;
    res.send(response);
  }
  
  var data = { logo_image: logo_image, magazine_image: magazine_image, news_link: news_link, date: publish_date, category: category };
  var query = "INSERT INTO news(logo_image, magazine_image, news_link, date, category) VALUES (:logo_image, :magazine_image, :news_link, :date, :category)";
  dbConnection.query(query, {replacements: data, type: dbConnection.QueryTypes.INSERT})
  .then(result => {
    res.statusCode = constants.SuccessStatusCode;
    response.status = constants.SuccessStatusCode;
    response.message = constants.NEWS_ADD_SUCCESS;
    res.send(response);
  })
  .catch(err => {
    console.log("Error into add_news.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = AddNews;