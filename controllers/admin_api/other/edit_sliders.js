// Add testimonial content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

EditSliders = (req, res) => {
    var response = {};
    var id = req.body.id ? req.body.id:"";
    var title = req.body.name ? req.body.name : "";
    var description = req.body.description ? req.body.description : "";
    var link = req.body.link ? req.body.link : "";
    var image = req.body.image ? req.body.image : "";
    var background =req.body.background ? req.body.background:'';
    var data = {id:id,title:title, description:description,background:background,link:link,image:image}
    
    var query = "UPDATE slider SET title=:title,background=:background,description=:description,link=:link,image=:image Where id=:id";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = "sliders updated successfully.";
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditSliders;