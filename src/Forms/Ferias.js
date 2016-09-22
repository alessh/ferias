import React, { Component } from 'react';

import uuid from 'node-uuid';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	//TextField, 
	//SelectField, 
	//RaisedButton, 
	MenuItem 
} from 'material-ui';

import IconDelete from 'material-ui/svg-icons/action/delete';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Formsy from 'formsy-react';
import { 
	//FormsyCheckbox, 
	FormsyDate, 
	//FormsyRadio, 
	//FormsyRadioGroup,
    FormsySelect, 
    FormsyText, 
    //FormsyTime, 
    FormsyToggle 
} from 'formsy-material-ui/lib';

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

const table = 'altamira';

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();    

export default class Ferias extends Component {
	constructor(props) {
		super(props);

		this.state = {
			canSubmit: false,
			progress: false,
		}

		this.onChange = this.onChange.bind(this);
	    this.onSave = this.onSave.bind(this);
	    this.onClose = this.onClose.bind(this);
	    this.enableButton = this.enableButton.bind(this);
	    this.disableButton = this.disableButton.bind(this);
	    this.submitForm = this.submitForm.bind(this);
	    this.notifyFormError = this.notifyFormError.bind(this);

	    this.onLoad = this.onLoad.bind(this);


	}

	componentDidMount() {
		this.onLoad();
	}

	onLoad() {
		if (this.props.id) {

			this.setState({progress: true});

			this.params = {
		        TableName: table,
		        KeyConditionExpression: "#pk = :pk and #sk = :sk",   
		        ExpressionAttributeNames: {
		        	"#pk": "id",
		            "#sk": "type"
		        },
		        ExpressionAttributeValues: { 
		        	":pk": this.props.id,
		            ":sk": 'Ferias'
		        },
		        ExclusiveStartKey: null,
		        Limit: 1
		    }

			var result = function(err, data) {
				//const context = this;
		        //console.log(data)
		        if (err) {
		            console.log("Unable to query for Form Definition. Error:", JSON.stringify(err, null, 2));
		        } else {
		            //console.log("Query for Form Definition succeeded.");
		            
		            if (data.Count > 0) {
		              	console.log('Found Form Data: ' + this.props.id); 

		              	var newState = this.state;

					    if (data.Items[0]) {
					    	Object.keys(data.Items[0]).forEach(function(key) {
						    	newState[key] = data.Items[0][key];
					      	})

							const utc = moment.utc(data.Items[0].inicial);
							newState.inicial = new Date(utc.year(), utc.month(), utc.date(), utc.toDate().getTimezoneOffset() / 60, 0, 0);

							const utc2 = moment.utc(data.Items[0].final);
							newState.final = new Date(utc2.year(), utc2.month(), utc2.date(), utc2.toDate().getTimezoneOffset() / 60, 0, 0);

							newState.progress = false;

			            	this.setState(newState);
					    }	

		            }
		        }

		    }

		    dynamodb.query(this.params, result.bind(this));
		}
	}

	onClose() {
		this.props.onClose();
	}

	onChange(path, value) {
		var newState = this.state;
		newState[path] = value;
		this.setState(newState);
	}

	onSave(callback) {	
		this.refs.form.submit();
	}

	errorMessages= {
		wordsError: "Use somente letras",
		numericError: "Use somente números",
		urlError: "Please provide a valid URL",
	}

	styles= {
		/*paperStyle: {
			width: 300,
			margin: 'auto',
			padding: 20,
		},*/
		switchStyle: {
			marginBottom: 16,
		},
		/*submitStyle: {
			marginTop: 32,
		},*/
	}

	enableButton() {
		this.setState({
			canSubmit: true,
		});
	}

	disableButton() {
		this.setState({
			canSubmit: false,
		});
	}

	submitForm(data) {
		if (this.state.progress) {
			console.log('request in progress.');
			return;
		}

	    this.setState({progress: true});

		//alert(JSON.stringify(data, null, 4));

		var params = {
	        'TableName': table,
	        'Item': {
	        	id: this.props.id || uuid.v4(),
	        	type: 'Ferias',
	        	empresa: data.empresa,
	        	nome: data.nome,
	        	inicial: data.inicial.getTimezoneOffset() > 0 ? moment(data.inicial).subtract(data.inicial.getTimezoneOffset() / 60, 'h').toJSON() : moment(data.inicial).add(data.inicial.getTimezoneOffset() / 60, 'h').toJSON(),
	        	final: data.final.getTimezoneOffset() > 0 ? moment(data.final).subtract(data.final.getTimezoneOffset() / 60, 'h').toJSON() : moment(data.final).add(data.final.getTimezoneOffset() / 60, 'h').toJSON(),
	        	dias: data.dias,
	        	realizado: data.realizado
	        }
	    }

	    var result = function(err, data) {
	    	if (err) {
	    		console.log('Erro on create/update.');
	    		alert('Erro ao gravar os dados: ' + err);
	    	} else {
	    		console.log('Create/update OK.');
	    		//alert('Dados gravados com sucesso !');
	    		if(this.props.onClose) this.props.onClose();
	    	}
	    	//this.setState({progress: false});
	    }

	    dynamodb.put(params, result.bind(this));	
	}

