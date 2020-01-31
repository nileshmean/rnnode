var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var NotificationHelper = require('./../../library/NotificationHelper')();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment-timezone');

Sendnotification = (req, res) => {

  var response = {};
  var created_at = moment().utc().format("YYYY-MM-DD HH:mm:ss");
  var user_from_id = req.body.user_from_id ? req.body.user_from_id : "";
  var type = req.body.type ? req.body.type : "new_site";
  var title = req.body.title ? req.body.title : "";
  var message = req.body.message ? req.body.message: "";
  var receivers = req.body.receivers ? req.body.receivers : "";
  var res_for_token = {};
  var token = jwt.sign(res_for_token,constants.TOKEN_VALUE);
   response.status = constants.ValidationStatusCode;
    user_from_id=res.locals.userData.id;
 if (title == '') {
      response.title = constants.TitleValidation;
      return res.status(constants.ValidationStatusCode).json(response);
  }

  if (message == '') {
      response.message = constants.MessageValidation;
      return res.status(constants.ValidationStatusCode).json(response);
  }

  if(receivers == ''){
    response.status = constants.ValidationStatusCode;
    response.message = "please select at least 1 receiver to send notification.";
    return res.status(response.status).json(response)
}

var insertData = {user_from_id:user_from_id,
user_to_id:receivers,
title:title,
site_id:1,
message:message,
status:0,
type:'admin',
created_at:new Date()
};

console.log(insertData);

sql = "INSERT INTO `notifications` SET " +
"`user_from_id`=:user_from_id,"+"`user_to_id`=:user_to_id,"+"`title`=:title,"+
"`message`=:message," +
"`type`=:type," +
"`site_id`=:site_id," + "`status`=:status,"+"`created_at`=:created_at";
dbConnection.query(sql,
  { replacements:insertData,
    type: dbConnection.QueryTypes.INSERT
     }).then(function (user) {
    console.log(user);
    if (user.length > 0) {

      var array = receivers.split(",");
       var allSquadUsers = [];

        // for (var i = 0; i < array.length; i++) {
        //   allSquadUsers.push(array[i].id);
        // }

        NotiSQL = "SELECT * from user_notification_keys WHERE user_id IN ("+receivers+")";
        dbConnection.query(NotiSQL, {
        type: dbConnection.QueryTypes.SELECT
        }).then(function (resNoti) {

          //-------------- send notifivation

              var noti_data = {};

              if(resNoti.length > 0){

                  noti_data.title = title;
                  noti_data.msg = message;
                  noti_data.type = 'admin';
                  noti_data.id = '';

                  var androidIds = [];
                  var iphoneIds = [];

                  resNoti.forEach(function(element) {
                  if(element.device_type=='android'){
                  androidIds.push(element.notification_key);
                  }else{
                  iphoneIds.push(element.notification_key);
                  }
                  });

                  if(androidIds.length>0){
                  // send notification to andorid devices
                  noti_data.device_type = 'android';
                  NotificationHelper.mutipleNotification(androidIds,noti_data, function (noti) {
                  console.log("send notification to andorid ++++++++++++++++++++");

                  });
                  }
                  if(iphoneIds.length>0){
                  // send notification to iPhone devices
                  noti_data.device_type = 'iphone';
                  NotificationHelper.mutipleNotification(iphoneIds,noti_data, function (noti) {
                  console.log("send notification iphone ++++++++++++++++++++");

                  });
                  }
              }



         //---------------//--------------
       });


        var response = {
            status: constants.SuccessStatusCode,
            message: 'Sent notification Successfully.',
        };
        return res.status(response.status).json(response);

    } else {
    var response = {};
    response.status = constants.ValidationStatusCode;
    response.message = constants.INVALID_USER;
    console.log(response)
    res.status(response.status).json(response);
}
}).catch(function (err) {
throw err;
console.log(' -- check verify user Query failed err.message: ' + err);
response.message = constants.SOMETHING_WENT_WRONG;
response.status = constants.SomethingWentWrong;
return res.json(response);
});

}

module.exports = Sendnotification;
