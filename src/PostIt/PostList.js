import React, { Component } from 'react';

import PostIt from './PostIt';

export default class PostList extends Component {

	render() {
		const style = {
			display: 'inline-block',
			width: '100%'
		}

		var context = this;

		var items = this.props.items.map(function(e) {
			return(
				<PostIt {...e} onClick={context.props.onClick} />
			);
		});

		return(
			<div style={style}>
				{items}
			</div>
		);
	}
}
