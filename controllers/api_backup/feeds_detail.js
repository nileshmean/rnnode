var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

FeedsDetail = (req, res) => {
    var response = {};
    var id = req.query.id ? req.query.id : "";
    var slug = req.query.slug ? req.query.slug : "";
    if ((id == ''  || id == undefined ) && slug == "" ) {
        response.status = constants.ValidationStatusCode;
        response.message = constants.ID_VALIDATION;
        return res.status(response.status).json(response);
    }

    sql = "SELECT feeds.id, title,category, description, slug , user_id,feeds.updated_at, feeds.image as feed_image, users.first_name, users.last_name, email, users.image as user_image, users.type as user_type FROM `feeds` JOIN `users` ON users.id = feeds.user_id  WHERE feeds.status = 'active' && feeds.deleted_at IS NULL && feeds.id = " + id;
    if(slug !== "" ){
        sql = "SELECT feeds.id, title,category, description, slug , user_id,feeds.updated_at, feeds.image as feed_image, users.first_name, users.last_name, email, users.image as user_image, users.type as user_type FROM `feeds` JOIN `users` ON users.id = feeds.user_id  WHERE feeds.status = 'active' && feeds.deleted_at IS NULL && feeds.slug = '" + slug +"'";

    }
    dbConnection.query(sql, { type: dbConnection.QueryTypes.SELECT }).then(function (result) {
        console.log(result)
        if (result.length > 0) {
            comment_sql = "SELECT feeds_comment.id, feed_id, comment, reply_comment, user_id, first_name,last_name, users.image as user_image, feeds_comment.created_at as date, feeds_comment.updated_at as reply_date, users.type FROM `feeds_comment` JOIN `users` ON users.id = feeds_comment.user_id WHERE feed_id = " + result[0].id + " ORDER BY feeds_comment.id DESC";
            dbConnection.query(comment_sql, { type: dbConnection.QueryTypes.SELECT })
            .then(comment => {
               // console.log(comment)
                result[0].comment_detail = comment;
                response.result = result[0];
                response.status = constants.SuccessStatusCode;
              //  console.log(response)
                return res.status(response.status).json(response)
            })

        } else {
            response.message = constants.RecordNotFound;
            response.status = constants.NotFoundStatusCode;
            return res.status(response.status).json(response)
        }

    }).catch(function (err) {
        console.log(err)
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response)
    })
}

module.exports = FeedsDetail;