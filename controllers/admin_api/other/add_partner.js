// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

AddPartners = (req, res) => {

    var response = {};
    var name = req.body.name ? req.body.name : "";
    var description = req.body.description ? req.body.description : "";
    var link = req.body.link ? req.body.link : "";
    var image = req.body.image ? req.body.image : "";
    var data = {name:name, description:description, link:link,image:image};
    
    console.log(description);
    console.log(link);
    var query = "INSERT INTO partners SET name=:name,description=:description,logo=:image,link=:link";

    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.PARTNER_ADD_SUCCESS;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
    
}

module.exports = AddPartners;