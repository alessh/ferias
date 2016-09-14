import React from 'react';

import { TextField, CircularProgress } from 'material-ui';

import uuid from 'node-uuid';

import Field from './Field';

export default class Code extends Field {
	componentWillMount() {
		this.state.mask = this.props.mask || null;
		this.state.format = this.props.format || null;
		this.state.validation = this.props.validation || null;
	}

	render() {
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		return (
			<div>
				<TextField 
					id={uuid.v4()} 
					onChange={this.onChange} 
					value={this.state.value} 
					fullWidth={true} 
					floatingLabelText={this.state.label}
					floatingLabelFixed={true}
				/>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}