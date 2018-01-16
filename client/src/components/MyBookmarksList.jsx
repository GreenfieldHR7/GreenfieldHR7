import React from 'react';
import $ from 'jquery';

import BookmarkedRestaurant from './BookmarkedRestaurant.jsx';

class MyBookmarksList extends React.Component {
    constructor(props) {
  		super(props);

  		this.state = {
  			user: this.props.user,
  			restaurants: []
  		}

  		this.getBookmarks = this.getBookmarks.bind(this);
    }

    getBookmarks() {
    	if (this.state.user) {
    		var query = {userId: this.state.user.id}

    		$.ajax({
    			url: 'restaurant/bookmark',
    			method: 'GET',
    			contentType: 'application/json',
    			data: query,
    			success: (restaurants) => {
    				this.setState({restaurants: restaurants});
    			},
    			failure: (err) => {
    				console.error(err);
    			}
    		});
    	}
    }

    componentWillMount() {
    	this.getBookmarks();
    }

    render() {
  		return (
  			<div>
  				{this.state.restaurants.map(restaurant =>
  					<BookmarkedRestaurant 
  						key={restaurant.id}
  						restaurant={restaurant}
  					/>
  				)}
  			</div>
  		)
  	}
}


export default MyBookmarksList;