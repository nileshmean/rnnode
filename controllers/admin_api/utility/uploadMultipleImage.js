var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');
var _ = require('lodash');
var moment = require('moment-timezone');
var Busboy = require('busboy');
var fs = require('fs');
var im = require('imagemagick');

UploadMultipleImage = (req, res) => {
	var response = {};
	// var todayDateTime = new Date();
	// var todayDate = todayDateTime.getFullYear() + "" + (todayDateTime.getMonth() + 1) + "" + todayDateTime.getDate();
	// var todayTime = todayDateTime.getHours() + "" + todayDateTime.getMinutes() + "" + todayDateTime.getSeconds();
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

						/*fs.copyFile(getImage, folderLocation + "thumbnail/" + element, (err) => {
							if (err) throw err;
						});*/

						im.convert(
							[getImage, "-resize", "270x230", folderLocation + "thumbnail/" + element],
							function (err, stdout) {
								// if (err) throw err;
								// Ignore the upload, move on to next one
								file.resume();
							}
						);

						if (req.headers.type == "social_product") {
							im.convert(
								[ getImage, "-resize", "800x800", folderLocation + element ],
								function (err, stdout) {
									// if (err) throw err;
									// Ignore the upload, move on to next one
									file.resume();
								}
							);
						} else {
							im.convert(
								[ getImage, "-resize", "700x400", folderLocation + element ],
								function (err, stdout) {
									// if (err) throw err;
									// Ignore the upload, move on to next one
									file.resume();
								}
							);
						}
					});

					// file saved in disk, so decrement.
					// counter--;
					exitCounter--

					if (exitCounter === 0 && finished) {	// counter === 0 && 
						res.statusCode = constants.SuccessStatusCode;
						response.status = constants.SuccessStatusCode;
						response.message = "Upload Multiple Images.";
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
module.exports = UploadMultipleImage;