// Upload singal image using busboy with sharp.
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");
var fs = require("fs");
//const sharp = require("sharp");
var Busboy = require("busboy");

UploadImage = (req, res) => {
  var response = {};
  var busboy = new Busboy({ headers: req.headers });
  var saveTo = "";
  var newName = "";
  var folderLocation = "";

  // keep track of when file finishes and saved in the disk.
  var counter = 0;
  var exitCounter = 0;
  var finished = false;

  // keeping track of all files uploaded.
  var filenames = [];

  // I keep track of files with wrong mimetypes
  var invalidFileTypes = [];

  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    // validate against empty file fields.
    if (filename.length > 0) {
      // validate file mimetype
      if (mimetype != "image/png" && mimetype != "image/jpeg" && mimetype != "image/jpg" && mimetype != "image/gif") {
        // keeping track of invalid files, N/A 
        invalidFileTypes.push(filename);

        // Ignore the upload, move on to next one
        file.resume();
      } else {
        var todayDateTime = new Date();
        var todayDate = todayDateTime.getFullYear() + "" + (todayDateTime.getMonth() + 1) + "" + todayDateTime.getDate();
        var todayTime = todayDateTime.getHours() + "" + todayDateTime.getMinutes() + "" + todayDateTime.getSeconds() + "" + todayDateTime.getMilliseconds();

        // Get unique number.
        var uniqueNumber = Math.floor(100000 + Math.random() * 900000);

        // Just keeps track of file uploads (how many uploaded). 
        counter++;
        exitCounter++;

        // Extract file type from file name.
        var imageType = mimetype.split("/");

        switch(req.headers.type) {
          case "feed":
            newName = "FEED_IMG_" + parseInt(todayDate) + "_" + parseInt(todayTime) + "_" + counter + "." + imageType[1];
            folderLocation = constants.APP_PATH + "public/uploads/feeds/";
            saveTo = folderLocation + newName;
            break;
          case "social_product":
            newName = "SOCIAL_PRO_IMG_" + parseInt(todayDate) + "_" + parseInt(todayTime) + "_" + counter + "." + imageType[1];
            folderLocation = constants.APP_PATH + "public/uploads/social_products/";
            saveTo = folderLocation + newName;
            break;
          case "test":
            newName = "TESTING_IMG_" + parseInt(todayDate) + "_" + parseInt(todayTime) + "_" + uniqueNumber + "_" + counter + "." + imageType[1];
            folderLocation = constants.APP_PATH + "public/uploads/testing/";
            saveTo = folderLocation + newName;
            break;
          default:
            newName = "IMG_" + parseInt(todayDate) + "_" + parseInt(todayTime) + "_" + counter + "." + imageType[1];
            folderLocation = constants.APP_PATH + "public/uploads/";
            saveTo = folderLocation + newName;
        };

        // Just keeps track of names of files uploaded, for later resizing purpose.
        filenames.push(newName);

        // storing the uploaded photo
        fstream = fs.createWriteStream(saveTo);
        file.pipe(fstream);

        fstream.on("close", function() {
          filenames.forEach(function (element) {
            var getImage = folderLocation + element;
            const desPath = folderLocation + "thumbnail/" + element;
            const desPath2 = folderLocation + "700x400/" + element;

            /*fs.copyFile(getImage, folderLocation + "thumbnail/" + element, (err) => {
              if (err) throw err;
            });*/

            // sharp(getImage)
            // .resize(270, 230)
            // .toFile(desPath, (err, info) => {});

            // sharp(getImage)
            // .resize(700, 400)
            // .toFile(desPath2, (err, info) => {});

          });

          // file saved in disk, so decrement.
          // counter--;
          exitCounter--

          if (exitCounter === 0 && finished) {  // counter === 0 && 
            // delete temp images from folder.
            filenames.forEach(element => {
              const imagePath = folderLocation + element;
              fs.unlink(imagePath, function (err) {});
            });

            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.SuccessStatusCode;
            response.message = "Image has been uploaded successfully.";
            response.result = filenames;
            response.invalidFileTypes = invalidFileTypes;
            res.send(response);
          }
        });
      }
    } else {
      file.resume();

      res.statusCode = constants.SuccessStatusCode;
      response.status = constants.RecordNotFoundStatusCode;
      response.message = constants.RecordNotFound;
      response.result = [];
      res.send(response);
    }
  });

  busboy.on("finish", function (filenames) {
    console.info('Busboy uploading finished!');
    finished = true;
  });

  return req.pipe(busboy);
}
module.exports = UploadImage;