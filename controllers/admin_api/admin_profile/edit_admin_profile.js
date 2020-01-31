var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment');

EditAdminprofile = (req, res) => {
    var first_name = req.body.first_name ? req.body.first_name : "";
    var email = req.body.email ? req.body.email : "";
    var image = req.body.image ? req.body.image : "";
    var update=new Date();
    update=moment(update).format("YYYY-MM-DD HH:mm:ss");
    console.log(update);
    var res_for_token = {};
    var response = {};
   
   var token = jwt.sign(res_for_token,constants.TOKEN_VALUE);
   response.status = constants.ValidationStatusCode;
   
   if(email =='')
   {
       email=res.locals.userData.email;
    }

    if(first_name == '')
    {
        first_name=res.locals.userData.first_name;
    }

    if(image == '')
    {
        image =res.locals.userData.image;
    }

            var info = { email:email, first_name: first_name, image: image,update:update};
        sql = "UPDATE `admin` SET email='" + email + "',first_name='" + first_name + "',image='" + image + "', updated_at='"+update+"' WHERE id = '" + res.locals.userData.id + "'";
        dbConnection.query(sql, { type: dbConnection.QueryTypes.UPDATE }).then(function (user) {
            console.log(user);
            if (user.length > 0) {
                var response = {
                    status: constants.SuccessStatusCode,
                    message: 'Update Profile Successfully.',
                    result:{ email:email,name: first_name, image: image},
                    
                };
                return res.status(constants.SuccessStatusCode).json(response);
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

module.exports = EditAdminprofile;
