/**
 * Created by brian on 12/27/2014.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// the { id: false} option disables the virtual "id" getter (_id cast to a string)
var RaceDirectorSchema   = new Schema({
        firstName: { type: String, required: true, trim: true }
        , lastName: { type: String, required: true, trim: true }
        , emailAddress: { type: String, required: true, trim: true }
        , phoneNumber: Number
        , website: { type: String, trim: true }
        // is races collection needed here?  If I can search on the race model by race director, then probably not
        , races: [{
            type: Schema.ObjectId
            , ref: 'race'
        }]
        , adminApproved: { type: Boolean}
    }
    ,{ id: false}
);

// example of a virtual property getter
RaceDirectorSchema.virtual('fullName').get(function () {
    var fullName = this.firstName ? this.lastName ? this.firstName + " " + this.lastName : "No name" : "?? " + this.lastName;
    return fullName;

});
RaceDirectorSchema.set('toObject', { getters: true, virtuals: true});
RaceDirectorSchema.set('toJSON', { getters: true, virtuals: true});

// following line makes the Mongoose model available as 'RaceDirector' to anything referencing this file
module.exports = mongoose.model('RaceDirector', RaceDirectorSchema);