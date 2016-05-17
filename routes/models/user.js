// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    
    pins             : [{
        title   : String,
        imgUrl  : String,
        createTimestamp :    Date
    }]
});

userSchema.statics.getAllUserPins = function getAllUserPins(cb) {
  return this.find().exec(function(err, retArray) {
      var pins = [];
      retArray.forEach(function(obj) {
          pins = pins.concat(obj.pins);
      });
      cb(err, pins);
  }); 
};

userSchema.statics.getUserPins = function (username, cb) {
  return this.findOne({'twitter.username': username}).exec(function(err, user) {
      cb(err, user.pins);
      
  });
};

userSchema.statics.addUserPin = function (username, title, url, cb) {
  this.findOneAndUpdate(
        {'twitter.username': username}, 
        {$push:
            {'pins': 
                {title: title,
                    imgUrl: url,
                    createTimestamp: new Date()
                }
            }
        },
        {'new': true},
        function(err, updatedUser) {
            if(err) {
                cb(err);
            } else {
                cb(err, updatedUser.pins);
            }
        });  
};

userSchema.statics.deletePin = function(username, pinId, cb) {
    this.findOneAndUpdate(
        {'twitter.username': username},
        {$pull:
            {'pins':
                {_id: pinId}
            }
        },
        {'new': true},
        function(err, updatedUser) {
            cb(err, updatedUser);
        })
}
// create the model for users and expose it to our app
module.exports = mongoose.model('PinterestUser', userSchema);