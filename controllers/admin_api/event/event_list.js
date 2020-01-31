// Events list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

EventList = (req, res) => {
  var response = {};
  var feedsData = {};
  var promises = [];
  var limit = req.query.limit ? parseInt(req.query.limit) : 10;
  var offset = req.query.offset ? parseInt(req.query.offset) : 0;
  var status = req.query.status ? req.query.status : "";
  var start_date = req.query.start_date ? req.query.start_date : "";
  var end_date = req.query.end_date ? req.query.end_date : "";
  var search_value = req.query.value ? req.query.value : "";

  var data1 = { limit: limit, offset: offset, status: status, search_value: search_value, start_date: start_date + " 00:00:00", end_date: end_date + " 23:59:59" };
  var data2 = { status: status, search_value: search_value, start_date: start_date + " 00:00:00", end_date: end_date + " 23:59:59" };

  var query1 = "SELECT * FROM event WHERE deleted_at IS NULL";
  var query2 = "SELECT COUNT(*) AS count FROM event WHERE deleted_at IS NULL";

  if (status != "") {
    query1 += " AND status = :status";
    query2 += " AND status = :status";
  }

  if (start_date != "") {
    query1 += " AND starts_date >= :start_date";
    query2 += " AND starts_date >= :start_date";
  }

  if (end_date != "") {
    query1 += " AND ends_date <= :end_date";
    query2 += " AND ends_date <= :end_date";
  }

  if (search_value != "") {
    query1 += " AND (title LIKE '%"+search_value+"%' OR description LIKE '%"+search_value+"%')";
    query2 += " AND (title LIKE '%"+search_value+"%' OR description LIKE '%"+search_value+"%')";
  }

  query1 += " ORDER BY id DESC LIMIT :offset, :limit";

  promises.push(
    dbConnection.query(query1, { replacements: data1, type: dbConnection.QueryTypes.SELECT })
    .then(result => {
      if (result.length > 0) {
        var data = [];
        result.forEach(function (element) {
          data.push({ id: element.id, title: element.title, description: element.description, image: element.image, status: element.status, location: element.location, starts_date: moment(element.starts_date).format("DD-MM-YYYY hh:mm A"), ends_date: moment(element.ends_date).format("DD-MM-YYYY hh:mm A"), created_at: moment(element.created_at).format("DD-MM-YYYY") });
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
      response.message = "Events list.";
    } else {
      response.status = constants.RecordNotFoundStatusCode;
      response.message = constants.RecordNotFound;
    }
    res.statusCode = constants.SuccessStatusCode;
    response.result = feedsData;
    res.send(response);
  })
  .catch(err => {
    console.error("Error into event_list.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = EventList;