const nodemailer = require("nodemailer");
const constants = require("./constants");
const fs = require("fs");
const uuidv4 = require("uuid/v4");
require("dotenv").config();

module.exports = function() {
    const email = {
        // Send email
        send_email(email_information, callback) {
            let mail_type = "";
            let title = "";
            let content = "";
            let user_name = "";
            let subject = "";
            const logo_url = constants.BASEURL + "config/email/logo.png";
            const envelop_url = constants.BASEURL + "config/email/mail.png";
            const base_url = constants.BASEURL;
            const verification_code = email_information.verification_code;
            const author = "Zip";

            if (email_information.type == "verification") {
                mail_type = "verification";
                title = "Verification";
                user_name = email_information.user_name;
                content = "Here is your login verification code : <b>" + email_information.verification_code + "</b>";
                subject = "Zip Verification";
            } else if (email_information.type == "forgot_password") {
                mail_type = "forgotPassword";
                title = "Forgot Password";
                user_name = email_information.user_name;
                content = "Here is your verification code : <b>" + email_information.verification_code + "</b>";
                subject = "Zip Forgot Password";
            }
            fs.readFile(constants.ROOT_PATH + "config/email/" + mail_type + ".html", "utf8", (err, html) => {
                console.log(title);
                html = html.replace("{title}", title);
                html = html.replace("{USER_NAME}", user_name);
                html = html.replace("{content}", content);
                html = html.replace("{base_url}", base_url);
                html = html.replace("{logo_url}", logo_url);
                html = html.replace("{verification_code}", verification_code);
                html = html.replace("{envelop_url}", envelop_url);
                html = html.replace("{author}", author);

                let transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.MAIL_USERNAME, // generated ethereal user
                        pass: process.env.MAIL_PASSWORD // generated ethereal password
                    }
                });
                let mailOptions = {
                    from: "" + process.env.MAIL_FROM_NAME + " <" + process.env.MAIL_FROM_EMAIL + ">", // sender address
                    to: email_information.email, // list of receivers
                    subject: subject, // Subject line
                    html: html // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log("Message sent: %s", info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    res.json(mailOptions);
                });
            });
        }
    };
    return email;
};
