var dbConnection = require('../../config/connection');
var constants = require('../../config/constants');
var moment = require('moment-timezone');

Daahboard = (req, res)=>{

    var response = {};
    var promises = [];
    var dateTime = moment().utc().format("YYYY-MM-DD HH:mm:ss");
 
        feed_sql = "SELECT count(id) as total_feeds FROM `feeds` WHERE deleted_at is null";
        promises.push(
            dbConnection.query(feed_sql, {type:dbConnection.QueryTypes.SELECT}).then(count=>{
                response.feed_count = {total: count[0].total_feeds}
            })
        )


        news_sql = "SELECT category, COUNT(id) AS count FROM `news` WHERE deleted_at is null GROUP BY category";
        promises.push(
            dbConnection.query(news_sql, {type:dbConnection.QueryTypes.SELECT}).then(count=>{
                var total = 0;
                var i = 0;
                let news = {company :0, online: 0, print:0, total:0}
                count.forEach(element => {
                    if(element.category == 1){
                       
                        news.company = element.count;   
                    }
                    if(element.category == 2){
                        news.online = element.count;
                    }
                    if(element.category == 3){
                        news.print = element.count;
                    }
                    total += element.count
                });
                news.total = total;
                count.push({category: 'total',count:total});
                response.news_count = news;

            })
        )
        event_sql = "SELECT COUNT(id) AS count, (CASE WHEN ends_date > '"+dateTime+"' THEN 'upcoming' ELSE 'completed' END) as type from event WHERE deleted_at IS null GROUP BY type";
        promises.push(
            dbConnection.query(event_sql, {type:dbConnection.QueryTypes.SELECT}).then(count=>{
                var total = 0;
               
                let events = {completed: 0, total:0, upcoming: 0};
                console.log(count)
                count.forEach(element => {
                    if(element.type == 'completed'){
                       
                        events.completed = element.count;   
                    }
                    if(element.type == 'upcoming'){
                        events.upcoming = element.count;
                    }
                    total += element.count
                });
                //console.log(events)
               // setTimeout(() => {
                    events.total = total
                    response.event_count = events;
                //}, 500)
               
            })
        )
       Promise.all(promises).then(result => {
        //response.result = response;
        var respons = {result: response, status:constants.SuccessStatusCode}
        //response.status = constants.SuccessStatusCode;
        console.log(respons)
        return res.status(respons.status).json(respons)
       })
        .catch(function(err){
                console.log(err)
                response.message = constants.SomethingWentWrong;
                response.status = constants.ErrorStatusCode;
                return res.status(response.status).json(response)
            })
}

module.exports = Daahboard;