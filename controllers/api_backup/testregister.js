var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
_ = require('lodash');

TestRegister = (req, res) =>{
    var response = {
        message: "Hello this is login api.... called",
        status:0
    };
    var promisses = [];
    var email = req.body.email ? req.body.email: "";
    var password = req.body.password ? md5(req.body.password) : "";
    var type = req.body.type ? req.body.type : '';
    var first_name = req.body.first_name ? req.body.first_name: "";
    var last_name = req.body.last_name ?  req.body.last_name : "";
    var phone = req.body.phone ? req.body.phone : '';
    var address = req.body.address ? req.body.address: "";
    var city = req.body.city ? req.body.city : "";
    var state = req.body.state ? req.body.state : "";
    var image = req.body.image ? req.body.image : "";
    var zip_code = req.body.zip_code ? req.body.zip_code : '';
    var spa_location = req.body.spa_location ? req.body.spa_location: "";
    var hydra_facial_machine_id = req.body.hydra_facial_machine_id ? req.body.hydra_facial_machine_id : "";

    var device_key = req.body.device_key ? req.body.device_key : "";
	var device_type = req.body.device_type ? req.body.device_type : "web";
	var app_version = req.body.app_version ? req.body.app_version : "";
    var notification_key = req.body.notification_key ? req.body.notification_key : "";
    var country_code = req.body.country_code ? req.body.country_code :"";
    var spa_name = req.body.spa_name ? req.body.spa_name :"";
    
    var social_type = req.body.social_type ? req.body.social_type : null;
    var social_key = req.body.social_key ? req.body.social_key : "";
    var from = req.body.from ? req.body.from : "";
    
   var  questions = req.body.questions ? req.body.questions: [];
    if(from !=='web'){
        questions = req.body.questions ? req.body.questions: [];
    }
   var questioninputData = JSON.stringify(req.body.questions)
    var questions = JSON.parse(questioninputData);
	console.log('inputDataVal',  inputDataVal);
 console.log("request------------>",req.body);
 
 

//  questions.forEach(function (element) {
//      console.log('ele: ', element.question_id);
//  });

//  if(from === 'app'){
//     questions = JSON.parse(JSON.stringify(questions.toString()));
//     questions = JSON.parse(questions.toString())

//     console.log(questions,"--------------------------")
//     console.log(from, typeof questions, questions)
//     console.log(questions.length)
//  }
    // if(questions.length == 0){
    //     response.status = constants.ValidationStatusCode;
    //     response.message = constants.SECURITY_QUESTION_VALIDATION;
    //     res.status(response.status).json(response)
    // }
    var data = {
        first_name:first_name,
        last_name:last_name,
        email:email,
        password:password,
        phone:phone,
        address:address,
        city:city,
        state:state,
        zip_code:zip_code,
        spa_location:spa_location,
        hydra_facial_machine_id:hydra_facial_machine_id,
        status:'active',
        type:type,
        image:image,
        device_key: device_key,
        device_type:device_type,
        app_version:app_version,
        notification_key:notification_key,
        country_code:country_code,
        spa_name:spa_name,
        social_key:social_key,
        social_type:social_type
    }
   
    if(first_name === ''){
        response.message = constants.FirstNameValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(last_name === ''){
        response.message = constants.LastNameValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(phone === ''){
        response.message = constants.PhoneValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(address === ''){
        response.message = constants.AddressValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(email === ''){
        response.message = constants.EmailValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(password === ''){
        response.message = constants.PASSWORD_VALIDATION;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    if(type === ''){
        response.message = constants.UserTypeValidation;
        response.status = constants.ValidationStatusCode;
        return res.status(response.status).json(response)
    }
    data.unique_id = _.random(1000000000, 9999999999);
    sql = "SELECT * FROM `users` WHERE public_id="+data.unique_id;
    dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(user=> {
        console.log("public id exists---", user)
        if(user.length > 0){
        data.unique_id =  _.random(1000000000, 9999999999);
        }
        // dbConnection.query("UPDATE `users` SET public_id = "+unique_id+ "WHERE id="+result[0].id ,
        // {type:dbConnection.QueryTypes.UPDATE}).then(success=>{
        //   console.log(success)
        // })
    })
    existsSql= "SELECT * FROM `users` WHERE email='"+email+"' && deleted_at is NULL";
    dbConnection.query(existsSql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        if(result.length > 0){
            response.message = constants.AlreadyExists;
            response.status = constants.ConflictStatusCode;
            return res.status(response.status).json(response)
        }else{
            sql = "INSERT INTO `users` SET public_id=:unique_id, first_name=:first_name, last_name=:last_name, email=:email, password=:password, phone=:phone, country_code=:country_code, address=:address, state=:state, zip_code=:zip_code ";
            sql+= ",spa_location=:spa_location, spa_name=:spa_name, status=:status, type=:type, hydra_facial_machine_id=:hydra_facial_machine_id,image=:image, device_type=:device_type, notification_key=:notification_key, device_key=:device_key, app_version=:app_version, social_key=:social_key, social_type=:social_type"
            dbConnection.query(sql, {replacements:data, type:dbConnection.QueryTypes.INSERT}).then(function(result){
                response.result = result[0]
                questions.forEach(element=>{
                    element.user_id = result[0];
                    sql = "INSERT INTO `user_answers` SET question_id=:question_id, answer=:answer, user_id=:user_id";
                    promisses.push(dbConnection.query(sql,{replacements:element, type:dbConnection.QueryTypes.INSERT}).then(respons=>{
                        console.log('inserted')
                    }))
                })
                // for(var i=0; i<)
                Promise.all(promisses).then(result=>{
                    var res_for_token = {};
                    response.status = constants.SuccessStatusCode;
                    response.message = constants.REGISTERD;

                     
                    res_for_token.first_name = first_name;
                    res_for_token.last_name = last_name;
                    res_for_token.email = email;
                    res_for_token.phone = phone;
                    res_for_token.id = response.result[0];

                    var token = jwt.sign(res_for_token,constants.TOKEN_VALUE);

                    response.token = token;
                    delete response.result;
                    res_for_token.token = token;
                    return res.status(response.status).json(response);
                }).catch(function(err){
                    console.log(err)
                   response.message = constants.SomethingWentWrong;
                   response.status = constants.ErrorStatusCode;
                   return res.status(response.status).json(response)
                })
                
            }).catch(function(err){
                console.log(err)
               response.message = constants.SomethingWentWrong;
               response.status = constants.ErrorStatusCode;
               return res.status(response.status).json(response)
            })
        }
    })

    
}

module.exports = TestRegister;
