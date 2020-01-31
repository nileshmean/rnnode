var FCM = require('fcm-push');
module.exports = function() {
    var notification = {
        // add bank account
        send_notification: function(notification_info, callback) {
            var serverKey = process.env.PUSH_AUTH_KEY;
            console.log(serverKey)
            var fcm = new FCM(serverKey);
            var message = {};
            notification = {
                title: notification_info.title,
                type: notification_info.type,
                job_id: notification_info.job_id,
                sound: 'default',
                message: notification_info.message,
                body: notification_info.message,
            }
            if (notification_info.device_type == 'Android') {
                message.data = notification;
            } else {
                message.notification = notification;
            }
            if (notification_info.notification_key != '') {
                
                message.to = notification_info.notification_key;
                message.collapse_key = 'your_collapse_key';

                fcm.send(message).then(function(response) {
                    console.log("Successfully sent with response: ", response);
                    console.log(JSON.stringify(notification_info))
                    callback(response);
                }).catch(function(err) {
                    callback(err.message);
                    console.log("Something has gone wrong!");
                    console.log(err)
                    console.error(err.message);
                })
            } else {
                callback(true);
            }
        },
    }
    return notification;
}