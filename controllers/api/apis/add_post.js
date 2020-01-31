var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

AddPost = (req, res) => {
    var response = {};

    console.log(req.body);

    var title = req.body.title ? req.body.title : '';
   // var services = req.body.services ? req.body.services : '';``
    var description = req.body.description ? req.body.description : '';
    var image = req.body.image ? req.body.image : '';
    var category = req.body.category ? req.body.category : '1';
    var subCategory = req.body.subCategory ? req.body.subCategory : '1';
    var user_id =   1;
    var status = 'active';
    var slug  = req.body.title ? req.body.title.replace(/\s+/g, '-') : '';
     if (title == '') {
        response.status = constants.ValidationStatusCode;
        response.message = "Titlessssssss is required.";
        return res.status(response.status).json(response);
    }else if(description == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Description is required.";
        return res.status(response.status).json(response);
    }
    else if(category == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Category is required.";
        return res.status(response.status).json(response);
    }
    else if(subCategory == ''){
        response.status = constants.ValidationStatusCode;
        response.message = "Sub Category is required.";
        return res.status(response.status).json(response);
    }
    var data = {
        title:title,
        description:description,
       // services:services,
        image:image,
        user_id:user_id,
        category:category,
        subCategory:subCategory,
        status:status,
        slug: slug
    }

   // services = JSON.stringify(services);
   // console.log("services --- ",services[0]);

    existsSql = "SELECT * FROM `post` WHERE AdTitle='"+title+"'";
    dbConnection.query(existsSql, {type:dbConnection.QueryTypes.SELECT}).then(function(result){
        console.log('========================================================')
        if(result.length > 0){
            response.status = constants.ValidationStatusCode;
            response.message = "This title is already exists, Change title and post again.";
            return res.status(response.status).json(response)
        }else{
            sql = "INSERT INTO `post` SET AdTitle=:title, AdDescription=:description, CreatedBy=:user_id, AdCategoryId=:category, AdSubCategoryId=:subCategory, AdStatus=:status ,AdSlug=:slug";
            
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

module.exports = AddPost;