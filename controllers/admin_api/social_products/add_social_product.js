// Add social products list.
var constants = require('./../../../config/constants');
var dbConnection = require('./../../../config/connection');

AddSocialProduct = (req, res) => {
	var response = {};
	var imageName = req.body.imageName ? req.body.imageName : "";
	var queryStr = "INSERT INTO social_products(image) VALUES ";
	imageName.forEach(element => {
		queryStr += "('"+ element +"'),";
	});
	var query = queryStr.substring(0, queryStr.length - 1);
	dbConnection.query(query, { type: dbConnection.QueryTypes.INSERT })
	.then(result => {
		res.statusCode = constants.SuccessStatusCode;
		response.status = constants.SuccessStatusCode;
		response.message = constants.SOCIAL_PRODUCT_ADD_SUCCESS;
		res.send(response);
	})
	.catch(err => {
		console.error("Error into add_social_product.js: ", err);
		res.statusCode = constants.ErrorStatusCode;
		response.message = constants.SomethingWentWrong;
		res.send(response);
	});
}
module.exports = AddSocialProduct;