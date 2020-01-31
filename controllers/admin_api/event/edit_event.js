// Edit event data.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');
var fs = require('fs');

EditEvent = (req, res) => {
    var response = {};
    var event_id = req.body.id ? req.body.id : "";
    var title = req.body.title ? req.body.title : "";
    var description = req.body.description ? req.body.description : "";
    var event_location = req.body.event_location ? req.body.event_location : "";
    var event_image = req.body.event_image ? req.body.event_image : "";
    var start_date = req.body.start_date ? req.body.start_date : "";
    var end_date = req.body.end_date ? req.body.end_date : "";
    var schedule_type = req.body.schedule_type ? req.body.schedule_type : "";
    var booking_link = req.body.booking_link ? req.body.booking_link : "";
    var latitude = req.body.latitude ? req.body.latitude : 0.0;
    var longitude = req.body.longitude ? req.body.longitude : 0.0;
    var previousImage = req.body.previousImage ? req.body.previousImage : "";

    if (event_id == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.ID_VALIDATION;
        res.send(response);
    }

    else if (title == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.TitleValidation;
        res.send(response);
    }

    else if (description == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.DESCRIPTION_VALIDATION;
        res.send(response);
    }

    else if (event_location == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.LOCATION_VALIDATION;
        res.send(response);
    }

    else if (start_date == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.START_DATE_VALIDATION;
        res.send(response);
    }

    else if (end_date == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.END_DATE_VALIDATION;
        res.send(response);
    }

    else if (schedule_type == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.SCHEDULE_TYPE_VALIDATION;
        res.send(response);
    }

    else if (booking_link == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.BOOKING_LINK_VALIDATION;
        res.send(response);
    }

    if (previousImage != "") {
        var image_path = constants.APP_PATH+'public/uploads/event/' + previousImage;
        fs.access(image_path, error => {
            if (!error) {
                // The check succeeded.
                fs.unlink(image_path, function (err) {
                    // if no error, file has been deleted successfully.
                    console.log("File deleted!");
                });
            } else {
                // The check failed.
                console.error("Error into edit_event.js: ", error);
                console.log("File not found.");
            }
        });
    }

    var data = { id: event_id, title: title, description: description, image: event_image, location: event_location, latitude: latitude, longitude: longitude, from_event_type: 'admin', schedule_type: schedule_type, starts_date: start_date, ends_date: end_date, booking_link: booking_link };

    var query = "UPDATE event SET title = :title, description = :description, image = :image, location = :location, latitude = :latitude, longitude = :longitude, from_event_type = :from_event_type, schedule_type = :schedule_type, starts_date = :starts_date, ends_date = :ends_date, booking_link = :booking_link WHERE id = :id";
    
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.EVENT_UPDATE;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into edit_event.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditEvent;