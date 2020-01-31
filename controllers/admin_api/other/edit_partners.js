// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

EditPartners = (req, res) => {
    var response = {};
    var id = req.body.id ? req.body.id:"";
    var name = req.body.name ? req.body.name : "";
    var description = req.body.description ? req.body.description : "";
    var link = req.body.link ? req.body.link : "";
    var image = req.body.image ? req.body.image : "";
    var data = {id:id,name:name, description:description, link:link,image:image}
    
    var query = "UPDATE partners SET name=:name,description=:description,link=:link,logo=:image Where id=:id";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = "partners updated successfully.";
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditPartners;