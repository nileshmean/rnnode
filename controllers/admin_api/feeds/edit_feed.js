// Edit feed data.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');
var fs = require('fs');

EditFeed = (req, res) => {
    var response = {};
    var title = req.body.title ? req.body.title : "";
    var description = req.body.description ? req.body.description : "";
    var feed_image = req.body.feed_image ? req.body.feed_image : "";
    var user_id = req.body.user_id ? req.body.user_id : "";
    var feed_id = req.body.feed_id ? req.body.feed_id : "";
    // var oldFile = req.body.oldImage ? req.body.oldImage : "";

    if (title == "") {
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
    }

    if (user_id == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.ID_VALIDATION;
        res.send(response);
    }

    if (feed_id == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.ID_VALIDATION;
        res.send(response);
    }

    var data = { id: feed_id, title: title, description: description, image: feed_image, user_id: user_id };
    var query = "UPDATE feeds SET title = :title, description = :description, image = :image, user_id = :user_id WHERE id = :id";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.FEED_UPDATE;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into edit_feed.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditFeed;