var Bear = require('./models/bear_model');
var Race = require('./models/race_model');
var RaceDirector = require('./models/raceDirector_model');
var RaceDistance = require('./models/raceDistance_model');
var RaceOccurrence = require('./models/raceOccurrence_model');

function getBears(res){
	Bear.find(function(err, bears) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
			console.log('error in getBears: ' + err);
			res.send(err);
		}

		res.json(bears); // return all bears in JSON format
		});
};

function getRaceById(id, res){
	Race.findById(id)		// note that findByID() (and find()) return Mongoose Query objects
		.populate('raceDirector raceDistance')
		.exec(function(err, race) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err) {
				console.log('error in getRaceById: ' + err);
				res.send(err);
			}
			//console.log(race);
			res.json(race); // return race in JSON format
		});
}

function getRaces(res){
	// just a test here (*** I think my problem is how I'm populating the RaceDirector)
	/*
	var brianRd;
	var brianRace;
	// try doing a findOne on a raceDirector, then saving that raceDirector's ID to the race
	RaceDirector.findOne({firstName : 'Brian'}).exec(function (err, raceDirector) {
		if (err) {
			console.log('Error in RaceDirector.findOne: ' + err);
			return;
		}

		console.log('raceDirector is ' + raceDirector);
		brianRd = raceDirector;

		//console.log('Race Director first name is ' + brianRd.firstName);
		Race.findOne({name: 'Brian 5k'})
			.populate('raceDirector')
			.exec(function(err, race){
				if (err) {
					console.log('error in Race.findOne: ' + err);
					return;
				}
				if (race != null)
				{
					brianRace = race;
					brianRace.raceDirector = brianRd._id;
					brianRace.save();
					//console.log(brianRace.raceDirector);
					//console.log('*** The race director is ' + race.raceDirector.firstname);
				}

			});
	});
	*/
	// -------------------- test finished --------------------------

	Race.find()
		.populate('raceDirector raceDistance')
		.exec(function(err, races) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err) {
			console.log('error in getRaces: ' + err);
			res.send(err);
		}
		//console.log(races);
		res.json(races); // return all races in JSON format
	});
};

function getRaceDirectors(res){
	RaceDirector.find(function(err, raceDirectors) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)

		res.json(raceDirectors); // return all raceDirectors in JSON format
	});
};

function getRaceDistances(res){
	RaceDistance.find(function(err, raceDistances) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)

		res.json(raceDistances); // return all raceDirectors in JSON format
	});
};

