import React, { Component } from 'react';

import './PostIt.css';

export default class PostIt extends Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		if (this.props.onClick) this.props.onClick(this.props);
	}

	render() {
		const degre = [2, -2, 2, -2, 2, -2, 2, -2, 2, 2, -2, -2, 2, -2, 2, -2][Math.floor(Math.random() * 16)];
		const style = {
			'WebkitTransform': 'rotate(' + degre + 'deg)',
			'MozTransform': 'rotate(' + degre + 'deg)',
			'OTransform': 'rotate(' + degre + 'deg)',
			'MsTransform': 'rotate(' + degre + 'deg)',
			'transform': 'rotate(' + degre + 'deg)',
			'transform': 'rotate(' + degre + 'deg)'
		}

		return (
			<a href='#' onTouchTap={this.onClick.bind(this)}>
				<div className="quote-container">
					<i className="pin"></i>
					<blockquote className={"note " + this.props.color} style={style} >
						<span>{this.props.title || '?'}</span>
						<cite className="author">{this.props.note || '?'}</cite>
					</blockquote>
				</div>
			</a>
		);
	}
}
