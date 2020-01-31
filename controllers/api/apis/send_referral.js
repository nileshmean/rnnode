var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var EmailHelper = require('../../libraries/EmailHelper')();
let logourl = constants.LOGO;

send_referral = (req, res) => {
    var response = {};
  
    var name = req.body.name ? req.body.name : '';
    var email = req.body.email ? req.body.email : '';
    var spa_name = req.body.spa_name ? req.body.spa_name : '';
    var location = req.body.location ? req.body.location : '';
    var referral_link = req.body.referral_link ? req.body.referral_link : '';
    
    var referral_type = req.body.referral_type ? req.body.referral_type : 'referral_program';

    var user_id =  res.locals.userData.id;
    var aesthetician_email = res.locals.userData.email;
    var user_name = res.locals.userData.first_name.concat(" ",  res.locals.userData.last_name);

     
     if (name == '') {
        response.status = constants.ValidationStatusCode;
        response.message = "Name is required.";
        return res.status(response.status).json(response);
    }else if(email == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Email is required.";
        return res.status(response.status).json(response);
    }else if(location == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Location is required.";
        return res.status(response.status).json(response);
    }else if(referral_link == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Referral link is required.";
        return res.status(response.status).json(response);
    }
 

    var data = {
        name:name,
        email:email,
        location:location,
        user_id:user_id,
        referral_link:referral_link
    }

    // sql = "INSERT INTO `feeds` SET title=:title, description=:description, image=:image, user_id=:user_id, status=:status";
    // dbConnection.query(sql, {replacements:data, type:dbConnection.QueryTypes.INSERT}).then(function(result){
        // Email to invite
        dbConnection.query('SELECT * FROM `email_template` WHERE id=5',{type:dbConnection.QueryTypes.SELECT}).then(template=>{

            let template1 = template[0]; 
            let template2 = template[0]; 

            let emailtemplate = template1.body.replace('[USERNAME]', name).replace('[LOGO]', "<img src='"+logourl+"' >").replace('[REFERRAL_LINK]', referral_link).replace('[REFERRAL_LINK]', referral_link).replace('[CONTENT]', 'Join me on the Hydrafacial Hub. click on below link')
            EmailHelper.sendEmail({email:email, subject:template1.subject, body:emailtemplate}, function(){
                console.log("mail sent.....")
            })

            let emailtemplate2 = template2.body.replace('[USERNAME]', user_name).replace('[LOGO]', "<img src='"+logourl+"' >").replace('[REFERRAL_LINK]', referral_link).replace('[REFERRAL_LINK]', referral_link).replace('[CONTENT]', 'Thank You for invit aesthetician to join hydrafacial.')
            EmailHelper.sendEmail({email:aesthetician_email, subject:template2.subject, body:emailtemplate2}, function(){
                console.log("mail sent.....")
            })
        })
        //    Email to admin
                    if(referral_type == 'capital_sale'){
                        dbConnection.query('SELECT * FROM `email_template` WHERE id=6',{type:dbConnection.QueryTypes.SELECT}).then(template=>{
                            let content = "referral program => from: "+user_name+ " to: "+ name+" by "+referral_link;
                         let emailtemplate = template[0].body.replace('[USERNAME]', "Komal Pawar").replace('[LOGO]', "<img src='"+logourl+"' >").replace('[CONTENT]', content)
                         EmailHelper.sendEmail({email:'komal@idealittechno.com', subject:template[0].subject, body:emailtemplate}, function(){
                             console.log("mail sent.....")
                         })
                    })
                    }
    //    thanku email to aesthetician
        response.status = constants.SuccessStatusCode;
        response.message = "Sent Successfully.";
        return res.status(response.status).json(response)
    // }).catch(function(err){
    //     console.log(err)
    //    response.message = constants.SomethingWentWrong;
    //    response.status = constants.ErrorStatusCode;
    //    return res.status(response.status).json(response)
    // })
}

module.exports = send_referral;