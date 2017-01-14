//Wang Jian
//CSE270E
//2017 Jan 14
//Assignment 10
var express = require('express'),
    router = express.Router(),
    home = require('../controllers/home'),
    image = require('../controllers/image');
    student = require('../controllers/student');
module.exports = function(app) {
    router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.get('/student', student.get);
    router.get('/about', home.about);
    router.get('/login', home.login);
    router.get('/timer', home.timer);
    router.post('/login', home.loginsubmit);
    router.post('/student', student.post);
    router.post('/images', image.create);
    router.post('/images/:image_id/like', image.like);
    router.post('/images/:image_id/comment', image.comment);
    app.use(router);
};
