var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var moment = require('moment');

reply_feed_comment = (req, res) => {

    var response = {};

    var userId = res.locals.userData.id;
    var reply_comment = req.body.reply_comment ? req.body.reply_comment:"";
    var comment_id = req.body.comment_id ? req.body.comment_id:"";

     if (comment_id == '') {
        response.status = constants.ValidationStatusCode;
        response.message = "comment id is required.";
        return res.status(response.status).json(response);
    }else if(reply_comment == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Reply comment is required.";
        return res.status(response.status).json(response);
    }
    console.log('=======================================')
     console.log(moment().toISOString)
    var currentDate = new Date();
    console.log(currentDate);
    var data = {"id":comment_id}

    var sql = "UPDATE `feeds_comment` SET "

    if(reply_comment !== ''){
      
       data.reply_comment = reply_comment;
       sql += "reply_comment=:reply_comment WHERE id = :id";
    }

    // data.updated_at = currentDate;

    // sql += "updated_at =:updated_at WHERE id = :id "

    //console.log("Data : ", req.body);

    //var query = "UPDATE users SET first_name = :first_name, last_name = :last_name, phone = :phone, country_code = :country_code, address = :address, city = :city, state = :state, zip_code = :zip_code, spa_location = :spa_location, hydra_facial_machine_id = :hydra_facial_machine_id, image = :image, skill = :skill, education = :education, designation = :designation, work_experience = :work_experience, about_me = :about_me WHERE id = :id";

    dbConnection.query(sql, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        response.status = constants.SuccessStatusCode;
        response.message = constants.Updated;
        return res.status(response.status).json(response);
    })
    .catch(err => {
        console.error("Error", err);
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response);
    });



}

module.exports = reply_feed_comment;