import React, { Component } from 'react';

import uuid from 'node-uuid';
import moment from 'moment';

import PostIt from './PostIt';
import './PostList.css';

export default class PostList extends Component {
	render() {
		var today = moment.utc();

		var color = '';

		const style = {
			display: 'inline-block',
			width: '100%'
		}

		this.items = [];

		var context = this;

    	this.props.items.forEach(function(v, k, a) {
    		const date = moment.utc(v[context.props.title]);
    		const title = date.format('DD/MM/YYYY');
    		const note = v[context.props.note]

			if (date.clone().add(12, 'months').diff(today, 'days') <= 0) {
				color = 'gray';
			} else if (date.clone().add(11, 'months').diff(today, 'days') <= 0) {
				color = 'red';
			} else if (date.diff(today, 'days') <= 0) {
				color = 'yellow';
			}

       		context.items.push(<PostIt key={uuid.v4()} id={v.id} title={title} note={note || '???'} color={color} schema={context.props.schema} />);
      	})
		return(
			<div style={style}>
				{this.items}
			</div>
		);
	}
}
