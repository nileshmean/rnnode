var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
 AddUser = (req, res)=>{
   var response = {};
   var favPromises = [];
   var data = {};
   var meta_data = [];
   var id = req.body.id ? req.body.id : "";
   var lang = req.body.lang ? req.body.lang : "";

   if(id == ''){
     response.status = constants.ValidationStatusCode;
     response.message = constants.ID_VALIDATION;
     return res.status(response.status).json(response);
   }
      console.log(req.body)
    var EN_first_name = req.body.firstname_en ? req.body.firstname_en : "";
    var EN_last_name = req.body.lastname_en ? req.body.lastname_en : "";
    var IN_first_name = req.body.firstname_in ? req.body.firstname_in : "";
    var IN_last_name = req.body.lastname_in ? req.body.lastname_in : "";
    var FR_first_name = req.body.firstname_fr ? req.body.firstname_fr : "";
    var FR_last_name = req.body.lastname_fr ? req.body.lastname_fr : "";
    var IT_first_name = req.body.firstname_it ? req.body.firstname_it : "";
    var IT_last_name = req.body.lastname_it ? req.body.lastname_it : "";
    var user_name = req.body.username ? req.body.username : "";
    var price_per_hour = req.body.price ? req.body.price : "";
    var image = req.body.image ? req.body.image:"";
    var customerIds = req.body.customerIds ? req.body.customerIds.toString():"";

    updated_at = new Date();
    data.updated_at = updated_at;
    data.id = id;
    data.lang = lang;
    var metaUpdate = ""
    console.log(EN_first_name);

  updateSql = "UPDATE `users` SET ";
  if(user_name !== ''){
    data.user_name = user_name;
    updateSql += "`user_name`=:user_name, ";
  }
  if(customerIds !== ''){
    data.customerIds = customerIds;
    updateSql += "`customerIds`=:customerIds, ";
  }
  if(price_per_hour !== ''){
    data.price_per_hour = price_per_hour;
    updateSql += "`price_per_hour`=:price_per_hour, ";
  }
  if(image !== ''){
    data.image = image;
    updateSql += "`image`=:image, ";
  }
  if(EN_first_name !== ''){
console.log("************************************")
    //data.EN_first_name = EN_first_name;
    meta_data.push({key:'EN_first_name',value:EN_first_name});
   // metaUpdate += "meta_value=:value";
    console.log(data);
  }
  if(EN_last_name !== ''){
    meta_data.push({key:'EN_last_name',value:EN_last_name});
    //metaUpdate += "meta_value=:value";
  }
  if(IN_first_name !== ''){
    meta_data.push({key:'IN_first_name',value:IN_first_name});
    //metaUpdate += "meta_value=:value";
  }
  if(IN_last_name !== ''){
    meta_data.push({key:'IN_last_name',value:IN_last_name});
    //metaUpdate += "meta_value=:value";
  }
  if(FR_first_name !== ''){
    meta_data.push({key:'FR_first_name',value:FR_first_name});
    //metaUpdate += "meta_value=:value";
  }
  if(FR_last_name !== ''){
    meta_data.push({key:'FR_last_name',value:FR_last_name});
    //metaUpdate += "meta_value=:value";
  }
  if(IT_first_name !== ''){
    meta_data.push({key:'IT_first_name',value:IT_first_name});
    //metaUpdate += "meta_value=:value";
  }
  if(IT_last_name !== ''){
    meta_data.push({key:'IT_last_name',value:IT_last_name});
    //metaUpdate += "meta_value=:value";
  }
   updateSql += "`updated_at`=:updated_at WHERE `id`=:id";
   console.log(data)
   dbConnection.query(updateSql,{replacements:data, type:dbConnection.QueryTypes.UPDATE})
   .then(result=>{
     console.log(meta_data)
    meta_data.forEach(element=>{
      element.id=id;
      console.log(element)
      selectSql = "SELECT * FROM `users_meta` WHERE user_id=:id && meta_key=:key";
      dbConnection.query(selectSql,{replacements:element, type :dbConnection.QueryTypes.SELECT}).then(user_data=>{
         if(user_data.length > 0){
          metaUpdate = "UPDATE `users_meta` SET `meta_value`=:value WHERE user_id=:id && meta_key=:key";
          console.log(metaUpdate)
          favPromises.push(dbConnection.query(metaUpdate, {replacements:element, type :dbConnection.QueryTypes.UPDATE})
            .then(success=>{
              console.log("success");
           }))
         }
      })

    })

    Promise.all(favPromises).then(result=>{
      response.status = constants.SuccessStatusCode;
      response.message = constants.ProfileUpdated;
      return res.status(response.status).json(response);
    }).catch(function(err){
      console.log(err);
      response.status = constants.ErrorStatusCode;
      response.message = constants.SomethingWentWrong;
      return res.status(response.status).json(response);
    })

   })



 }

 module.exports= AddUser;

