import React, { Component } from 'react';

import './PostIt.css';

export default class PostIt extends Component {
	constructor(props) {
		super(props);

		this.state = {
			degre: [2, -2, 2, -2, 2, -2, 2, -2, 2, 2, -2, -2, 2, -2, 2, -2][Math.floor(Math.random() * 16)]
		}
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		if (this.props.onClick) this.props.onClick(this.props);
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
			<a href='#' onTouchTap={this.onClick.bind(this)}>
				<div className="quote-container">
					<i className="pin"></i>
					<blockquote className={"note " + this.props.color} style={style} >
						<span>{this.props.title || '?'}</span>
						<cite className="author">{this.props.note || '?'}</cite>
						<span className="cite">{this.props.cite || ''}</span>
					</blockquote>
				</div>
			</a>
		);
	}
}
