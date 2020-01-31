var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');


var Page = function(req,res){
    var type=req.query.type ? req.query.type:"";    
    var response={};
if(type==""){
    response.message = "Type is required.";
    response.status = constants.ValidationStatusCode;
    return res.status(constants.ValidationStatusCode).json(response);
}
else{
    var page_sql="SELECT  id, title, content, type, created_at FROM pages WHERE type='"+ type+"'";
  // console.log(page_sql);
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
       // logger.log("error", "Check Page Content query failed. (Failed)", error);
    });   
}
}
 module.exports = Page;
