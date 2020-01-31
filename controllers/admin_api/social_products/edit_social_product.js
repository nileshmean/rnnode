// Edit social products list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

EditSocialProduct = (req, res) => {
	var response = {};
	var id = req.body.id ? req.body.id : "";
	var imageName = req.body.imageName ? req.body.imageName : "";

	if (id == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.ID_VALIDATION;
		res.send(response);
	}

	if (imageName == "") {
		res.statusCode = constants.ValidationStatusCode;
		response.status = constants.ValidationStatusCode;
		response.message = constants.IMAGE_VALIDATION;
		res.send(response);
	}

	var data = { id: id, image: imageName };
	var query = "UPDATE social_products SET image=:image WHERE id=:id";
	dbConnection.query(query, { replacements: data, type: dbConnection.QueryTypes.UPDATE })
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = constants.SOCIAL_PRODUCT_EDIT_SUCCESS;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into edit_social_product.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = EditSocialProduct;