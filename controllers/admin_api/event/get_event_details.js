// Get event details.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

EventDetails = (req, res) => {
	var response = {};
	var event_id = req.query.id ? req.query.id : "";

	if (event_id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	var data = { id: event_id };
	var query = "SELECT * FROM event WHERE deleted_at IS NULL AND id = :id";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.SELECT })
	.then(results => {
		if (results.length > 0) {
			var eventData = {};
			results.forEach(element => {
				eventData.id = element.id,
				eventData.title = element.title,
				eventData.description = element.description,
				eventData.image = element.image,
				eventData.location = element.location,
				eventData.latitude = element.latitude,
				eventData.longitude = element.longitude,
				eventData.from_event_type = element.from_event_type,
				eventData.schedule_type = element.schedule_type,
				eventData.starts_date = moment(element.starts_date).format("DD-MM-YYYY hh:mm A"),
				eventData.ends_date = moment(element.ends_date).format("DD-MM-YYYY hh:mm A"),
				eventData.s_date = element.starts_date,
				eventData.e_date = element.ends_date,
				eventData.booking_link = element.booking_link,
				eventData.status = element.status,
				eventData.created_at = element.created_at
			});
			response.status = constants.SuccessStatusCode;
			response.message = "Event Details.";
			response.result = eventData;
			// response.result = results[0];
		} else {
			response.status = constants.RecordNotFoundStatusCode;
			response.message = constants.RecordNotFound;
		}

		res.statusCode = constants.SuccessStatusCode;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into get_event_details.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = EventDetails;