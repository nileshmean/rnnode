var constants = require('./../../config/constants');
var dbConnection = require('./../../config/connection');
var _ = require('lodash');
var moment = require('moment-timezone');
inspect = require('util').inspect;
fs = require('fs');
var Busboy = require('busboy')
var response = {};

NMultipleImage = (req, res) => {

  if (req.method === 'POST') {
     console.log(req.body);
    var busboy = new Busboy({ headers: req.headers });
          console.log('File here 1 ');
          var filenames = [];

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File here 2 ');

      var mimeType = filename.split('.');
      var d = new Date();
      var todayTime = new Date().getTime()
      var rand = Math.floor(100000 + Math.random() * 900000);



      newFileName = 'IMG_'+ rand + "_" +todayTime + '.' + mimeType[1];
      filenames.push(newFileName);
    var saveTo = constants.APP_PATH +'public/' + newFileName;
    console.log("image saveTo",saveTo);

    file.pipe(fs.createWriteStream(saveTo));


    file.on('data', function(data) {
      console.log("image save",data);
      return data;

      });
      file.on('end', function() {
      });
    });


    
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    });

    busboy.on('finish', function() {

      var data = {
        id:1,
        image:JSON.stringify(filenames),
       
    }

      var sql = "UPDATE post SET AdImage=:image WHERE AdId = 1";
      

      dbConnection.query(sql, {replacements:data, type:dbConnection.QueryTypes.INSERT}).then(function(result){
        response.status = constants.SuccessStatusCode;
        response.message = constants.PostAddeddSuccessfully;

        return res.json({"statusCode": "200",
        "msg": "success",
      "result" : filenames })

      //  return res.status(response.status).json(response)
    }).catch(function(err){
        console.log(err)
       response.message = constants.SomethingWentWrong;
       response.status = constants.ErrorStatusCode;
       return res.status(response.status).json(response)
    })


    });
    req.pipe(busboy);
    
  }

} 
  module.exports = NMultipleImage;



  ///





// async function getValueAsync(req, res) {

//  //return 'foo';
//    console.log('node working:');

//    /**
//     * 
//     * 
//     * **/

//    if (req.method === 'POST') {
     
//     var busboy = new Busboy({ headers: req.headers });
//           console.log('File ');
//           var filenames = [];

//     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//      // console.log('File =',mimetype);
//       var mimeType = filename.split('.');
//       var d = new Date();
//      var todayTime = new Date().getTime()
// var rand =     Math.floor(100000 + Math.random() * 900000);

// //console.log(rand);
//     //  todayTime = d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();

//       newFileName = 'IMG_'+ rand + "_" +todayTime + '.' + mimeType[1];
//       filenames.push(newFileName);
//     var saveTo = '/var/react/vision/img/' + newFileName;

//     file.pipe(fs.createWriteStream(saveTo));
//     //console.log('File s',saveTo);

//     //getValueimage(saveTo,res);

//     file.on('data', function(data) {
//       console.log("image save",data);
//       return data;

//       });
//       file.on('end', function() {
//       });
//     });


    
//     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
//     });

//     busboy.on('finish', function() {
//    //   res.writeHead(303, { Connection: 'close', Location: '/' });
//      // res.end();
//     // console.log('saveTosaveTo',saveTo);
//      return res.json({"statusCode": "200",
//       "msg": "success",
//     "restult" : filenames })
//     });
//     req.pipe(busboy);
    
//   }

   

// }


//  app.post ('/test', function (req,res) {
// console.log("i am here...........")
//   getValueAsync(req, res);
// console.log("ress",res.json);

// });