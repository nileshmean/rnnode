// Edit app details.
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

EditAppDetail = (req, res) => {
    var response = {};
    var id = req.body.id ? req.body.id : "";
    var website = req.body.website ? req.body.website : "";
    var email = req.body.email ? req.body.email : "";
    var phone_number = req.body.phone_number ? req.body.phone_number : "";
    var address = req.body.address ? req.body.address : "";
    var latitude = req.body.latitude ? req.body.latitude : 0.0;
    var longitude = req.body.longitude ? req.body.longitude : 0.0;

    if (id == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.ID_VALIDATION;
        res.send(response);
    } else if (website == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.WEBSITE_VALIDATION;
        res.send(response);
    } else if (email == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.EmailValidation;
        res.send(response);
    } else if (phone_number == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.PhoneValidation;
        res.send(response);
    } else if (address == "") {
        res.statusCode = constants.ValidationStatusCode;
        response.status = constants.ValidationStatusCode;
        response.message = constants.AddressValidation;
        res.send(response);
    }

    var data = { id: id, website: website, email: email, phone_number: phone_number, address: address, latitude: latitude, longitude: longitude };
    var query = "UPDATE about_apps SET website=:website, email=:email, phone_number=:phone_number, address=:address, latitude=:latitude, longitude=:longitude WHERE id=:id";

    dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
    .then(result => {
        res.statusCode = constants.SuccessStatusCode;
        response.status = constants.SuccessStatusCode;
        response.message = constants.APPINFO;
        res.send(response);
    })
    .catch(err => {
        console.error("Error in edit_app_details.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = EditAppDetail;