module.exports = function(app) {

	app.use(function(req, res, next) {
		console.log('do-nothing middleware called');
		next();
	});
	
	// api ---------------------------------------------------------------------

	// bears -------------------------------------------------------------------
	//region bears
	// get all bears
	app.get('/api/bears', function(req, res) {
		console.log('in app.get bears');
		// use mongoose to get all bears in the database
		getBears(res);
	});

	// create bear and send back all bears after creation
	app.post('/api/bears', function(req, res) {
		console.log('in app.post bears');
		console.log(JSON.stringify(req.body));
		//console.log(JSON.parse(req.body));
		// create a bear, information comes from AJAX request from Angular

		// method 1, explicit assignment of properties
		Bear.create({
			salutation : req.body.salutation
			, name : req.body.name
		}
		, function(err, bear) {
			if (err) {
				console.log('error in Bear.create');
				res.send(err);
			}
			// get and return all the bears after you create another
			getBears(res);
		});

		// method 2, properties are assigned straight from JSON
		// - this seems easier with a complex model, but I should try it both ways
		// - this is more susceptible to injection, but I can probably do some validation in the schema
		/*
		new Bear(req.body).save(function(err, bear) {
			if (err) {
				console.log('error in Bear.create');
				res.send(err);
			}
			// get and return all the bears after you create another
			getBears(res);
		});
		*/
	});

	// delete a bear
	app.delete('/api/bears/:bear_id', function(req, res) {
		console.log('in app.delete bears');
		Bear.remove({
			_id : req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			getBears(res);
		});
	});
	//endregion

	// races -------------------------------------------------------------------
	// get all races
	app.get('/api/races', function(req, res) {
		console.log('in app.get races');
		// use mongoose to get all races in the database
		getRaces(res);
	});

	app.get('/api/races/:race_id', function(req, res) {
		console.log('in routes.js get by race_id');
		// use mongoose to get all races in the database
		//console.log('req.body._id = ' + req.body._id);
		getRaceById(req.params.race_id, res);
		//throw "Brian custom error";		// just for testing error handling
	});
	// create race and send back all races after creation
	app.post('/api/races', function(req, res) {
		console.log('in routes.js post races');
		console.log(req.body);
		// create a race, information comes from AJAX request from Angular
		var race = new Race({
			name : req.body.name
			, website : req.body.website
			, raceDirector : req.body.raceDirector
			, raceDistance : req.body.raceDistance
		});
		console.log('req.body.raceDate is ' + req.body.raceDate);
		var rc = new RaceOccurrence({date: req.body.raceDate});
		race.raceOccurrences.push(rc);
		//race.raceOccurrences.push({date: req.body.raceDate});
		race.save(function(err, race, numberAffected) {
			if (err) {
				console.log('error in Race.create');
				res.send(err);
			}
			// get and return all the races after you create another
			getRaces(res);
		})
		/*
		Race.create({
			name : req.body.name
			, website : req.body.website
			, raceDirector : req.body.raceDirector
			, raceDistance : req.body.raceDistance
		}, function(err, raceDirector) {
			if (err) {
				console.log('error in Race.create');
				res.send(err);
			}
			// get and return all the races after you create another
			getRaces(res);
		});
		*/
	});

	// update race and send it back after creation
	app.put('/api/races/:race_id', function(req, res) {
		console.log('in routes.js put races');
		console.log(req.body);
		// update a race, information comes from AJAX request from Angular
		Race.findByIdAndUpdate(req.params.race_id,
		{
			$set: {
				name: req.body.name
				, website : req.body.website
				, raceDirector : req.body.raceDirector._id
				, raceDistance : req.body.raceDistance._id
			}
		}
		, function(err, race) {
			if (err) {
				console.log('error in Race.findByIdAndUpdate: ' + err);
				res.send(err);
			}
			console.log('Race.findByIdAndUpdate succeeded.')
			console.log(race);

			res.json(race);
		});

	});

	// delete a race
	app.delete('/api/races/:race_id', function(req, res) {
		console.log('iin routes.js delete races');
		Race.remove({
			_id : req.params.race_id
		}, function(err, race) {
			if (err)
				res.send(err);

			getRaces(res);
		});
	});

	// raceDirectors -------------------------------------------------------------------
	// get all raceDirectors
	app.get('/api/raceDirectors', function(req, res) {
		console.log('in routes.js get raceDirectors');
		// use mongoose to get all races in the database
		getRaceDirectors(res);
	});

	// create raceDirector and send back all raceDirectors after creation
	app.post('/api/raceDirectors', function(req, res) {
		console.log('in routes.js post raceDirectors');
		// create a race, information comes from AJAX request from Angular
		RaceDirector.create(
		//{
		//	name : req.body.name
		//}
			req.body
			, function(err, raceDirector) {
			if (err) {
				console.log('error in RaceDirector.create');
				res.send(err);
			}
			// get and return all the raceDirectors after you create another
			getRaceDirectors(res);
		});

	});

	// create raceDirector and send it back after creation
	app.put('/api/raceDirectors/:raceDirector_id', function(req, res) {
		console.log('in routes.js put raceDirectors');
		// update a raceDirector, information comes from AJAX request from Angular
		// TODO: some say it's better to use findById and then Save - need to research why
		// TODO: might be so that subdocuments (using ObjectIDs) will save correctly
		RaceDirector.findByIdAndUpdate(req.params.raceDirector_id, req.body, function(err, raceDirector) {
			if (err) {
				console.log('error in RaceDirector.findByIdAndUpdate');
				res.send(err);
			}
			//console.log('no error in app.put raceDirectors');
			//console.log(req.params.raceDirector_id);
			//console.log(req.body);
		});

	});
	// delete a raceDirector
	app.delete('/api/raceDirectors/:raceDirector_id', function(req, res) {
		console.log('in routes.js delete raceDirectors');
		RaceDirector.remove({
			_id : req.params.race_id
		}, function(err, race) {
			if (err)
				res.send(err);

			getRaceDirectors(res);
		});
	});

	// raceDistances -------------------------------------------------------------------

	// get all raceDistances
	app.get('/api/raceDistances', function(req, res) {
		console.log('in app.get raceDistances');
		// use mongoose to get all race distances in the database
		getRaceDistances(res);
	});

	// create raceDistance and send back all raceDistances after creation
	app.post('/api/raceDistances', function(req, res) {
		console.log('in routes.js post raceDistances');
		console.log(req.body);
		// create a race, information comes from AJAX request from Angular
		RaceDistance.create(
			//{
			//	name : req.body.name
			//}
			req.body
			, function(err, raceDistance) {
				if (err) {
					console.log('error in RaceDistance.create');
					res.send(err);
				}
				// get and return all the raceDistances after you create another
				getRaceDistances(res);
			});

	});

	// create raceDistance and send it back after creation
	app.put('/api/raceDistances/:raceDistance_id', function(req, res) {
		console.log('in routes.js put raceDistances');
		console.log(req.body);
		// update a raceDistance, information comes from AJAX request from Angular
		// TODO: some say it's better to use findById and then Save - need to research why
		RaceDistance.findByIdAndUpdate(req.params.raceDistance_id, req.body, function(err, raceDistance) {
			if (err) {
				console.log('error in RaceDistance.findByIdAndUpdate');
				res.send(err);
			}
			//console.log('no error in app.put raceDistances');
			//console.log(req.params.raceDistance_id);
			//console.log(req.body);
		});

	});
	// delete a raceDistance
	app.delete('/api/raceDistances/:raceDistance_id', function(req, res) {
		console.log('in routes.js delete raceDistances');
		RaceDistance.remove({
			_id : req.params.race_id
		}, function(err, race) {
			if (err)
				res.send(err);

			getRaceDistances(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};