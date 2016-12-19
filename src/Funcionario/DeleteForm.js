import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	FlatButton
} from 'material-ui';

import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import axios from 'axios';

export default class Ferias extends Component {
	constructor(props) {
		super(props);

		this.state = {
			progress: false,
		}

	    this.onDelete = this.onDelete.bind(this);
	    this.onCancel = this.onCancel.bind(this);

	}

	onDelete() {

		this.setState({progress: true});

	    this.serverRequest = 
	      axios
	        .delete("http://localhost:1880/api/v2/rh/funcionario/" + this.props.id, {page: 1, per_page: 10})
	        .then(function(result) {   

	        	this.setState({progress: false}, this.props.onDelete.bind(null, this.props.id));

	        }.bind(this))
	        .catch(function(err) {
	        	this.setState({progress: false});
	        	alert(err);
	        }.bind(this))    

	}

	onCancel() {
		this.props.onCancel();
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
				      onTouchTap={this.onDelete.bind(this)} 
				      primary={true}
				      icon={<IconSave />} />

				</Dialog>

			</div>
			</MuiThemeProvider>
		);
	}	
}