var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

Profile = (req, res) =>{
    response = {
        status:0,
        message:""
    }
    console.log(req.headers)
    var id = res.locals.userData.id;

    if(id == '' || id == undefined){
       response.status = constants.ValidationStatusCode;
       response.message = constants.ID_VALIDATION;
       return res.status(response.status).json(response);
    }
    sql = "SELECT users.*, provider_info.music, provider_info.dob,provider_info.shirt_size,provider_info.shoe_size,provider_info.instructor FROM `users` LEFT JOIN provider_info ON provider_info.provider_id = users.id WHERE users.id="+id;
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length == 0){
            response.message = constants.RecordNotFound;
            response.status = constants.NotFoundStatusCode;
            return res.status(response.status).json(response)
        }
        response.status = constants.SuccessStatusCode;
        result[0].token = req.headers.token
        response.result = result[0];
        return res.status(response.status).json(response)
    }).catch(function(err){
        console.log(err)
       response.message = constants.SomethingWentWrong;
       response.status = constants.ErrorStatusCode;
       return res.status(response.status).json(response)
    })


}
module.exports = Profile;