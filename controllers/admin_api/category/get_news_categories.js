// News list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

GetCategories = (req, res) => {
  var response = {};
  var query = "SELECT id, category_name FROM categories WHERE deleted_at IS NULL AND type = 'news'";
  dbConnection.query(query, { type: dbConnection.QueryTypes.SELECT })
  .then(result => {
  	if (result.length > 0) {
	  	res.statusCode = constants.SuccessStatusCode;
	    response.status = constants.SuccessStatusCode;
	    response.message = "News categories.";
	    response.result = result
	    res.send(response);
  	} else {
  		res.statusCode = constants.RecordNotFoundStatusCode;
	    response.status = constants.RecordNotFoundStatusCode;
	    response.message = constants.RecordNotFound;
	    res.send(response);
  	}
  })
  .catch(err => {
  	console.error("Error into get_news_categories.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = GetCategories;