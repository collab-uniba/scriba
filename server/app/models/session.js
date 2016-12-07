var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Intervent = require('./intervent');
 
// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/
 
// set up a mongoose model
var SessionSchema = new Schema({
    title: {
        type: String,
        unique: false,
        required: true
    },
    startDate: {
        type: Date,
        unique: false,
        required: true
    },
    endDate: {
        type: Date,
        unique: false,
        required: true
    },
    speakers: {
        type: [String]
    },
    status: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: false
    }
});
/*
SessionSchema.pre('save', function(next){
    //CREATES A SINGLE SESSION
    var newIntervent = new Intervent({
        title: this.title,
        date: this.startDate,
        speaker: this.organizer,
        session: this._id
    });
    newIntervent.save(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
        next();
    });  
})
*/

//METODI

module.exports = mongoose.model('Session', SessionSchema);