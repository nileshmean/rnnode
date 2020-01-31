var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var moment = require('moment');

SaveIntrest = (req, res) => {

    
    var response = {};
    var userId = res.locals.userData.id;
    var data = {provider_id:userId};
   
    var shirt_size = req.body.shirt_size ? req.body.shirt_size: "";
    var shoe_size = req.body.shoe_size ?  req.body.shoe_size : "";
    var dob = req.body.dob ? req.body.dob : "";
    var music = req.body.music ? req.body.music: "";
    var instructor = req.body.instructor ? req.body.instructor : "";

    data.shirt_size = shirt_size;
    data.shoe_size = shoe_size;
    data.dob = dob;
    data.music = music;
    data.instructor = instructor;
  
    select_sql = "SELECT * FROM provider_info WHERE provider_id = "+userId;
    dbConnection.query(select_sql, {type:dbConnection.QueryTypes.SELECT}).then(result => {
        if(result.length > 0){
            var sql = "UPDATE `provider_info` SET shirt_size=:shirt_size, shoe_size=:shoe_size, dob=:dob, music=:music, instructor=:instructor WHERE provider_id=:provider_id";
            dbConnection.query(sql, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
            .then(result => {
               
                        response.status = constants.SuccessStatusCode;
                        response.message = "Interests updated successfully";
                        return res.status(response.status).json(response);
             
                
            })
            .catch(err => {
                console.error("Error into edit_profile.js", err);
                response.message = constants.SomethingWentWrong;
                response.status = constants.ErrorStatusCode;
                return res.status(response.status).json(response);
            });
        }
        else{
            var sql = "INSERT INTO `provider_info` SET provider_id=:provider_id, shirt_size=:shirt_size, shoe_size=:shoe_size, dob=:dob, music=:music, instructor=:instructor";
            dbConnection.query(sql, { replacements: data, type: dbConnection.QueryTypes.INSERT })
            .then(result => {
                
                        response.status = constants.SuccessStatusCode;
                        response.message = "intrests saved successfully.";
                        return res.status(response.status).json(response);
                             
            })
            .catch(err => {
                console.error("Error into edit_profile.js", err);
                response.message = constants.SomethingWentWrong;
                response.status = constants.ErrorStatusCode;
                return res.status(response.status).json(response);
            });
        }
    })
   

}

module.exports = SaveIntrest;