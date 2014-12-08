var express = require('express');
var router  = express.Router();
var db   = require('../models/db');


/* View all users in a <table> */
router.get('/all', function (req, res) {
    db.GetAll(function (err, result) {
            if (err) throw err;
            res.render('displayUserTable.ejs', {rs: result});
        }
    );
});

router.get('/posts', function (req, res){
    db.GetPosts(function (err, result) {
            if(err) throw err;
            res.render('displayUserPosts.ejs', {rs: result});
        }
    );
});

router.post('/post', function(req,res){
    db.InsertPost(req.body, function(err, result){
        if(err) throw(err);
        res.render('index.ejs');

    });
});

/* Create a User */

// Create User Form
router.get('/create', function(req, res){
    db.GetAll(function (err, result) {
            if (err) throw err;
            res.render('simpleform.ejs', {rs: result});
        }
    );
});

// Save User to the Database
router.post('/create', function (req, res) {
    db.Insert( req.body, function (err, result) {
            if (err) throw err;

            if(result.AccountID != 'undefined') {
                var placeHolderValues = {
                    email: req.body.email,
                    password: req.body.password,
                    posts: req.body.posts
                };
                res.render('displayUserInfo.ejs', placeHolderValues);
            }
            else {
                res.send('User was not inserted.');
            }
        }
    );
});
//Doesnt do anything currently.
router.post('/twitter', function (req, res) {
    db.Insert( req.body, function (err, result) {
        if(err) throw err;

        if(result.AccontID != 'undefined'){
            var placeHolderValues = {
                username: req.body.username,
                posts: req.body.posts
            };
            res.render('displayUserPosts.ejs', placeHolderValues);
        }
        else {
            res.send('User was not inserted.');
        }
    });
});

/* View a single user's information */
/* INCOMPLETE */
router.get('/', function (req, res) {
    console.log(req.query.AccountID);
    db.GetDetails(req.query.AccountID, function (err, result) {
            if (err) throw err;
            res.render('displayUserDetailed.ejs', {rs: result});
        }
    );
});

router.get('/dropdown', function (req, res) {
    console.log("Entered controller");
    db.Drop(function (err, result) {
        if(err) throw err;
        res.render('displayUserDropDown.ejs', {rs: result});
    });
});

router.post('/view', function(req, res) {
    db.createPostView(req.body.AccountID, function(err,result){
        if (err) throw err;
    });
    db.createLab18View(req.body.AccountID, function(err, result){
        if(err) throw err;
    });
    db.GetSpecificPost(req.body.AccountID, function(err, result) {
        if(err) throw err;

    });
    db.getDetailsLab18(function(err, result){
        if(err) throw err;
        console.log('Controller: ' + result);
        res.render('displaySpecificUserPosts.ejs', {rs: result});
    });

});


router.post('/newview', function(req, res) {

    db.createLab18View(req.body.AccountID, function(err, result){
        if(err) throw err;
    });
    db.getDetailsLab18(function(err, result){
        if(err) throw err;
        res.render('displaySpecificUserPosts.ejs', {rs: result});
    });
});

router.get('/save', function(req, res) {
    var placeHolderValues = {
        fName: req.query.fName,
        lName: req.query.lName,
        username: req.query.Username,
        bio: req.query.Bio,
        accountid: req.query.AccountID,
        email: req.query.Email
    };

    db.update(req.query, function(err){
            if(err) throw err;
        });
    console.log();
    db.GetDetails(req.query.AccountID, function(err, result){
            if(err) throw err;
            res.render('Lab18Details.ejs', {rs: result});
    });


});

router.get('/drop18', function(req, res){
    db.Drop(function (err, result) {
        if(err) throw err;
        res.render('displayUserDropDown18.ejs', {rs: result});
    });
});

router.post('/edit', function(req, res) {
    console.log(req.body.AccountID);
    console.log('Inside edit.')
    db.createPostViewDetailed(req.body.AccountID, function(err,result){
        if (err) throw err;
    });
    console.log('About to call view');
    db.GetSpecificPostDetailed(function(err, result) {
        if(err) throw err;
        res.render('displaySpecificUserPostsDetailed.ejs', {rs: result});
    });
});


module.exports = router;

