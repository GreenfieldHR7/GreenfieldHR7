import React from 'react';
import $ from 'jquery';


class SearchByRestaurantNearMe extends React.Component {
    constructor(props) {
  		  super(props);

  		  this.state = {restaurants: []};

  		  this.handleSearch = this.handleSearch.bind(this);
    }

	handleSearch() {
		var query;

		if (this.props.user.id) {
			query = {userId: this.props.user.id};
		} else {
			query = {userId: undefined};
		}

		$.ajax({
			url: '/restaurant/near',
			method: 'GET',
			contentType: 'application/json',
			data: query,
			success: (restaurants) => {
				this.props.handleSearchResults(restaurants);
			}, 
			failuire: (err) => {
				console.error(err);
			}
		});
	}

    render() {
  		  return (
  		  	<div className="col">
            	<button onClick={this.handleSearch}>Search by Restaurant Near Me</button>
            </div>
        )
  	}
}


export default SearchByRestaurantNearMe;
