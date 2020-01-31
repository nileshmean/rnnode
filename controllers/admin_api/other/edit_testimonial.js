// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

EditTestimonial = (req, res) => {
    var response = {};
    var id = req.body.id ? req.body.id:"";
    var name = req.body.name ? req.body.name : "";
    var message = req.body.message ? req.body.message : "";
    var location = req.body.location ? req.body.location : "";
    var image = req.body.image ? req.body.image : "";
    var data = {id:id,name:name, description:message, location:location,image:image}
    
    var query = "UPDATE testimonial SET name=:name,description=:description,location=:location,image=:image Where id=:id";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = "testimonial updated successfully.";
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditTestimonial;