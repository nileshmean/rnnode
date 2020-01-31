var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

AddPostImage = (req, res) => {
   // console.log(req);
    var response = {};
    var postid = req.body.postid ? req.body.postid : '';
    var image = req.body.image ? req.body.image : '';
    var user_id =  res.locals.userData.id;
     
     if (postid == '') {
        response.status = constants.ValidationStatusCode;
        response.message = "postid is required.";
        return res.status(response.status).json(response);
    }else if(image == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Image is required.";
        return res.status(response.status).json(response);
    }
   
    var data = {
        id:id,
        image:image,
       
    }
    existsSql = "SELECT * FROM `feeds` WHERE id='"+postid+"'";
    dbConnection.query(existsSql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        console.log(result)
        console.log('========================================================')
        if(result.length <= 0){
            response.status = constants.ValidationStatusCode;
            response.message = "This id is not exists.";
            return res.status(response.status).json(response)
        }else{
                var sql = "UPDATE feeds SET image=:image WHERE id = :postid";
console.log(sql);
            dbConnection.query(sql, {replacements:data, type:dbConnection.QueryTypes.INSERT}).then(function(result){
                response.status = constants.SuccessStatusCode;
                response.message = constants.PostAddeddSuccessfully;
                return res.status(response.status).json(response)
            }).catch(function(err){
                console.log(err)
               response.message = constants.SomethingWentWrong;
               response.status = constants.ErrorStatusCode;
               return res.status(response.status).json(response)
            })
        }
    })

    // sql = "SELECT * FROM `feeds` WHERE slug=:slug"
    // if(sql){
    
    // console.log("slug is already exit");
    // } else{
    //     console.log("slug is not exit");
    // }
    
}

module.exports = AddPostImage;