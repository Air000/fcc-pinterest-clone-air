var express = require('express');
var router = express.Router();
var User = require("../routes/models/user");

module.exports = function(passport) {
    /* GET home page. */
    router.get('/', function(req, res) {
      User.getAllUserPins(function(err, pins) {
        if(err) {
            res.status(400);
            res.send("get pins error!");
        } else {
            res.render('index', { user: req.user, pins: pins });
        }
        
      });              
      
    });
    
    router.get('/mypins', isLoggedIn, function(req, res) {
       
        User.getUserPins(req.user.twitter.username, function(err, pins) {
           if(err) {
               res.status(400);
               res.send(err);
           }else{
               res.render('mypins', {user: req.user, pins: pins});
           }
        });
    });
    router.get('/addpin', isLoggedIn, function(req, res) {
        
        res.render('addpin', {user: req.user});
    });
    
    router.post('/addpin', isLoggedIn, function(req, res) {
       
       console.log(req.body);
       
       if(req.body.title && req.body.url) {
            User.addUserPin(req.user.twitter.username, req.body.title, req.body.url, function(err, pins) {
                if(err) {
                  res.status(400);
                  res.send(err);
                }else{
                  res.render('mypins', {user: req.user, pins: pins});
                }
            });
           } else {
               res.send("error title or url");
           }
    });
    
    router.post('/deletepin', isLoggedIn, function(req, res) {
        console.log(req.body);
        User.deletePin(req.user.twitter.username, req.body.pinId, function(err, updatedUser) {
            if(err) {
                res.status(400);
                res.send("delete image failed!");
            } else {
                console.log("updatedUser", updatedUser.pins);
                res.send(updatedUser.pins);
            }
        }); 
    });
    // route for twitter authentication and login
    router.get('/auth/twitter', passport.authenticate('twitter'));
    
    // handle the callback after twitter has authenticated the user
    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        }));
        
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });    
    
    return router;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.status(400);
    res.redirect('/auth/twitter');
    // res.redirect('/auth/twitter');
}