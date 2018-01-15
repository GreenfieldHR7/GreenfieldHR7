import React from 'react';
import $ from 'jquery';

import SearchByRestaurantName from './SearchByRestaurantName.jsx';
import SearchByRestaurantCategory from './SearchByRestaurantCategory.jsx';
import SearchByRestaurantNearMe from './SearchByRestaurantNearMe.jsx';
import RestaurantDetails from './RestaurantDetails.jsx';
import FetchRecentReviews from './FetchRecentReviews.jsx';
import FilterRestaurants from './FilterRestaurants.jsx';


class Search extends React.Component {
	constructor(props) {
		super(props);

		this.state={
			restaurants: [],
			reviews: [],
			restaurantDetailView: false,
			restaurantDetailView: false,
			filter: ''
		};

		this.handleSearchResults = this.handleSearchResults.bind(this);
	}

	handleSearchResults(restaurants) {
		this.setState({
			restaurantDetailView: true,
			restaurants: restaurants,
			reviews: []
		});
		$( ".recent-reveiws-title" ).remove();
	}

	componentWillMount() {
		this.getReviews();
	}

	getReviews() {
		$.ajax({
			url: '/reviews',
			type: "GET",
			success: (reviews) => {
				console.log(reviews);
				reviews = this.getDatePattern(reviews);
				this.setState({
					reviews: reviews
				})
			},
			error: (err) => {
				console.log(err);
			}
		});		
	}

	getDatePattern(reviews) {
		for (var i = 0; i < reviews.length; i++) {
			let date = reviews[i].createddate;
			date = new Date(date).toString();
			date = date.split("GMT")[0];
			reviews[i].createddate = date;
		}
		return reviews;
	}

	handleFilter(e) {
		this.setState({
			filter: e.target.value
		})
	}

	restaurantsAfterFilter() {
		if (this.state.filter === '') {
			return this.state.restaurants
		} else {
			return this.state.restaurants.filter(restaurant=>{
				return restaurant.price === this.state.filter || restaurant.star === this.state.filter
			})
		}
	}

	render() {
		return (
			<div>
				<SearchByRestaurantName handleSearchResults={this.handleSearchResults} />
				<SearchByRestaurantCategory handleSearchResults={this.handleSearchResults} />
				<SearchByRestaurantNearMe handleSearchResults={this.handleSearchResults} user={this.props.user}/>

				{this.state.restaurantDetailView && <FilterRestaurants handleFilter={this.handleFilter.bind(this)} /> }
				<br/>
				{this.state.restaurantDetailView && this.restaurantsAfterFilter().map(restaurant=>{
					return <RestaurantDetails restaurant={restaurant} key={restaurant.id} user={this.props.user} />
				})}
				<FetchRecentReviews reviews={this.state.reviews} />
			</div>
		)
	}
}

export default Search;