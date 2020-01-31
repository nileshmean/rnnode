dbConnection = require('../../config/connection');
var constants = require('../../config/constants');




List = (req, res)=>{
    var response = {};
    var limit = req.query.limit ? req.query.limit : 30;
    var offset = req.query.offset ? req.query.offset : 0;



    sql = "SELECT feeds.id, title, description, slug, user_id, feeds.image as feed_image,category,feeds.updated_at,users.first_name, users.last_name, email, users.image as user_image, (SELECT count(*) FROM feeds_comment where feed_id = feeds.id) as total_comment FROM `feeds` JOIN `users` ON users.id = feeds.user_id WHERE feeds.status = 'active' && feeds.deleted_at IS NULL AND user_id = "+user_id+" ORDER BY `feeds`.`id` DESC LIMIT "+ offset + "," + limit;
}


module.exports = List;