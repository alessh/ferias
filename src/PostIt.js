import React, { Component } from 'react';

import moment from 'moment';

import FormDialog from './FormDialog';

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){
    	switch(txt.toLowerCase()) {
    		case 'da':
    		case 'do':
    		case 'de':
    		case 'e':
    		case 'das':
    		case 'dos':
    			return txt.toLowerCase();
    		default:
    			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	}
    });
}

export default class PostIt extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			degre: randomElement([2, -2, 2, -2, 2, -2, 2, -2, 2, 2, -2, -2, 2, -2, 2, -2]),
			date: this.props.date.clone()
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
	}
	
	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		this.setState({open: false});
	}

	render() {
 		const style = {
			'WebkitTransform': 'rotate(' + this.state.degre + 'deg)',
			'MozTransform': 'rotate(' + this.state.degre + 'deg)',
			'OTransform': 'rotate(' + this.state.degre + 'deg)',
			'MsTransform': 'rotate(' + this.state.degre + 'deg)',
			'transform': 'rotate(' + this.state.degre + 'deg)'
		}
		var color = '';

		var today = moment.utc();

		if (this.state.date.clone().add(12, 'months') <= today) {
			color = 'gray';
		} else if (this.state.date.clone().add(11, 'months') <= today) {
			color = 'red';
		} else if (this.state.date <= today) {
			color = 'yellow';
		}

		return (
			
			<a href='#' onTouchTap={this.onOpen}>
				<div className="quote-container">
					<i className="pin"></i>
					<blockquote className={"note " + color} style={style} >
						{this.props.date.format('DD/MM/YYYY')}
						<cite className="author">{toTitleCase(this.props.author)}</cite>
					</blockquote>
					<FormDialog {...this.props} open={this.state.open} onClose={this.onClose.bind(this)} />
				</div>
			</a>
		);
	}
}
