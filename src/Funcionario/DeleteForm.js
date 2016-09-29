import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	//AppBar, 
	//LinearProgress, 
	//FloatingActionButton, 
	//TextField, 
	//SelectField, 
	//RaisedButton, 
	//MenuItem,
	//List,
	//ListItem,
	FlatButton
} from 'material-ui';

//import IconDelete from 'material-ui/svg-icons/action/delete';
//import IconAdd from 'material-ui/svg-icons/content/add';
import IconSave from 'material-ui/svg-icons/action/done';
//import IconSearch from 'material-ui/svg-icons/action/search';
import IconExit from 'material-ui/svg-icons/navigation/close';

//import Formsy from 'formsy-react';
import { 
	//FormsyCheckbox, 
	//FormsyDate, 
	//FormsyRadio, 
	//FormsyRadioGroup,
    //FormsySelect, 
    //FormsyText, 
    //FormsyTime, 
    //FormsyToggle 
} from 'formsy-material-ui/lib';

//import Funcionario from './Funcionario';
//import FuncionarioItem from './FuncionarioItem';

import 'aws-sdk/dist/aws-sdk';

const aws = window.AWS;

export default class Ferias extends Component {
	constructor(props) {
		super(props);

		this.state = {
			progress: false,
		}

	    this.onDelete = this.onDelete.bind(this);
	    this.onCancel = this.onCancel.bind(this);

	    aws.config.update({accessKeyId: this.props.config.accessKeyId, secretAccessKey: this.props.config.secretAccessKey, region: this.props.config.region});
	}

	onDelete() {

		console.log('Carregando Funcionarios...');

		this.setState({progress: true});

		this.params = {
	        TableName: this.props.config.table,
	        Key: {
	        	id: this.props.id,
	        	type: this.props.type
	        }
	    }

		var result = function(err, data) {

	        if (err) {
	            console.log("Unable to query for Form Definition. Error:", JSON.stringify(err, null, 2));
	        } else {
	        	console.log(this.props.type + ' excluido com sucesso !');
	            if (this.props.onDelete) this.props.onDelete(this.props.id);
	        }

	    }

		const dynamodb = new aws.DynamoDB.DocumentClient();    

	    dynamodb.delete(this.params, result.bind(this));
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