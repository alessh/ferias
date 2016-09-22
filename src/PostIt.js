import React, { Component } from 'react';

import Ferias from './Forms/Ferias';

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
			degre: randomElement([2, -2, 2, -2, 2, -2, 2, -2, 2, 2, -2, -2, 2, -2, 2, -2])
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

		return (
			
			<a href='#' onTouchTap={this.onOpen}>
				<div className="quote-container">
					<i className="pin"></i>
					<blockquote className={"note " + this.props.color} style={style} >
						{this.props.title}
						<cite className="author">{toTitleCase(this.props.note)}</cite>
					</blockquote>
					{ this.state.open ? (<Ferias id={this.props.id} onClose={this.onClose.bind(this)} />) : (null) }
				</div>
			</a>
		);
	}
}
