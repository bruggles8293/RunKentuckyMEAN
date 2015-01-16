var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// the { id: false} option disables the virtual "id" getter (_id cast to a string)
var BearSchema   = new Schema({
	salutation: {type: String, default: "Master"},
	name: String
}
	,{ id: false}
);

BearSchema.set('toObject', { getters: true, virtuals: true});
BearSchema.set('toJSON', { getters: true, virtuals: true});

// example of adding a method
BearSchema.methods.sayHello = function () {
	var greeting = "Hello, my name is " + this.name;
	console.log(greeting);
}

// example of a virtual property getter 
BearSchema.virtual('fullName').get(function () {
	var fullName = this.salutation ? this.name ? this.salutation + " " + this.name : "No name" : "Master " + this.name;
	return fullName;
  
});

// example of a virtual property setter 
BearSchema.virtual('fullName').set(function (fullName) {
	var parts = fullName.split(' ');
	this.name.salutation = parts[0];
	this.name.name = parts[1];
});

// following line makes the Mongoose model available as 'Bear' to anything referencing this file
module.exports = mongoose.model('Bear', BearSchema);		