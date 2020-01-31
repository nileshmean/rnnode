var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var moment = require('moment');

EditProfile = (req, res) => {

    var response = {};
    var userId = res.locals.userData.id;
   
    var first_name = req.body.first_name ? req.body.first_name: "";
    var last_name = req.body.last_name ?  req.body.last_name : "";
    var phone = req.body.phone ? req.body.phone : "";
    var country_code = req.body.country_code ? req.body.country_code : "";
    var address = req.body.address ? req.body.address: "";
    var location_lat = req.body.location_lat ? req.body.location_lat : "";
    var location_lng = req.body.location_lng ? req.body.location_lng : "";
    var city = req.body.city ? req.body.city : "";
    var state = req.body.state ? req.body.state : "";
    var image = req.body.image ? req.body.image : "";
    var zip_code = req.body.zip_code ? req.body.zip_code : "";
    var spa_location = req.body.spa_location ? req.body.spa_location: "";
    var spa_location_lat = req.body.spa_location_lat ? req.body.spa_location_lat : "";
    var spa_location_lng = req.body.spa_location_lng ? req.body.spa_location_lng : "";
    var hydra_facial_machine_id = req.body.hydra_facial_machine_id ? req.body.hydra_facial_machine_id : "";

    var skill = req.body.skill ? req.body.skill :null;
    var education = req.body.education ? req.body.education : "";
    var designation = req.body.designation ? req.body.designation : "";
    var work_experience = req.body.work_experience ? req.body.work_experience : "";

    var notification_status = req.body.notification_status ? req.body.notification_status : "";
    var provider_logo = req.body.provider_logo ? req.body.provider_logo : "";

    var edit_type = req.body.edit_type ? req.body.edit_type : "single";

    console.log('--------------------', req.body)
    var aboutMe = req.body.about_me ? req.body.about_me : "";
    var currentDate = new Date();
   // var data = { id: userId, first_name: first_name, last_name: last_name, phone: phone, country_code: country_code, address: address, city: city, state: state, zip_code: zip_code, spa_location: spa_location, hydra_facial_machine_id: hydra_facial_machine_id, image: image, skill: skill, education: education, designation: designation, work_experience: work_experience, about_me: aboutMe };
    var data = {"id":userId}

    var sql = "UPDATE `users` SET "
   // console.log('first_name', req.body)

    if(first_name !== ''){
        console.log('first_name', first_name)
       data.first_name = first_name;
       sql += "first_name=:first_name, "
    }

    if(last_name !== ''){
        data.last_name = last_name;
       sql += "last_name=:last_name, "
    }

    if(phone !== ''){
        data.phone = phone;
       sql += "phone=:phone, "
    }

    if(address !== ''){
        data.address = address;
        sql += "address=:address, "
    }
    if(image !== ''){
        data.image = image;
        sql += "image=:image, "
    }
   
    if(city !== ''){
        data.city = city;
        sql += "city=:city, "
    }

    if(state !== ''){
        data.state = state;
        sql += "state=:state, "
    }

    if(zip_code !== ''){
        data.zip_code = zip_code;
        sql += "zip_code=:zip_code, "
    }

    if(hydra_facial_machine_id !== ''){
        data.hydra_facial_machine_id = hydra_facial_machine_id;
        sql += "hydra_facial_machine_id=:hydra_facial_machine_id, "
    }

    if (location_lat !== '') {
        data.location_lat = location_lat;
        sql += "location_lat =:location_lat, "
    }
    if (location_lng !== '') {
        data.location_lng = location_lng;
        sql += "location_lng =:location_lng, "
    }
    if (spa_location_lat !== '') {
        data.spa_location_lat = spa_location_lat;
        sql += "spa_location_lat =:spa_location_lat, "
    }
    if (spa_location_lng !== '') {
        data.spa_location_lng = spa_location_lng;
        sql += "spa_location_lng =:spa_location_lng, "
    }
    if (spa_location !== '') {
        data.spa_location = spa_location;
        sql += "spa_location =:spa_location, "
    }

   // if (edit_type == 'full') {
     if(work_experience !== '' || edit_type == 'full') {
        data.work_experience = work_experience;
        sql += "work_experience =:work_experience, "
    }

    console.log("skill--------------------------", skill);
     if (skill !== null || edit_type == 'full') {

    //if (notification_status =='' && edit_type == 'full'){
        data.skill = skill;
        sql += "skill =:skill, "
       }
   // }

    if (education !== '' || edit_type == 'full') {
   // if (edit_type == 'full') {
        data.education = education;
        sql += "education =:education, "
    }

   if (designation !== '' || edit_type == 'full') {
    //if (notification_status =='' && edit_type == 'full'){
        data.designation = designation;
        sql += "designation =:designation, "
       }
   // }
    if (aboutMe!="" || edit_type == 'full') {
     // if (notification_status ==''){
        data.aboutMe = aboutMe;
        sql += "about_me =:aboutMe, "
        }
   

    if (notification_status !='') {
        data.notification_status = notification_status;
        sql += "notification_status =:notification_status, "
    }
    if (country_code !='') {
        data.country_code = country_code;
        sql += "country_code =:country_code, "
    }
    if (provider_logo != '') {
        data.provider_logo = provider_logo;
        sql += "provider_logo =:provider_logo, "
    }
    data.updated_at = currentDate;

    sql += "updated_at =:updated_at WHERE id = :id "

    //console.log("Data : ", req.body);

    //var query = "UPDATE users SET first_name = :first_name, last_name = :last_name, phone = :phone, country_code = :country_code, address = :address, city = :city, state = :state, zip_code = :zip_code, spa_location = :spa_location, hydra_facial_machine_id = :hydra_facial_machine_id, image = :image, skill = :skill, education = :education, designation = :designation, work_experience = :work_experience, about_me = :about_me WHERE id = :id";

    dbConnection.query(sql, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        dbConnection.query("SELECT * FROM users WHERE id="+userId, {type:dbConnection.QueryTypes.SELECT}).then(user=>{
            if(user.length > 0){
                user[0].token = req.headers.token;
                response.result = user[0];
                response.status = constants.SuccessStatusCode;
                response.message = constants.Updated;
                return res.status(response.status).json(response);
            }
        })
        
    })
    .catch(err => {
        console.error("Error into edit_profile.js", err);
        response.message = constants.SomethingWentWrong;
        response.status = constants.ErrorStatusCode;
        return res.status(response.status).json(response);
    });



}

module.exports = EditProfile;