	notifyFormError(data) {
		console.error('Form error:', data);
	}

	render() {
		let { 
			//paperStyle, 
			switchStyle, 
			//submitStyle 
		} = this.styles;
    	let { 
    		wordsError, 
    		numericError, 
    		//urlError 
    	} = this.errorMessages;

		const items = [];
		items.forEach(function(v, k, a) {
			items.push(<MenuItem key={uuid.v4()} value={v.id} primaryText={v.text} />)
		})
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

			    	<AppBar title={'Controle de Férias'} >
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconDelete />
					    	</FloatingActionButton>
					    </div>
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconAdd />
					    	</FloatingActionButton>
					    </div>
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}} >
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} disabled={!this.state.canSubmit} >
					      		<IconSave />
					    	</FloatingActionButton>
					    </div>
					    <div style={{top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onClose.bind(this)} >
					      		<IconExit />
					    	</FloatingActionButton>
					    </div>
				    </AppBar>

				    <LinearProgress mode="indeterminate" style={{marginTop: '3px', visibility: this.state.progress ? 'visible' : 'hidden'}} />

					<Formsy.Form
			            onValid={this.enableButton}
			            onInvalid={this.disableButton}
			            onValidSubmit={this.submitForm}
			            onInvalidSubmit={this.notifyFormError}
			            ref='form'
			          >
			          	<FormsySelect
			              name="empresa"
			              required
			              floatingLabelText="Empresa"
			              value={this.state.empresa}
			            >
			              <MenuItem value={'Altamira'} primaryText="Altamira" />
			              <MenuItem value={'Tecnequip'} primaryText="Tecnequip" />
			              <MenuItem value={'Proalta'} primaryText="Proalta" />
			            </FormsySelect>
			          	<FormsyText
			              name="nome"
			              validations="isWords"
			              validationError={wordsError}
			              required
			              hintText="Nome do funcionário"
			              floatingLabelText="Nome do Funcionário"
			              fullWidth={true} 
			              value={this.state.nome}
			            />          
			            <FormsyDate
			              name="inicial"
			              required
			              floatingLabelText="Data Inicial"
			              value={this.state.inicial}
			            />
			            <FormsyDate
			              name="final"
			              required
			              floatingLabelText="Data Final"
			              value={this.state.final}
			            />
			            {/*<FormsyTime
			              name="time"
			              required
			              floatingLabelText="Time"
			            />
			            <FormsyCheckbox
			              name="agree"
			              label="Do you agree to disagree?"
			              style={switchStyle}
			            />*/}
			            <FormsyToggle
			              name="realizado"
			              label="Realizado"
			              style={switchStyle}
			              value={this.state.realizado}
			            />
			            {/*<FormsyRadioGroup name="shipSpeed" defaultSelected="not_light">
			              <FormsyRadio
			                value="light"
			                label="prepare for light speed"
			                style={switchStyle}
			              />
			              <FormsyRadio
			                value="not_light"
			                label="light speed too slow"
			                style={switchStyle}
			              />
			              <FormsyRadio
			                value="ludicrous"
			                label="go to ludicrous speed"
			                style={switchStyle}
			                disabled={true}
			              />
			            </FormsyRadioGroup>
			            <FormsyText
			              name="name"
			              validations="isWords"
			              validationError={wordsError}
			              required
			              hintText="What is your name?"
			              floatingLabelText="Name"
			            />*/}
			            <FormsyText
			              name="dias"
			              validations="isNumeric"
			              validationError={numericError}
			              hintText="Dias de direito"
			              floatingLabelText="Dias de direito"
			              value={this.state.dias}
			            />
			            {/*<FormsyText
			              name="url"
			              validations="isUrl"
			              validationError={urlError}
			              required
			              hintText="http://www.example.com"
			              floatingLabelText="URL"
			            />
			            <RaisedButton
			              style={submitStyle}
			              type="submit"
			              label="Submit"
			              disabled={!this.state.canSubmit}
			            />*/}
			        </Formsy.Form>

				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}