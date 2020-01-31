var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

AddComment = (req, res) => {
    var response = {};
    var feed_id = req.body.feed_id ? req.body.feed_id : '';
    var user_id = res.locals.userData.id;
    var comment = req.body.comment ? req.body.comment : '';
  
    var data = {
        feed_id:feed_id,
        user_id:user_id,
        comment:comment
    }

    sql = "INSERT INTO `feeds_comment` SET feed_id=:feed_id, user_id=:user_id, comment=:comment";
    dbConnection.query(sql, {replacements: data,type:dbConnection.QueryTypes.INSERT}).then(function(result){
        response.status = constants.SuccessStatusCode;
        response.message = constants.CommentAddeddSuccessfully;
        return res.status(response.status).json(response)
    }).catch(function(err){
        console.log(err)
       response.message = constants.SomethingWentWrong;
       response.status = constants.ErrorStatusCode;
       return res.status(response.status).json(response)
    })
}

module.exports = AddComment;