import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	FlatButton
} from 'material-ui';

import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

export default class Confirm extends Component {
	constructor(props) {
		super(props);

	    this.onConfirm = this.onConfirm.bind(this);
	    this.onCancel = this.onCancel.bind(this);
	}

	onConfirm() {
		if (this.props.onConfirm) this.props.onConfirm();  
	}

	onCancel() {
		if (this.props.onCancel) this.props.onCancel();
	}

	render() {
		return (
			<MuiThemeProvider>
				<div>
					<Dialog	
						modal={false}
						open={true}
						onRequestClose={this.props.onClose}
						autoScrollBodyContent={true}
						{...this.props} 
					>
						<div>{this.props.label}</div>

						<FlatButton
					      label="Cancelar"
					      labelPosition="before"
					      onTouchTap={this.onCancel.bind(this)} 
					      primary={true}
					      icon={<IconExit />} />

						<FlatButton
					      label="Confirmar"
					      labelPosition="before"
					      onTouchTap={this.onConfirm.bind(this)} 
					      primary={true}
					      icon={<IconSave />} />

					</Dialog>

				</div>
			</MuiThemeProvider>
		);
	}	
}