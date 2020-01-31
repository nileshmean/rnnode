// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

AddTestimonial = (req, res) => {
    var response = {};
    var name = req.body.name ? req.body.name : "";
    var message = req.body.message ? req.body.message : "";
    var location = req.body.location ? req.body.location : "";
    var image = req.body.image ? req.body.image : "";
    var data = {name:name, description:message, location:location,image:image}
    
    var query = "INSERT INTO testimonial SET name=:name,description=:description,location=:location,image=:image";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.TESTIMONIAL_ADD_SUCCESS;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = AddTestimonial;