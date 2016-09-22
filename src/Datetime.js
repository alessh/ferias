import React from 'react';

import { DatePicker, CircularProgress } from 'material-ui';

import uuid from 'node-uuid';
import moment from 'moment';

import Field from './Field';

export default class Datetime extends Field {
	constructor(props) {
		super(props);

		this.state.value = this.props.value === undefined || this.props.value === null || this.props.value.trim() === '' ? moment.utc().format() : this.props.value;
	}

	onChangeDate = (event, date) => {
	    this.setState({
	      value: date.getTimezoneOffset() > 0 ? moment(date).subtract(date.getTimezoneOffset() / 60, 'h').toJSON() : moment(date).add(date.getTimezoneOffset() / 60, 'h').toJSON()
	    });
	    this.props.event.publish('onChange', {path: this.state.path, value: date.getTimezoneOffset() > 0 ? moment(date).subtract(date.getTimezoneOffset() / 60, 'h').toJSON() : moment(date).add(date.getTimezoneOffset() / 60, 'h').toJSON()});
	};

	render() {
		const utc = moment.utc(this.state.value);
		const date = new Date(utc.year(), utc.month(), utc.date(), utc.toDate().getTimezoneOffset() / 60, 0, 0);
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		return (
			<div>
				<DatePicker 
					id={uuid.v4()} 
					onChange={this.onChangeDate} 
					value={date} 
					formatDate={this.formatDate} 
					fullWidth={true}
					floatingLabelText={this.state.label}
					floatingLabelFixed={true}
				/>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}