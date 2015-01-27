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
        // sisterRace(s) would be for something like a half/full marathon combo, or Flying Pig full/half/10k/5k
        , sisterRaces: [{
            type: Schema.ObjectId
            , ref: 'Race'
        }]
        , location: {
            name: { type: String, required: false }     // i.e. Cherokee Park
            , street: { type: String }
            , city: { type: String }
            , state: { type: String, uppercase: true }
            , zipCode: { type: Number}
            , latitude: { type: Number, min: 24.52, max: 49.38}         // approx lat/long ranges for Continental US
            , longitude: { type: Number, min: -124.77, max: -66.95}     // note that North lat is positive, West long is negative
        }
        , raceOccurrences: [Schema.RaceOccurrence]          // nested schema here since we don't need many-to-many
        //, dates:[{date: { type: Date, required: true }, adminApproved: {type: Boolean}}]    // not using this anymore
        , website: { type: String, trim: true }             // TODO:  need URL Regex here
        , registrationLink: { type: String, trim: true }    // TODO:  need URL Regex here
        , registrationCosts: [
            {
                price: { type: Number, min: 0, required: true }
                , deadline: { type: Date, required: true }
            }
        ]
        , prizeMoneyOffered: { type: Boolean }              // might make this more detailed (i.e. how much, Masters or not, etc.)
        , dateCreated: { type: Date, default: Date.now }
        , raceReviews: [Schema.RaceReview]                  // nested schema here since we don't need many-to-many
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
