var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var NotificationHelper = require('./../../library/NotificationHelper')();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment-timezone');

team_management_add = (req, res) => {


    var member_id = req.body.member_id ? req.body.member_id : "";
    var leader_id = req.body.leader_id ? req.body.leader_id : "";
    var response = {};

    if(member_id == '')
    {        
            // response.message = "Member id is required.";
            // response.status = constants.ValidationStatusCode;
            // return res.status(response.status).json(response); 
    }
    else if(leader_id == '')
    {
            response.message = "leader id is required.";
            response.status = constants.ValidationStatusCode;
            return res.status(response.status).json(response); 
    }
    if(member_id == '')
    {        
        member_id_array = [];
    }else{
     var member_id_array = member_id.split(",");
    }
   // var member_id_array = member_id;
    var update_sql = "UPDATE `users` SET `team_leader_id`= 0 WHERE team_leader_id = "+leader_id;
    dbConnection.query(update_sql,{
                    type: dbConnection.QueryTypes.UPDATE
                    }).then(function (user_res) {

                console.log("member_id_array === ", member_id_array.length);
                
                 for(var i=0; i < member_id_array.length; i++){
                    (function(i){

                        var sql = "UPDATE `users` SET `team_leader_id`= "+leader_id+" WHERE id = "+member_id_array[i];

                        console.log("sql  == ", sql);

                            dbConnection.query(sql,{
                                type: dbConnection.QueryTypes.UPDATE
                                }).then(function (user) {
                                        // var response = {
                                        //     status: constants.SuccessStatusCode,
                                        //     message: 'Update Successfully.',
                                        // };
                                        // return res.status(response.status).json(response);

                                }).catch(function (err) {
                                    throw err;
                                    console.log(' -- check verify user Query failed err.message: ' + err);
                                    // response.message = constants.SOMETHING_WENT_WRONG;
                                    // response.status = constants.ValidationStatusCode;
                                    // return res.status(response.status).json(response);
                                });
                            })(i);
                        }
                    
                             var response = {
                                    status: constants.SuccessStatusCode,
                                    message: 'Update Successfully.',
                                };
                                return res.status(response.status).json(response);

            }).catch(function (err) {
                throw err;
                console.log(' -- check verify user Query failed err.message: ' + err);
                 var response = {
                            status: constants.SuccessStatusCode,
                            message: 'Update Successfully.',
                            };
                    return res.status(response.status).json(response);
            });
}

module.exports = team_management_add;
