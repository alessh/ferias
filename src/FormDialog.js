import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Dialog, RaisedButton } from 'material-ui';

import Form from './Form';

export default class FormDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			onSave: null
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		//this.setState({open: false});
		this.props.onClose();
	}

	onSave() {
		//this.setState({open: false});
		this.props.onClose();
	}

	render() {
		const style = {
			button: {
				align: 'center',
				margin: 12
			}
		}
		const actions = [
		  <RaisedButton
		    label="Cancelar"
		    primary={true}
		    onTouchTap={this.onClose}
		    style={style.button}
		  />,
		  <RaisedButton
		    label="Gravar"
		    primary={true}
		    onTouchTap={this.onSave}
		    style={style.button}
		  />,
		];
		return (
			<MuiThemeProvider>
			<div>
				<Dialog	
					actions={actions}
					modal={false}
					open={this.props.open}
					onRequestClose={this.props.onClose}
					autoScrollBodyContent={true}
					{...this.props} 
				>
					<Form {...this.props} onClose={this.onSave.bind(this)} onSave={this.state.onSave} />
				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}
