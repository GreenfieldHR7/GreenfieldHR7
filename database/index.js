const pg = require('pg');
var conString = "pg://localhost:5432/postgres";
const client = new pg.Client({
	connectionString: conString //change to connectionString: process.env.DATABASE_URL when deployed to Heroku
   // ssl: true
});

client.connect();

let searchByRestaurantName = (name, callback) => {
	const arguTwo = name[0].toUpperCase()+name.slice(1);
	const text = 'SELECT * from (select restaurants.*, round(avg(reviews.star)) as star from restaurants join reviews on restaurants.id=reviews.restaurant_id group by restaurants.id) a where a.name like $1::text or a.name like $2::text';
	client.query(text,[`%${name}%`, `%${arguTwo}%`] , (err, res) => {
	  if (err) {
	  	callback(err.stack, null);
	  } else {
	  	// if (res.rows.length === 0) {
	  	// 	client.query(text, ['Burgers'], (err, resTwo)=>{
	  	// 		if(!err) {
	  	// 			callback(null, resTwo.rows)
	  	// 		}
	  	// 	})
	  	// } else {
	  		callback(null, res.rows);	
	  	//}
	  }
    })
}

let searchByRestaurantCategory = (category, callback) => {
	const arguTwo = category[0].toUpperCase()+category.slice(1);
	const text = 'SELECT * from (select restaurants.*, round(avg(reviews.star)) as star from restaurants join reviews on restaurants.id=reviews.restaurant_id group by restaurants.id) a where a.category like $1::text or a.category like $2::text';
	client.query(text,[`%${category}%`, `%${arguTwo}%`] , (err, res) => {
	  if (err) {
	  	callback(err.stack, null);
	  } else {
	   //  if (res.rows.length === 0) {
	  	// 	client.query(text, ['Burgers'], (err, resTwo)=>{
	  	// 		if(!err) {
	  	// 			callback(null, resTwo.rows)
	  	// 		}
	  	// 	})
	  	// } else {
	  		callback(null, res.rows);	
	  	// }
	  }
	})
}

let getAllRestaurants = (callback) => {
	const queryStr = 'SELECT * FROM restaurants';
	client.query(queryStr, (err, restaurants) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, restaurants.rows);
		}
	});
}

let addUser = (userInfo, callback) => {
	const selectQuery = 'select * from users where gmailid = $1';
	const insertQuery = 'insert into users (gmailaddress, gmailid, firstName, lastName) values ($1, $2, $3, $4)';
	client.query(selectQuery, [userInfo.id], (err, res) => {
		if (err) {
			callack(err.stack, null);
		} else {
			if (res.rows.length === 0) {
				client.query(insertQuery, [userInfo.emails[0].value, userInfo.id, userInfo.name.givenName, userInfo.name.familyName], (err, res2) => {
					callback(null, res.rows);
				})
			} else {
				callback(null, res.rows);
			}
		}
	})
}

let searchUser = (id, callback) => {
	const selectQuery = 'select * from users where id = $1';
	client.query(selectQuery, [id], (err, res) => {
		if (err) {
			callback(err.stack, null);
		} else {
			callback(null, res.rows[0]);
		}
	})
}

let getReviews = (callback) => {
	const numOfReviews = 4;
	const selectQuery = 'select * from reviews join users on reviews.user_id = users.id join restaurants on reviews.restaurant_id = restaurants.id order by createdDate desc';
	client.query(selectQuery, (err, resReviews) => {
		if (err) {
			callback(err.stack, null);
		} else {					
			const recentReviews = resReviews.rows.slice(0, numOfReviews);
			callback(null, recentReviews);
		}
	});
}

let getBookmarkedRestaurants = (userId, callback) => {
	const queryStr = 'select * from restaurants r join bookmarks b on r.id = b.restaurant_id where b.user_id = $1';
	client.query(queryStr, [userId], (err, restaurants) => {
		if (err) {
			callback(err.stack, null);
		} else {
			callback(null, restaurants.rows);
		}
	});	
}

let bookmarkRestaurant = (userId, restaurantId, callback) => {
	const checkQuery = 'select * from bookmarks where user_id = $1 and restaurant_id = $2';
	client.query(checkQuery, [userId, restaurantId], (err, resultOne)=>{
		if (resultOne.rows.length === 0) {
			const queryStr = 'insert into bookmarks (user_id, restaurant_id) values ($1, $2)';
			client.query(queryStr, [userId, restaurantId], (err, resultTwo) => {
				if (err) {
					callback(err, null);
				} else {
					callback(null, resultTwo);
				}
			})
		}
	})
}

let addReview = (review, callback) => {
	const insertQuery = 'insert into reviews (user_id, restaurant_id, createddate, star, comment) values ($1, $2, localtimestamp, $3, $4)';
	client.query(insertQuery, [review.userId, review.restaurantId, review.reviewStars, review.reviewComment], (err, res) => {
		if (err) {
			callback(err.stack, null);
		} else {
			callback(null, res.rows[0]);
		}
	})
}

let getUserRestaurantCategories = (userId, callback) => {
	const queryStr = 'select category from restaurants join reviews on restaurants.id = reviews.restaurant_id where reviews.user_id = $1';
	client.query(queryStr, [userId], (err, restaurants) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, restaurants.rows);
		}
	});
}



module.exports = {
  searchByRestaurantName: searchByRestaurantName,
  searchByRestaurantCategory: searchByRestaurantCategory,
  addUser: addUser,
  searchUser: searchUser,
  getAllRestaurants: getAllRestaurants,
  addReview: addReview,
  getReviews: getReviews,
  getBookmarkedRestaurants: getBookmarkedRestaurants,
  bookmarkRestaurant: bookmarkRestaurant,
  getUserRestaurantCategories: getUserRestaurantCategories
}
