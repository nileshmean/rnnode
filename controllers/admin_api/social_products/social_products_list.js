// Social products list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

SocialProductsList = (req, res) => {
  var response = {};
  var socialProductsData = {};
  var promises = [];
  var limit = req.query.limit ? parseInt(req.query.limit) : 10;
  var offset = req.query.offset ? parseInt(req.query.offset) : 0;
  var status = req.query.status ? req.query.status : "";

  var data1 = { limit: limit, offset: offset, status: status };
  var data2 = { status: status };

  var query1 = "SELECT * FROM social_products WHERE deleted_at IS NULL";
  var query2 = "SELECT COUNT(*) AS total_products FROM social_products WHERE deleted_at IS NULL";

  if (status != "") {
    query1 += " AND status = :status";
    query2 += " AND status = :status";
  }

  query1 += " ORDER BY id DESC LIMIT :offset, :limit";

  promises.push(
    dbConnection.query(query1, { replacements: data1, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      if (result.length > 0) {
        socialProductsData.data = result;
      } else {
        socialProductsData.data = [];
      }
    }),

    dbConnection.query(query2, { replacements: data2, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      socialProductsData.count = result[0].total_products;
    }),
  );

  Promise.all(promises)
  .then(result => {
    if (socialProductsData.data.length > 0) {
      response.status = constants.SuccessStatusCode;
      response.message = "Social products data.";
    } else {
      response.status = constants.RecordNotFoundStatusCode;
      response.message = constants.RecordNotFound;
    }
    res.statusCode = constants.SuccessStatusCode;
    response.result = socialProductsData;
    res.send(response);
  })
  .catch(err => {
    console.error("Error into social_products_list.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = SocialProductsList;