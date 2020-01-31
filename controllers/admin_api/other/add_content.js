// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

AddContent = (req, res) => {

    var response = {};
    var title = req.body.title ? req.body.title : "";
    var link =req.body.link ? req.body.link :"";
    var description = req.body.description ? req.body.description : "";
    var type = req.body.type ? req.body.type : "";
    var image = req.body.image ? req.body.image : "";
    var data = {title:title, description:description, type:type,image:image,link:link};

    var query = "INSERT INTO content SET title=:title,description=:description,image=:image,type=:type,link=:link";

    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.CONTENT_ADD_SUCCESS;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
    
}

module.exports = AddContent;