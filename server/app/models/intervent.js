var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/
 
// set up a mongoose model
var InterventSchema = new Schema({
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
    speaker: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    }
});

//METODI
 
module.exports = mongoose.model('Intervent', InterventSchema);