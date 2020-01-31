// Feeds list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

FeedsList = (req, res) => {
  var response = {};
  var feedsData = {};
  var promises = [];
  var limit = req.query.limit ? parseInt(req.query.limit) : 10;
  var offset = req.query.offset ? parseInt(req.query.offset) : 0;
  var status = req.query.status ? req.query.status : "";
  var search_value = req.query.value ? req.query.value : "";

  var data1 = { limit: limit, offset: offset, status: status, search_value: search_value };
  var data2 = { status: status, search_value: search_value };

  var query1 = "SELECT tbl_1.*, tbl_2.first_name, tbl_2.last_name, CONCAT(tbl_2.first_name,' ', tbl_2.last_name) AS user_name, tbl_2.type AS user_type FROM feeds AS tbl_1 LEFT JOIN users AS tbl_2 ON tbl_1.user_id = tbl_2.id WHERE tbl_1.deleted_at IS NULL";
  var query2 = "SELECT tbl_1.*, tbl_2.first_name, tbl_2.last_name, CONCAT(tbl_2.first_name,' ', tbl_2.last_name) AS user_name, tbl_2.type AS user_type FROM feeds AS tbl_1 LEFT JOIN users AS tbl_2 ON tbl_1.user_id = tbl_2.id WHERE tbl_1.deleted_at IS NULL";

  if (status != "") {
    query1 += " AND tbl_1.status = :status";
    query2 += " AND tbl_1.status = :status";
  }

  if (search_value != "") {
    query1 += " HAVING (tbl_1.title LIKE '%"+search_value+"%' OR tbl_1.description LIKE '%"+search_value+"%' OR user_name LIKE '%"+search_value+"%')";
    query2 += " HAVING (tbl_1.title LIKE '%"+search_value+"%' OR tbl_1.description LIKE '%"+search_value+"%' OR user_name LIKE '%"+search_value+"%')";
  }

  query1 += " ORDER BY tbl_1.id DESC LIMIT :offset, :limit";

  promises.push(
    dbConnection.query(query1, { replacements: data1, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      if (result.length > 0) {
        var data = [];
        result.forEach(function (element) {
          var feedImg = element.image.split(",");
          data.push({ id: element.id, title: element.title, description: element.description, image: feedImg[0], status: element.status, user_id: element.user_id, first_name: element.first_name, last_name: element.last_name, user_type: element.user_type, created_at: moment(element.created_at).format("DD-MM-YYYY") });
        });
        feedsData.data = data;
      } else {
        feedsData.data = [];
      }
    }),

    dbConnection.query(query2, { replacements: data2, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      feedsData.count = result.length;
    }),
  );

  Promise.all(promises)
  .then(result => {
    if (feedsData.data.length > 0) {
      response.status = constants.SuccessStatusCode;
      response.message = "Feeds list data.";
    } else {
      response.status = constants.RecordNotFoundStatusCode;
      response.message = constants.RecordNotFound;
    }
    res.statusCode = constants.SuccessStatusCode;
    response.result = feedsData;
    res.send(response);
  })
  .catch(err => {
    console.error("Error into feeds_list.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = FeedsList;