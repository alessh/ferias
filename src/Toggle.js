import React from 'react';

import { CircularProgress } from 'material-ui';
import ToggleUI from 'material-ui/Toggle';

import uuid from 'node-uuid';

import Field from './Field';

export default class Toogle extends Field {
	constructor(props) {
		super(props);

		this.state.value = typeof this.props.value === 'boolean' && this.props.value;
	}
	onChange(event, value) {
	    this.setState({value: value});
	    this.props.event.publish('onChange', {path: this.state.path, value: value});
	}	
	render() {
		const style = {
			toggle: {
				marginBottom: 16,
			}
		}
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		return (
			<div>
				<ToggleUI 
					id={uuid.v4()} 
					onToggle={this.onChange} 
					defaultToggled={this.state.value} 
					labelPosition="right"
					label={this.state.label}
					style={style.toggle}
				/>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}
