var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');

var AboutApp = (req, res) => {
	
   	var response = {};
  	var page_sql = "SELECT id, website, email, phone_number, address, latitude, longitude, created_at FROM about_apps";
  	dbConnection.query(page_sql,{
  		type: dbConnection.QueryTypes.SELECT
  	}).then((result) => {
  		if(result.length > 0){
  			response.status = constants.SuccessStatusCode;
  			response.result = result[0];
			  return res.status(constants.SuccessStatusCode).json(response);
  		} else {
  			response.status = constants.RecordNotFoundStatusCode;
  			response.message = constants.SomethingWentWrong;
  			return res.status(constants.RecordNotFoundStatusCode).json(response);
  		}
  	}).catch((error) => {
  		console.log("----------------  Page Content query failed  --------------");
		logger.log("error", "Check Page Content query failed. (Failed)", error);
  	});
   
}
module.exports = AboutApp;
