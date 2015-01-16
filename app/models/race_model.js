/**
 * Created by brian on 12/18/2014.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// the { id: false} option disables the virtual "id" getter (_id cast to a string)
var RaceSchema   = new Schema({
        name: { type: String, required: true, trim: true }
        // can't used nested Schema (aka Embedded Documents) where we need a many-to-many relationship
        , raceDirector: {
            type: Schema.ObjectId
            , ref: 'RaceDirector'
        }
        , raceDistance: {
            type: Schema.ObjectId
            , ref: 'RaceDistance'
        }
        , raceOccurrences: [Schema.RaceOccurrence]         // nested schema here since we don't need many-to-many
        //, dates:[{date: { type: Date, required: true }, adminApproved: {type: Boolean}}]    // not using this anymore
        , website: { type: String, trim: true }
        , dateCreated: { type: Date, default: Date.now }
        , raceReviews: [Schema.RaceReview]         // nested schema here since we don't need many-to-many
        /*
        , raceReviews: [{
            type: Schema.ObjectId
            , ref: 'RaceReview'
        }]
        */
        , adminApproved: { type: Boolean}
    }
    ,{ id: false}
);

RaceSchema.set('toObject', { getters: true, virtuals: true});
RaceSchema.set('toJSON', { getters: true, virtuals: true});

// following line makes the Mongoose model available as 'Race' to anything referencing this file
module.exports = mongoose.model('Race', RaceSchema);
