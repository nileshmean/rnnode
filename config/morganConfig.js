const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

// === *** START For logging the request to create apache like log. *** === //
// create log directroy
const logDirectory = path.join(__dirname, "./../log");
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

function generator(time) {
    function pad(num) {
        return (num > 9 ? "" : "0") + num;
    }

    if (!time) return "file.log";

    const month = `${time.getFullYear()}${pad(time.getMonth() + 1)}`;
    const day = pad(time.getDate());
    const hour = pad(time.getHours());
    const minute = pad(time.getMinutes());

    return `${month}/${month}${day}-${process.env.APP_NAME}-access.log`;
}

const date = new Date();

// create a rotating write stream
const accessLogStream = rfs(generator(date), {
    // size:     '10M',
    interval: "1d", // rotate daily
    path: logDirectory
});

module.exports = accessLogStream;
