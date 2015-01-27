/**
 * Created by brian on 1/26/2015.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// the { id: false} option disables the virtual "id" getter (_id cast to a string)
var RaceResultSchema  = new Schema({
        resultsLink: { type: String, required: false }      // TODO: need a URL regex here
        , winningMensTime: { type: String, required: false }
        , winningWomensTime: { type: String, required: false }
        , tenthPlaceTime: { type: String, required: true }
        , oneHundredthPlaceTime: { type: String, required: true }
        , numberOfFinishers: { type: Number, required: true, min: 1 }
        , dateCreated: { type: Date, default: Date.now }
        , raceOccurance: {
            type: Schema.ObjectId
            , ref: 'RaceOccurrence'
        }
    }
    ,{ id: false}
);

RaceResultSchema.set('toObject', { getters: true, virtuals: true});
RaceResultSchema.set('toJSON', { getters: true, virtuals: true});

// following line makes the Mongoose model available as 'RaceResult' to anything referencing this file
module.exports = mongoose.model('RaceResult', RaceResultSchema);
