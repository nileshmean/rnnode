// get partners data  .
var constants = require("./../../../config/constants");
var dbConnection = require("./../../../config/connection");

Partners = (req, res) => {
    var promises = [];
    var response = {};
        
    var query ="SELECT partners.*, (SELECT COUNT(*) FROM `partners_mail` WHERE partners_mail.partner_id = partners.id) AS counts FROM partners where partners.deleted_at is Null";
    dbConnection.query(query, {type: dbConnection.QueryTypes.SELECT })
    .then(result => {
        response.result = result
        for(var i =0;i<result.length; i++){
            (function(i){

                sql = "SELECT partners_name,name, email, phone FROM partners_mail WHERE partner_id = "+result[i].id;
                promises.push(dbConnection.query(sql, {type:dbConnection.QueryTypes.SELECT}).then(record =>{
                    response.result[i].providers = record;
                }));
            })(i)
        }
        // result.forEach(element => {
           
        // });

        Promise.all(promises).then(result => {
            res.statusCode = constants.SuccessStatusCode;
            response.status = constants.SuccessStatusCode;
           // response.result = result;
            res.send(response);
        }).catch(err => {
            console.error("Error into add_question.js: ", err);
            res.statusCode = constants.ErrorStatusCode;
            response.message = constants.SomethingWentWrong;
            res.send(response);
        });
        
    })
    .catch(err => {
        console.error("Error into add_question.js: ", err);
        res.statusCode = constants.ErrorStatusCode;
        response.message = constants.SomethingWentWrong;
        res.send(response);
    });
}
module.exports = Partners;