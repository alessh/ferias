import React from 'react';

import { TextField, CircularProgress } from 'material-ui';

import uuid from 'node-uuid';

import Field from './Field';

export default class Textbox extends Field {
	/*componentWillMount() {
		this.state.loc = this.props.loc || null;
		this.state.mask = this.props.mask || null;
		this.state.lang = this.props.lang || null;
		console.log('Component will mount: ' + this.state.id + ':' + this.state.type);
	}*/

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
