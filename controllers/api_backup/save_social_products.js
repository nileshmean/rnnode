var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var watermark = require('dynamic-watermark');

save_social_products = (req, res) => {

    var response = {};
    
    //web site
    console.log(req.body)
    var logoX = req.body.logoX ? req.body.logoX : '';
    var logoY = req.body.logoY ? req.body.logoY : '';
    var logoHeight = req.body.logoHeight ? req.body.logoHeight : '';
    var logoWidth = req.body.logoWidth ? req.body.logoWidth : '';
    
    var text = req.body.text ? req.body.text : '';
    var textX = req.body.textX ? req.body.textX : '';
    var textY = req.body.textY ? req.body.textY : '';
    var textHeight = req.body.textHeight ? req.body.textHeight : '';
    var textWidth = req.body.textWidth ? req.body.textWidth : '';

    var fontSize = req.body.fontSize ? req.body.fontSize : '';
    var color = req.body.color ? req.body.color : '';

    var source = req.body.source ? req.body.source : '';
    var logo = req.body.logo ? req.body.logo : '';

   //app
    var type = req.body.type ? req.body.type : 'web';
    var social_product_image = req.body.social_product_image ? req.body.social_product_image : '';
    var social_product_id = req.body.social_product_id ? req.body.social_product_id : '';
    var user_id = res.locals.userData.id;
    
    if(type =='app')
    {

            sql = "INSERT INTO `saved_social_products` SET user_id ="+user_id+", social_product_id="+social_product_id+", image='"+social_product_image+"' ";
                    dbConnection.query(sql, {
                        type:dbConnection.QueryTypes.INSERT
                        }).then(function(result){

                        var rslt = {'image':social_product_image, 'status':1};
                        
                        response.status = constants.SuccessStatusCode;
                        response.message = "Saved successfully.";
                        response.result = rslt;
                        return res.status(response.status).json(response)

                    }).catch(function(err){
                        console.log(err)
                       response.message = constants.SomethingWentWrong;
                       response.status = constants.ErrorStatusCode;
                       return res.status(response.status).json(response)
                    })


    }else{ //for web

    var d = new Date();
    todayDt = parseInt(d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate());
    todayTime = d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
    var destination = 'IMG_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.jpeg';

     var optionsImageWatermark = {
        type: "image",
        source: constants.BASEURL+'/public/uploads/social_products/' +source,//"a.png",
        logo: constants.BASEURL+'/public/uploads/provider/' +logo,//"logo.png", // This is optional if you have provided text Watermark
        destination: constants.IMAGE_PATH+'/public/uploads/social_products/' +destination, //"output.png",
        position: {
            logoX : logoX, //200,
            logoY : logoY, //200,
            logoHeight: logoHeight, //200,
            logoWidth: logoWidth, //200
            }
        };

        var optionsTextWatermark = {
            type: "text",
            text: text, // This is optional if you have provided text Watermark
            source: constants.BASEURL+'/public/uploads/social_products/' +destination,//"a.png",
            destination: constants.IMAGE_PATH+'/public/uploads/social_products/' +destination, //"output.png",
            position: {
                logoX : textX,
                logoY : textY,
                logoHeight: textHeight,
                logoWidth: textWidth
            },
            textOption: {
                fontSize: fontSize, //In px default : 20
                color: color, // '#AAF122' // Text color in hex default: #000000
            }
        };

        watermark.embed(optionsImageWatermark, function(status) {
            //Do what you want to do here
             console.log(status);

             watermark.embed(optionsTextWatermark, function(status) {
            //Do what you want to do here
             console.log(status);

                sql = "INSERT INTO `saved_social_products` SET user_id ="+user_id+", social_product_id="+social_product_id+", image='"+destination+"' ";
                    dbConnection.query(sql, {
                        type:dbConnection.QueryTypes.INSERT
                        }).then(function(result){

                        var rslt = {'image':destination, 'status':status};
                        
                        response.status = constants.SuccessStatusCode;
                        response.message = "Saved successfully.";
                        response.result = rslt;
                        return res.status(response.status).json(response)

                    }).catch(function(err){
                        console.log(err)
                       response.message = constants.SomethingWentWrong;
                       response.status = constants.ErrorStatusCode;
                       return res.status(response.status).json(response)
                    })


           });

        });
    }

}

module.exports = save_social_products;