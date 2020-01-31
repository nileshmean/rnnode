var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var moment = require('moment');

DeleteTestimonial = (req, res) => {
	var response = {};
	var id = req.body.id ? req.body.id : "";
	var type = req.body.type ? req.body.type : "";

	if (id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (type == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.TYPE_VALIDATION;
		res.send(response);
	}

    var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
  

    var query = "UPDATE testimonial SET deleted_at='" +datetime+ "' WHERE id="+id;

    dbConnection.query(query, { type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = "Delete successfully";
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });

}

module.exports = DeleteTestimonial;