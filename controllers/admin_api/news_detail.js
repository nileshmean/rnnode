var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var _ = require("lodash");
const logger = require("../../config/winstonConfig");

Newsdetail = (req, res) => {
  var response = {};
  var id = req.body.id ? req.body.id : "";
  var favPromises = [];
  var resource_detail = [];
  const select_replacement = {
    id: id,
  };

  sql = "SELECT news.id,news.image as image,news.publish_date,news.created_at FROM `news` JOIN news_meta ON news.id = news_meta.news_id WHERE news.id=:id";
  dbConnection.query(sql, { replacements: select_replacement, type: dbConnection.QueryTypes.SELECT }).then(function (result) {
    //console.log(result)
    var responce = result;
    if (result.length > 0) {
      for (i = 0; i < result.length; i++) {
        (function (i) {
          var news_id = responce[i].id;
          console.log(news_id);
          userSql = "SELECT meta_key, meta_value FROM `news_meta` WHERE news_id ='" + news_id + "'";
          favPromises.push(dbConnection.query(userSql, { type: dbConnection.QueryTypes.SELECT }).then(function (user) {
            // var detail = { id: resource_id, working_hours: responce[i].working_hours, image: user[0].image };
            responce[0].user = user;
          }))

        })(i)
      }
      
    //   customerSql = "SELECT news_meta.meta_key, news_meta.meta_value,news.image as image,news.id,news.created_at as created_at, news.publish_date as publish_date,GROUP_CONCAT(news_meta.meta_value SEPARATOR ' ') AS title FROM news_meta JOIN news ON news.id = news_meta.news_id WHERE  news_meta.meta_key LIKE 'EN%' AND deleted_at IS NULL GROUP BY news.id";
    //   favPromises.push(dbConnection.query(customerSql, { type: dbConnection.QueryTypes.SELECT }).then(function (customer) {
    //     responce[0].customer = customer;
    //   }))

    //   leaderSql = "SELECT users_meta.meta_key, users_meta.meta_value, users.id ,users.user_name as username,users.created_at as created_at, users.image as image,users.status as status,GROUP_CONCAT(users_meta.meta_value SEPARATOR ' ') AS Name FROM users_meta JOIN users ON users.id = users_meta.user_id WHERE users.id='" + result[0].leader_id + "' AND users.type = 'leader' AND users_meta.meta_key LIKE 'EN%' AND deleted_at IS NULL GROUP BY users.id";
    //   favPromises.push(dbConnection.query(leaderSql, { type: dbConnection.QueryTypes.SELECT }).then(function (leader) {
    //     responce[0].leader = leader;
    //   }))

      Promise.all(favPromises).then(function (result) {
        delete responce[0].resource_id;
        delete responce[0].working_hours;
        response.result = responce[0];
        response.status = constants.SuccessStatusCode;
        return res.status(response.status).json(response);
      });
    } else {
      response.message = constants.RecordNotFound;
      response.status = constants.NotFoundStatusCode;
      return res.json(response);
    }
  }).catch(function (err) {
    throw err;
    response.status = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    return res.status(response.status).json(response);
  })
}
module.exports = Newsdetail;
