var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Session = require('./session');

// set up a mongoose model
var EventSchema = new Schema({
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
    organizer: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true
    },
    allowed: {
        type: [String]
    }
    
});
/*
EventSchema.pre('save', function(next){
    //CREATES A SINGLE SESSION
    var newSession = new Session({
        title: this.title,
        startDate: this.startDate,
        endDate: this.endDate,
        speakers: [this.organizer],
        event: this._id
    });
    newSession.save(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
        next();
    });  
})
*/
//METODI
 
module.exports = mongoose.model('Event', EventSchema);