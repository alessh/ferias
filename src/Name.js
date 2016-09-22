import React from 'react';

import { TextField } from 'material-ui';

import uuid from 'node-uuid';

import Field from './Field';

export default class Name extends Field {

	/*onChange(event, index, value) {
	    this.setState({value: value || event.target.value});
	    this.props.event.publish('onChange', {path: this.state.path, value: value || event.target.value});
	}*/
	render() {
		/*const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}*/
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
				{/*<CircularProgress size={0.5} style={progress} />*/}
			</div>
		);
	}
}
