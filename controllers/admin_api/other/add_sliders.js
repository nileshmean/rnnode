// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

AddSlider = (req, res) => {

    var response = {};
    var title = req.body.name ? req.body.name : "";
    var description = req.body.description ? req.body.description : "";
    var background=req.body.background ? req.body.background:"";
    var link = req.body.link ? req.body.link : "";
    var image = req.body.image ? req.body.image : "";
    var data = {title:title, description:description, link:link,image:image,background:background};
    
    console.log(description);
    console.log(link);
    var query = "INSERT INTO slider SET title=:title,description=:description,background=:background,image=:image,link=:link";

    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.INSERT })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.SLIDER_ADD_SUCCESS;
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
    
}

module.exports = AddSlider;