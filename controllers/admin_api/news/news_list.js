// News list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

NewsList = (req, res) => {
  var response = {};
  var newsData = {};
  var promises = [];
  var limit = req.query.limit ? parseInt(req.query.limit) : 10;
  var offset = req.query.offset ? parseInt(req.query.offset) : 0;
  var status = req.query.status ? req.query.status : "";
  var category = req.query.category ? req.query.category : "";
  var search_value = req.query.value ? req.query.value : "";
  var start_date = req.query.start_date ? req.query.start_date : "";
  var end_date = req.query.end_date ? req.query.end_date : "";

  var data1 = { limit: limit, offset: offset, status: status, category: category, search_value: search_value, start_date: start_date + " 00:00:00", end_date: end_date + " 23:59:59" };
  var data2 = { status: status, category: category, search_value: search_value, start_date: start_date + " 00:00:00", end_date: end_date + " 23:59:59" };

  // var query1 = "SELECT * FROM news WHERE deleted_at IS NULL";
  var query1 = "SELECT tbl_1.*, tbl_2.category_name FROM news AS tbl_1 LEFT JOIN categories AS tbl_2 ON tbl_1.category = tbl_2.id WHERE tbl_1.deleted_at IS NULL";
  var query2 = "SELECT tbl_1.*, tbl_2.category_name FROM news AS tbl_1 LEFT JOIN categories AS tbl_2 ON tbl_1.category = tbl_2.id WHERE tbl_1.deleted_at IS NULL";

  if (status != "") {
    query1 += " AND tbl_1.status = :status";
    query2 += " AND tbl_1.status = :status";
  }

  if (category != "") {
    query1 += " AND tbl_1.category = :category";
    query2 += " AND tbl_1.category = :category";
  }

  if (start_date != "") {
    query1 += " AND tbl_1.date >= :start_date";
    query2 += " AND tbl_1.date >= :start_date";
  }

  if (end_date != "") {
    query1 += " AND tbl_1.date <= :end_date";
    query2 += " AND tbl_1.date <= :end_date";
  }

  /*if (search_value != "") {
    query1 += " AND (title LIKE '%"+search_value+"%' OR description LIKE '%"+search_value+"%')";
    query2 += " AND (title LIKE '%"+search_value+"%' OR description LIKE '%"+search_value+"%')";
  }*/

  query1 += " ORDER BY id DESC LIMIT :offset, :limit";

  promises.push(
    dbConnection.query(query1, { replacements: data1, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      if (result.length > 0) {
        var data = [];
        result.forEach(function (element) {
          data.push({ id: element.id, news_link: element.news_link, title: element.title, description: element.description, logo_image: element.logo_image, status: element.status, category: element.category_name, date: moment(element.date).format("DD-MM-YYYY"), publish_date: moment(element.date).format("DD-MM-YYYY"), created_at: moment(element.created_at).format("DD-MM-YYYY") });
        });
        newsData.data = data;
      } else {
        newsData.data = [];
      }
    }),

    dbConnection.query(query2, { replacements: data2, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      newsData.count = result.length;
    }),
  );

  Promise.all(promises)
  .then(result => {
    if (newsData.data.length > 0) {
      response.status = constants.SuccessStatusCode;
      response.message = "New list data.";
    } else {
      response.status = constants.RecordNotFoundStatusCode;
      response.message = constants.RecordNotFound;
    }
    res.statusCode = constants.SuccessStatusCode;
    response.result = newsData;
    res.send(response);
  })
  .catch(err => {
    console.log("Error into new_list.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = NewsList;