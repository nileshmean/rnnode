var constants = require('../../config/constants');
var dbConnection = require('../../config/connection');
var _ = require('lodash');
var moment = require('moment-timezone');
var Busboy = require('busboy');
var fs = require('fs');

var im = require('imagemagick');


upload = function(req, res) {
  var d = new Date();
  todayDt = parseInt(d.getFullYear() + "" + (d.getMonth() + 1) + "" + d.getDate());
  todayTime = d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
  var busboy = new Busboy({
    headers: req.headers
  });

  // keeping track of all files uploaded.
  var filenames = [];
  var folderLocation = "";
  
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
   
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    file.on('data', function(data) {
      console.log(data);
    });

    file.on('end', function() {
    });
      
    console.log("type========== ",req.headers.type);

    var mimeType = filename.split('.');
    type = 1;
    newFileName = 'IMG_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];

    if (req.headers.type == 'provider') {
      newFileName = 'provider_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/provider/'+newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/provider/";
    } else if (req.headers.type == 'aesthetician') {
      newFileName = 'aesthetician_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/aesthetician/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/aesthetician/";
     // console.log("save To == ", saveTo);

    } else if (req.headers.type == "news") {
      newFileName = 'news_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/news/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/news/";
    } 
    else if (req.headers.type == "feeds") {
      newFileName = 'feeds_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/feeds/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/feeds/";
    }else if (req.headers.type == "event") {
      newFileName = 'event_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/event/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/event/";
    } else if (req.headers.type == "admin") {
      newFileName = 'admin_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/admin/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/admin/";
    }
    else if (req.headers.type == "social") {
      newFileName = 'social_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/social_products/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/social_products/";
    }else if (req.headers.type == "slider") {
      newFileName = 'slider_' + parseInt(todayDt) + '_' + parseInt(todayTime) + '.' + mimeType[1];
      saveTo = constants.IMAGE_PATH+'/public/uploads/slider/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/slider/";
    }
    else {
      saveTo = constants.IMAGE_PATH+'public/uploads/' + newFileName;
      folderLocation = constants.IMAGE_PATH + "public/uploads/";
    }

    // Just keeps track of names of files uploaded, for later resizing purpose.
    filenames.push(newFileName);
    fstream = fs.createWriteStream(saveTo);
    file.pipe(fstream);

    fstream.on("close", function() {
      filenames.forEach(function (element) {
        var getImage = saveTo;

        fs.copyFile(getImage, folderLocation + "thumbnail/" + element, (err) => {
          if (err) throw err;
        });

        /*if (req.headers.type == "feeds") {
          im.convert(
            [getImage, "-resize", "700x400\!", saveTo ],
            function (err, stdout) {
              // if (err) throw err;
              // Ignore the upload, move on to next one
              file.resume();
            }
          );
        }*/

        /*im.convert(
          [
            getImage,
            "-resize",
            "270x230\!",
            folderLocation + "thumbnail/" + element
          ],
          function (err, stdout) {
            // if (err) throw err;

            // Ignore the upload, move on to next one
            file.resume();
          }
        );*/
      });
    });
  });
  
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {

  });

  busboy.on('finish', function() {
    /**
     * convert function args array : ['source image', '-resize', '25x120', 'destination image']
     * If you want you can force "-resize" to ignore the aspect ratio and distort the image so it always generates an image exactly the size specified. This is done by adding the character '!' to the size.
     */
    if (newFileName != '') {
      result = {};
      result.image = newFileName;
      res.json({
        'status': constants.SuccessStatusCode,
        'message': "Image has been uploaded successfully",
        'result': result
      });
    } else {
      res.status(constants.RecordNotFoundStatusCode).json({
        'status': constants.RecordNotFoundStatusCode,
        'message': "Image has been not uploaded successfully", 
      });
    }
  });
req.pipe(busboy);
};
module.exports = upload;