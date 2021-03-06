/**
 * Created by brian on 1/13/2015.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RaceOccurrenceSchema = new Schema({
    date: { type: Date, required: true }
    , raceResult: {
        type: Schema.ObjectId
        , ref: 'RaceResult'
    }
    , adminApproved: {type: Boolean}
})

// following line makes the Mongoose model available as 'RaceOccurrence' to anything referencing this file
module.exports = mongoose.model('RaceOccurrence', RaceOccurrenceSchema);