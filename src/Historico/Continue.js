import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	FlatButton
} from 'material-ui';

import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

export default class Continue extends Component {
	constructor(props) {
		super(props);

	    this.onYes = this.onYes.bind(this);
	    this.onNo = this.onNo.bind(this);
	}

	onYes() {
		if (this.props.onYes) this.props.onYes();  
	}

	onNo() {
		if (this.props.onNo) this.props.onNo();
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
					      label="Não"
					      labelPosition="before"
					      onTouchTap={this.onNo.bind(this)} 
					      primary={true}
					      icon={<IconExit />} />

						<FlatButton
					      label="Sim"
					      labelPosition="before"
					      onTouchTap={this.onYes.bind(this)} 
					      primary={true}
					      icon={<IconSave />} />

					</Dialog>

				</div>
			</MuiThemeProvider>
		);
	}	
}