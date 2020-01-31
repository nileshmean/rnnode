const express = require("express");
const server = require("http");
const app = express();
const parser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const morganConfig = require("./config/morganConfig");
const constants = require("./config/constants");
const logger = require("./config/winstonConfig");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");
const port = process.env.NODE_PORT;
const host = process.env.NODE_HOST;

// comporession to gzip
app.use(compression());

// Set '' to config path to avoid middleware serving the html page (path must be a string not equal to the wanted route)
const statusMonitor = require("express-status-monitor")({
    
    title: process.env.APP_NAME, // Default title
    path: "/status",
    spans: [
        {
            interval: 1, // Every second
            retention: 60 // Keep 60 datapoints in memory
        },
        {
            interval: 5, // Every 5 seconds
            retention: 60
        },
        {
            interval: 15, // Every 15 seconds
            retention: 60
        }
    ],
    chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        responseTime: true,
        rps: true,
        statusCodes: true
    }
});
app.use(statusMonitor.middleware); // use the "middleware only" property to manage websockets
app.get("/status", statusMonitor.pageRoute); // use the pageRoute property to serve the dashboard html page

// === *** START For logging the request to create apache like log. *** === //
// setup the logger
app.use(
    morgan("combined", {
        stream: morganConfig
    })
);
// === *** END For logging the request to create apache like log. *** === //

// === *** START Rate Limiter. *** === //

app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

// // configure rate limiter
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1000, // limit each IP to 100 requests per windowMs
    message: {
        succsss: 0,
        message: "Too many request."
    }
});

// // add limiter to express app
app.use("/", apiLimiter);

// === *** END Rate Limiter. *** === //

// === *** END For Cross origin request. *** === //
// add cors to express app
app.use(cors());
// configuration for CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
// === *** END For Cross origin request. *** === //



// json parser to send response in json format
app.use(parser.json({ type: "application/json" }));

// setup for url encode
app.use(
    parser.urlencoded({
        extended: true,
        limit: "50mb"
    })
);

// add route file
app.use(require("./routes/apiRoutes"));
//app.use(require("./routes/adminRoutes"));

// default path if no route found on server
app.use((req, res, next) => {
    // respond with json with set status code 404.
    logger.log("error", "Invalid route Called.");

    res.status(404);
    if (req.accepts("json")) {
        res.json({ error: "Invalid page. Please go back and request Again." });
        return;
    }
});

// used in development for checking port id
app.listen(7800, () => {
    console.log(`Your server running at 7800`);
});

// export module router so that it can be called on other modules.
// For Test Cases
module.exports = app;
