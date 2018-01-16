const fs = require('fs');
const path = require('path');
const pg = require('pg');
var conString = "pg://localhost:5432/postgres";
const client = new pg.Client({
	connectionString: conString //change to connectionString: process.env.DATABASE_URL when deployed to Heroku
   // ssl: true
});

client.connect();

var insertRestaurantsToDatabase = (restaurants) => {
	var restaurants = JSON.parse(restaurants);
	var queryStr = 'INSERT INTO restaurants \
		(name, category, phone, price, latitude, longitude, city, address, state, zip) \
		VALUES ($1, $2, $3 ,$4, $5, $6, $7, $8, $9, $10)';
	restaurants.businesses.map(restaurant => {
		var inputs = [restaurant.name, restaurant.categories[0].title, restaurant.phone, restaurant.price, 
			restaurant.coordinates.latitude, restaurant.coordinates.longitude, restaurant.location.city,
			restaurant.location["address1"], restaurant.location.state, Number(restaurant.location.zip_code)];
		client.query(queryStr, inputs, (error, results) => {
	  		if (error) {
	  			console.log(`Error insert ${restaurant} to DB`);
	  		}
		});
	});
}

var readFiles = (dirname) => {
  	fs.readdir(dirname, (err, filenames) => {
    	if (err) {
      		console.err(err);
    	} else {
	    	filenames.forEach(filename => {
	      		fs.readFile(dirname + filename, 'utf-8', (err, restaurants) => {
	        		if (err) {
      					console.err(err);
	        		} else {
	        			insertRestaurantsToDatabase(restaurants);
	        		}
	      		});
	    	});
    	}
  	});
}

// populate restaurants table by running node seed.js in command line with line below uncommented (there should be 548 rows)
readFiles(path.join(__dirname, '../database/categories/'));


