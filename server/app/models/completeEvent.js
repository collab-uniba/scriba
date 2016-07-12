var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var CompleteEventSchema = new Schema({
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
    public: {
        type: Boolean,
        required: true
    },
    sessions: {
        type: Array
    }
});

//METODI
CompleteEventSchema.methods.updateTable = function (cb) {
    
        return cb(err);
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('CompleteEvent', CompleteEventSchema);