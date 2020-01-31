var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var _ = require("lodash");
const logger = require("../../config/winstonConfig");

super_customer_userlist = (req, res) => {
  var response = {};
  var status = req.body.status ? req.body.status : "";
  var search = req.body.value ? req.body.value : "";
  var offset = req.body.offset ? parseInt(req.body.offset) : 0;
  var limit = req.body.limit ? parseInt(req.body.limit) : 10;
  var lang = req.body.lang ? req.body.lang : "EN";
  let user_promises = [];

  // create replacement for get listing query
  const select_replacement = {
    search: "%" + search + "%",
    status: status,
    limit: limit,
    offset: offset,
  };

  const count_replacement = {
    search: "%" + search + "%",
    status: status,
  };

  let select_query = "SELECT users.id,users.user_name,users.image as image,users.password,users.status,users.price_per_hour,GROUP_CONCAT(users_meta.meta_value SEPARATOR ' ') AS name FROM `users` JOIN users_meta ON users.id = users_meta.user_id WHERE type='super_customer' ";
  
  let count_query = "SELECT COUNT(users.id) as total_count,users.id,users.user_name,users.password,users.status,users.price_per_hour,GROUP_CONCAT(users_meta.meta_value) AS name FROM `users` JOIN users_meta ON users.id = users_meta.user_id WHERE type='super_customer'";
  if (search != '') {

    //select_query += " HAVING name LIKE :search ";
    count_query += " AND users.user_name LIKE :search  ";
  }

  if (status != '') {
    select_query += " AND users.status = :status ";
    count_query += " AND users.status =  :status ";
  }

  select_query += "&& users_meta.meta_key LIKE '%" + lang + "%' AND deleted_at IS NULL GROUP BY users.id ";
  count_query += "AND users_meta.meta_key LIKE 'EN_%' AND deleted_at IS NULL GROUP BY users.id";
  if (search != '') {
    select_query += " HAVING name LIKE :search ";
  }
  select_query += "ORDER BY users.id DESC LIMIT :offset, :limit ";
  user_promises.push(
    dbConnection.query(select_query, {
      replacements: select_replacement,
      type: dbConnection.QueryTypes.SELECT
    }).then(results => {
      response.result = results;
      // response.count=results.length;
    }),
    dbConnection.query(count_query, {
      replacements: count_replacement,
      type: dbConnection.QueryTypes.SELECT
    }).then(results => {
      console.log(results);
      response.count = results.length;
      // response.count = results[0].total_count;
    }),
  );

  Promise.all(user_promises).then(final_result => {
    if (response.result.length > 0) {
      // send response and with status code 200
      res.status = constants.SuccessStatusCode;
      response.status=constants.SuccessStatusCode;
      // delete response.message;
      return res.json(response);
    } else {
      // send response and with status code 200
      res.status =  constants.SuccessStatusCode;
      response.status=constants.NotFoundStatusCode;
      response.message = constants.RECORD_NOT_FOUND;
      delete response.result;
      return res.json(response);
    }
  }).catch(function (err) {
    logger.log("error", "On users.listing.promise.all() failed.", err);
    // send response and with status code 404
    res.status =  constants.ErrorStatusCode;
    res.status= constants.ErrorStatusCode;
    return res.json(response);
  });
}
module.exports = super_customer_userlist;
