// Save edit content.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

EditPageContent = (req, res) => {
  var response = {};
  var page_id = req.body.id ? req.body.id : "";
  var title = req.body.title ? req.body.title : "";
  var content = req.body.content ? req.body.content : "";

  if (page_id == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.ID_VALIDATION;
    res.send(response);
  }

  if (title == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.TITLE_VALIDATION;
    res.send(response);
  }

  if (content == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.CONTENT_VALIDATION;
    res.send(response);
  }
  
  var data = { id: page_id, title: title, content: content };
  var query = "UPDATE pages SET title= :title, content= :content WHERE id = :id";
  dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
  .then(result => {
    res.statusCode = constants.SuccessStatusCode;
    response.status = constants.SuccessStatusCode;
    response.message = constants.PAGECONTENT;
    response.result = result[0];
    res.send(response);
  })
  .catch(err => {
    console.error("Error in edit_page_detail.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = EditPageContent;