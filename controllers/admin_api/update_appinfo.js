var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var moment = require('moment');
Updateaboutapp = (req, res) => {
    var response = {};
var id=req.body.id?req.body.id:"";
var website=req.body.website?req.body.website:"";
var email=req.body.email?req.body.email:"";
var phone_number=req.body.phone_number?req.body.phone_number:"";
var address =req.body.address ? req.body.address:"";
var update=new Date();
update=moment(update).format("YYYY-MM-DD HH:mm:ss");
var data={
    id:id,
    website:website,
    email:email,
    phone_number:phone_number,
    address:address,
    update_at:update
}
    sql = "UPDATE `about_apps` SET `website`=:website,`email`=:email,`phone_number`=:phone_number,`address`=:address WHERE `id`=:id";
    dbConnection.query(sql, {replacements:data,type: dbConnection.QueryTypes.UPDATE }).then(function (about) {
        // console.log(about);
        if (about.length > 0) {
            var response = {
                status: constants.SuccessStatusCode,
                message:constants.APPINFO,
            };
            return res.status(constants.SuccessStatusCode).json(response);
        } else {
        var response = {};
        response.status = constants.ValidationStatusCode;
        response.message = constants.INACTIVE_USER;
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
module.exports = Updateaboutapp;
