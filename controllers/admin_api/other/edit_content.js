// Edit content  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

EditContent = (req, res) => {

    var response = {};
    var id = req.body.id ? req.body.id:"";
    var title = req.body.title ? req.body.title : "";
    var link  = req.body.link ? req.body.link :"";
    var description = req.body.description ? req.body.description : "";
    var type = req.body.type ? req.body.type : "";
    var image = req.body.image ? req.body.image : "";
    var data = {id:id,title:title, description:description, type:type,image:image,link:link}
    
    var query = "UPDATE content SET title=:title,description=:description,type=:type,image=:image,link=:link Where id=:id";
    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = "content updated successfully.";
        res.send(response);
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}

module.exports = EditContent;