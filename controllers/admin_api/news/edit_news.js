// Edit news data.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');
var fs = require('fs');

EditNews = (req, res) => {
    var response = {};
    /*var title = req.body.title ? req.body.title : "";
    var description = req.body.description ? req.body.description : "";*/
    var news_id = req.body.id ? req.body.id : "";
    var news_link = req.body.news_link ? req.body.news_link : "";
    var category = req.body.category ? req.body.category : "";
    var publish_date = req.body.publish_date ? req.body.publish_date : "";
    var logo_image = req.body.logo_image ? req.body.logo_image : "";
    var magazine_image = req.body.magazine_image ? req.body.magazine_image : "";
    var old_logo_image = req.body.old_logo_image ? req.body.old_logo_image : "";
    var old_magazine_image = req.body.old_magazine_image ? req.body.old_magazine_image : "";

    /*if (news_link == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.NEWS_LINK_VALIDATION;
        res.send(response);
    }*/

    if (news_id == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.ID_VALIDATION;
        res.send(response);
    }

    /*if (title == "") {
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
    }*/

    if (publish_date == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.PUBLISH_DATE_VALIDATION;
        res.send(response);
    }

    if (category == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.CATEGORY_VALIDATION;
        res.send(response);
    }

    /*if (old_logo_image != "") {
        var removeFile = constants.APP_PATH+'public/uploads/news/' + old_logo_image;
        fs.unlink(removeFile, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    }*/

    /*if (old_magazine_image != "") {
        var removeFile = constants.APP_PATH+'public/uploads/news/' + old_magazine_image;
        fs.unlink(removeFile, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    }*/

    var data = { id: news_id, logo_image: logo_image, magazine_image: magazine_image, news_link: news_link, date: publish_date, category: category };
    var query = "UPDATE news SET logo_image = :logo_image, magazine_image = :magazine_image, news_link = :news_link, date = :date, category = :category WHERE id = :id";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.NEWS_UPDATE;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into edit_news.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditNews;