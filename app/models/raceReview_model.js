/**
 * Created by brian on 12/28/2014.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// the { id: false} option disables the virtual "id" getter (_id cast to a string)
var RaceReviewSchema   = new Schema({
        overallRating: { type: Number, required: true, min: 0, max: 5 }
        , courseRating: { type: Number, required: true, min: 0, max: 5 }
        , courseDifficulty: { type: Number, required: true, min: 0, max: 5 }
        , organizationRating: { type: Number, required: true, min: 0, max: 5 }
        , reviewText: { type: String, required: true }
        , dateCreated: { type: Date, default: Date.now }
        //, createdByUserId: { type: String, required: true}        // need login system to implement this
        , race: {
            type: Schema.ObjectId
            , ref: 'Race'
        }
    }
    ,{ id: false}
);

RaceReviewSchema.set('toObject', { getters: true, virtuals: true});
RaceReviewSchema.set('toJSON', { getters: true, virtuals: true});

// following line makes the Mongoose model available as 'RaceReview' to anything referencing this file
module.exports = mongoose.model('RaceReview', RaceReviewSchema);