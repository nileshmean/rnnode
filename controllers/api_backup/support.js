var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var EmailHelper = require('../../libraries/EmailHelper')();

let logourl = constants.LOGO;

var support = function(req,res){

    var name = req.body.name ? req.body.name : "";
    var email = req.body.email ? req.body.email : "";
    var topic = req.body.topic ? req.body.topic : "";
    var message = req.body.message ? req.body.message : "";
   // var attachement = req.body.attachement ? req.body.attachement : "";
    var type =req.body.type ? req.body.type:"support";

    //var user_id = res.locals.userData.id;

    var response = {
        'status': constants.ValidationStatusCode,
        'message': constants.SOMETHING_WENT_WRONG
      };

       if (email === '') {
        response.message = "Email is required.";
        return res.status(constants.ValidationStatusCode).json(response);
      }
       if (message ==='') {
        response.message = "Message is required.";
        return res.status(constants.ValidationStatusCode).json(response);
      }
   
        var insert_support = "INSERT INTO supports SET " +
          //"`user_id`='" + user_id + "'," +
          "`name`=:name," +
          "`email`='" + email + "'," +
          "`topic`='" + topic + "'," +
         // "`attachement`='" + attachement + "'," +
          "`support_type`='" + type + "'," +
          "`message`=:message";
        dbConnection.query(insert_support, {
          replacements: {message:message,name:name},
          type: dbConnection.QueryTypes.INSERT
        }).then(function(result) {
          if (result.length > 0) {
            dbConnection.query('SELECT * FROM `email_template` WHERE id=6',{type:dbConnection.QueryTypes.SELECT}).then(template=>{
              let content = " name: "+name+ " email: "+ email+"  <br />"+topic+" <br />"+ message
              let emailtemplate = template[0].body.replace('[USERNAME]', "HydraFacial").replace('[LOGO]', "<img src='"+logourl+"' >").replace('[CONTENT]', content)
              EmailHelper.sendEmail({email:'loyalty@hydrafacial.com', subject:"Support", body:emailtemplate}, function(){
                  console.log("mail sent.....")
              })
            })
            var response = {
              'status': constants.SuccessStatusCode,
              'message': "Sent Successfully.",
            };
            return res.status(constants.SuccessStatusCode).json(response);
          }
        }).catch(function(err) {
          console.log(
            ' -- check Review send Query failed err.message: ' +
            err.message);
          // response  to send
          var response = {
            'status': constants.ErrorStatusCode,
            'error': constants.SOMETHING_WENT_WRONG
          };
          return res.status(constants.ErrorStatusCode).json(response);
        });
      
};
module.exports=support;
