var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var EmailHelper = require('../../libraries/EmailHelper')();
let logourl = constants.LOGO;
var Partners = function(req,res){

    var partner_email = req.body.partner_email ? req.body.partner_email : "komal@idealittechno.com";
    var partner_name = req.body.partner_name ? req.body.partner_name : "";
    var partner_id = req.body.partner_id ? req.body.partner_id : "";
    var name = req.body.name ? req.body.name : "";
    var email = req.body.email ? req.body.email : "";
    var mobile_no = req.body.phone ? req.body.phone : "";
    var message = req.body.message ? req.body.message : "";
   // var attachement = req.body.attachement ? req.body.attachement : "";
   // var type =req.body.type ? req.body.type:"provider";

    var user_id = res.locals.userData.id;

    var response = {
        'status': constants.ValidationStatusCode,
        'message': constants.SOMETHING_WENT_WRONG
      };

       if (email === '') {
        response.message = "Email is required.";
        return res.status(constants.ValidationStatusCode).json(response);
      }
       if (name ==='') {
        response.message = "Name is required.";
        return res.status(constants.ValidationStatusCode).json(response);
      }
       var data = {
           partners_email:partner_email,
           partner_id:partner_id,
           partners_name:partner_name,
           name:name,
           email:email,
           phone:mobile_no
       }
        var insert_support = "INSERT INTO partners_mail SET " +
          "`partner_id`=:partner_id, `partners_email`=:partners_email, `partners_name`=:partners_name,`name`=:name,`email`=:email, `phone`=:phone"
        dbConnection.query(insert_support, {
          replacements: data,
          type: dbConnection.QueryTypes.INSERT
        }).then(function(result) {
          if (result.length > 0) {
              var content = "Name: "+name+" <br /> Email: "+email+"<br /> Contact number:"+mobile_no+" connected to you.";
            dbConnection.query('SELECT * FROM `email_template` WHERE id=7',{type:dbConnection.QueryTypes.SELECT}).then(template=>{
                let emailtemplate = template[0].body.replace('[USERNAME]', partner_name).replace('[LOGO]', "<img src='"+logourl+"' >").replace('[CONTENT]', content)
                console.log('------------html templatae',emailtemplate,'-----------------------')
                EmailHelper.sendEmail({email:partner_email, subject:template[0].subject, body:emailtemplate}, function(){
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
module.exports=Partners;
