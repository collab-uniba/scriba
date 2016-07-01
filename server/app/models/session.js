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
    date: {
        type: Date,
        unique: false,
        required: true
    },
    speakers: {
        type: [String]
    },
    intervents: {
        type: [Intervent],
        required: false
    }
});

//METODI
 
module.exports = mongoose.model('Session', SessionSchema);