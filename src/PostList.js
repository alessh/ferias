import React, { Component } from 'react';

import uuid from 'node-uuid';
import moment from 'moment';

import PostIt from './PostIt';
import './PostList.css';

export default class PostList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: this.props.date
		}
	}

	render() {
		const style = {
			display: 'inline-block',
			width: '100%'
		}
		this.items = [];

		const context = this;

    	this.props.items.forEach(function(v, k, a) {
    		const nome = v.fields.nome.value;
    		const date = moment.utc(v.fields.inicial.value);

    		//if (data.month() === context.props.date.month()) {
        		context.items.push(<PostIt key={uuid.v4()} id={v.id} class={v.class} date={date} author={nome || '???'} />);
    		//}
      	})
		return(
			<div style={style}>
				{this.items}
			</div>
		);
	}
}
