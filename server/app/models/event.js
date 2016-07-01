var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Session = require('./session');

 
// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/
 
// set up a mongoose model
var EventSchema = new Schema({
    title: {
        type: String,
        unique: false,
        required: true
    },
    date: {
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
    sessions: {
        type: [],
        required: false
    },
    public: {
        type: Boolean,
        required: true
    }
    
});

//METODI
 
module.exports = mongoose.model('Event', EventSchema);