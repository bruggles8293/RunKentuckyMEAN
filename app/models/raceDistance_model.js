/**
 * Created by brian on 12/28/2014.
 */
/**
 * Created by brian on 12/28/2014.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// the { id: false} option disables the virtual "id" getter (_id cast to a string)
var RaceDistanceSchema   = new Schema({
        amount: { type: Number, required: true }
        , units: { type: String, default: 'kilometers'}
        // is races collection needed here?  If I can search on the race model by distance, then probably not// is races collection needed here?  If I can search on the race model by distance, then probably not
        , races: [{
            type: Schema.ObjectId
            , ref: 'race'
        }]
    }
    ,{ id: false}
);

RaceDistanceSchema.set('toObject', { getters: true, virtuals: true});
RaceDistanceSchema.set('toJSON', { getters: true, virtuals: true});

// virtual property getters
RaceDistanceSchema.virtual('distanceName').get(function () {
    // show "K" if the unit is "kilometers"
    var distanceName = this.amount ? this.units ? this.amount + " " + (this.units == 'kilometers' ? 'K' : this.units) : "No distance" : "?? " + this.units;
    return distanceName;

});

RaceDistanceSchema.virtual('distanceInKilometers').get(function () {
    var kilometers = this.units == 'kilometers' ? this.amount : this.units * 1.60934;
    return kilometers;
});

RaceDistanceSchema.virtual('distanceInMiles').get(function () {
    var kilometers = this.units == 'miles' ? this.amount : this.units * 0.621371;
    return kilometers;
});
// following line makes the Mongoose model available as 'RaceDistance' to anything referencing this file
module.exports = mongoose.model('RaceDistance', RaceDistanceSchema);
