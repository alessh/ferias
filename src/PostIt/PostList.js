import React, { Component } from 'react';

import PostIt from './PostIt';

import uuid from 'node-uuid';

export default class PostList extends Component {

	render() {
		const style = {
			display: 'inline-block',
			width: '100%'
		}

		var context = this;

		var items = this.props.items.map(function(e) {
			return(
				<PostIt key={context.props.key || uuid.v4()} {...e} onClick={context.props.onClick} />
			);
		});

		return(
			<div style={style}>
				{items}
			</div>
		);
	}
}
