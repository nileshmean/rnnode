/**
 * routes file for calling API for web, admn  and app
 */
const express = require("express");
const router = express.Router();
var tokenMiddleWare = require('../middleware/tokenMiddleware');
var permissionMiddleware = require('./../middleware/permissionMiddleware');

/**
 * *************************** Web / App Routes *********************************
 */

var BaseUrl = require("../controllers/api/base_url");
router.get("/baseurl",BaseUrl);


var AddFullPost = require("../controllers/api/add_full_post");
router.post("/add-full-post",AddFullPost);



var postList = require("../controllers/api/postList");
router.get("/post-list",postList);

var Login = require('../controllers/api/login')
router.post('/login', Login)

var Register = require('../controllers/api/register')
router.post('/register', Register)

var NMultipleImage = require('../controllers/api/NMultipleImage')
router.post('/n-multiple-image', NMultipleImage)

/**
 * Importnat
 * **/


// var MyPostList = require('../controllers/api/my_postlist')
// router.get('/my-post-list', tokenMiddleWare, MyPostList);
// // Home Post List
// var HomePostList = require('../controllers/api/home_postlist')
// router.get('/home-post-list', HomePostList);

// // Home Post List
// var SlidePostList = require('../controllers/api/slide_postlist')
// router.get('/slide-post-list', SlidePostList);

// var PostDetail = require('../controllers/api/post_detail')
// router.get('/post-detail', PostDetail);

// var RecommededPostList = require('../controllers/api/recommeded_postlist')
// router.get('/recommeded-post-list', RecommededPostList);


/**
 * Importnat End
 * **/


module.exports = router;