var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

AddEvent = (req, res) => {
  var response = {};
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

  if (event_location == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.LOCATION_VALIDATION;
    res.send(response);
  }

  if (start_date == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.START_DATE_VALIDATION;
    res.send(response);
  }

  if (end_date == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.END_DATE_VALIDATION;
    res.send(response);
  }

  if (schedule_type == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.SCHEDULE_TYPE_VALIDATION;
    res.send(response);
  }

  if (booking_link == "") {
    res.statusCode = constants.ValidationStatusCode;
    response.status = constants.ValidationStatusCode;
    response.message = constants.BOOKING_LINK_VALIDATION;
    res.send(response);
  }

  var data = { title: title, description: description, image: event_image, location: event_location, latitude: latitude, longitude: longitude, from_event_type: 'admin', schedule_type: schedule_type, starts_date: start_date, ends_date: end_date, booking_link: booking_link };

  var query = "INSERT INTO event(title, description, image, location, latitude, longitude, from_event_type, schedule_type, starts_date, ends_date, booking_link) VALUES (:title, :description, :image, :location, :latitude, :longitude, :from_event_type, :schedule_type, :starts_date, :ends_date, :booking_link)";
  dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
  .then(result => {
	res.statusCode = constants.SuccessStatusCode;
	response.status = constants.SuccessStatusCode;
	response.message = constants.EVENT_ADD_SUCCESS;
	res.send(response);
  })
  .catch(err => {
    console.error("Error into add_event.js: ", err);
    res.statusCode = constants.ErrorStatusCode;
    response.message = constants.SomethingWentWrong;
    res.send(response);
  });
}
module.exports = AddEvent;