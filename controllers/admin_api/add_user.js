var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

AddUser = (req, res) => {
  var response = {};
  var first_name = req.body.first_name ? req.body.first_name : "";
  var last_name = req.body.last_name ? req.body.last_name : "";
 
  var phone = req.body.phone ? req.body.phone :"";
  var country_code = req.body.country_code ? req.body.country_code :"";
  var email=req.body.email ? req.body.email:"";
  var password = req.body.password ? md5(req.body.password) : "";
  var status = 'active';
  var type = req.body.usertype ? req.body.usertype : "";
  var image =req.body.image ? req.body.image:"";
  var address = req.body.address ? req.body.address : "";
  var state = req.body.state ? req.body.state : "";
  var zip_code =req.body.zip_code ? req.body.zip_code:"";
  var spa_location = req.body.spa_location ? req.body.spa_location : "";
  var hydra_facial_machine_id = req.body.hydra_facial_machine_id ? req.body.hydra_facial_machine_id : "";

 
  var data = {
    first_name:first_name,
    last_name:last_name,
    password: password,
    email:email,
    phone:phone,
    type: type,
    image:image,
    address:address,
    state:state,
    zip_code:zip_code,
    spa_location:spa_location,
    hydra_facial_machine_id:hydra_facial_machine_id,
    status:status,
    country_code:country_code,
  };
  
 // console.log("data API  =========", data);

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

  var insertSql = "INSERT INTO `users` SET public_id=:unique_id, first_name=:first_name, last_name=:last_name,country_code=:country_code, email=:email, password=:password, phone=:phone, address=:address, state=:state, zip_code=:zip_code,spa_location=:spa_location, status=:status, type=:type, hydra_facial_machine_id=:hydra_facial_machine_id,image=:image ";

  sql = "SELECT * FROM `users` WHERE email= '" + email + "' && deleted_at IS NULL";
  dbConnection.query(sql, { type: dbConnection.QueryTypes.SELECT }).then(function (result) {

    if (result.length > 0) {
      
      response.status = constants.ConflictStatusCode;
      response.message = constants.AlreadyExists;
      return res.status(response.status).json(response)
    } else {
      dbConnection.query(insertSql, {
        replacements: data,
        type: dbConnection.QueryTypes.INSERT
      })
        .then(function (user) {
          console.log(user);
          response.status = constants.SuccessStatusCode;
          response.message = constants.ADDUSER;
          return res.status(response.status).json(response)
        }).catch(function (err) {
          console.log(err)
          response.message = constants.SomethingWentWrong;
          response.status = constants.ErrorStatusCode;
          return res.status(response.status).json(response);
        })

    }

  })

}

module.exports = AddUser;
