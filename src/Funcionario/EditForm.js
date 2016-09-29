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
//import IconAdd from 'material-ui/svg-icons/content/add';
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
    //FormsyToggle 
} from 'formsy-material-ui/lib';

import DeleteForm from './DeleteForm';
//import SearchForm from './SearchForm';

import axios from 'axios';

function toPrettyCase(str)
{
    return !str ? '' : str.replace(/\w\S*/g, function(txt){
    	switch(txt.toLowerCase()) {
    		case 'da':
    		case 'do':
    		case 'de':
    		case 'e':
    		case 'das':
    		case 'dos':
    			return txt.toLowerCase();
    		default:
    			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	}
    });
}

export default class Funcionario extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			search: false,
			progress: false,
		}

		//this.onChange = this.onChange.bind(this);
		this.onOpen = this.onOpen.bind(this);
	    this.onSave = this.onSave.bind(this);
	    this.onDelete = this.onDelete.bind(this);
	    this.onClose = this.onClose.bind(this);
	    this.onCancel = this.onCancel.bind(this);
	    this.enableButton = this.enableButton.bind(this);
	    this.disableButton = this.disableButton.bind(this);
	    this.onSubmit = this.onSubmit.bind(this);
	    this.notifyFormError = this.notifyFormError.bind(this);

	    this.onLoad = this.onLoad.bind(this);

	}

	componentDidMount() {
		this.onLoad();
	}

	onLoad() {

		if (this.props.id) {


			var _this = this;
		    this.serverRequest = 
		      axios
		        .get("http://sistema/api/rh/ferias/item/" + this.props.id, {
		        	page: 1,
		        	per_page: 1
		        })
		        .then(function(result) {   

					_this.setState({
		            	items: result.data
		          	});
		        })

		        return;

			console.log('Carregando Funcionario...');

			this.setState({progress: true});

			this.params = {
		        TableName: this.props.config.table,
		        KeyConditionExpression: "#pk = :pk and #sk = :sk",   
		        ExpressionAttributeNames: {
		        	"#pk": "id",
		            "#sk": "type"
		        },
		        ExpressionAttributeValues: { 
		        	":pk": this.props.id,
		            ":sk": 'Funcionario'
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
		              	console.log('Found records: ' + data.Count); 

		              	var newState = this.state;

					    if (data.Items[0]) {
					    	Object.keys(data.Items[0]).forEach(function(key) {
						    	newState[key] = data.Items[0][key];
					      	})

							const utc = moment.utc(data.Items[0].inicial);
							newState.inicial = new Date(utc.year(), utc.month(), utc.date(), utc.toDate().getTimezoneOffset() / 60, 0, 0);

							newState.progress = false;

			            	this.setState(newState);
					    }	

		            }
		        }

		    }

			const dynamodb = new aws.DynamoDB.DocumentClient();    

		    dynamodb.query(this.params, result.bind(this));
		}
	}

	/*onChange(currentValues, isChanged, path) {
		var newState = this.state;
		if (path === 'nome') value = toPrettyCase(value);
		newState[path] = value;
		this.setState(newState);
	}*/

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		this.props.onClose();
	}

	onSave(callback) {	
		this.refs.form.submit();
	}

	onDelete(id) {
		if (this.props.onDelete)
			this.props.onDelete(id)
		else
			this.setState({open: true});
	}

	onCancel() {
		this.setState({open: false});
	}

	onSearch() {
		this.setState({search: true})
	}

	onSelect(funcionario) {
		this.setState({search: false})
	}

	errorMessages= {
		wordsError: "Use somente letras",
		numericError: "Use somente números",
		urlError: "Please provide a valid URL",
	}

	/*
	styles= {
		/*paperStyle: {
			width: 300,
			margin: 'auto',
			padding: 20,
		},
		switchStyle: {
			marginBottom: 16,
		},
		submitStyle: {
			marginTop: 32,
		},
	}*/

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

	onSubmit(data) {
		if (this.state.progress) {
			console.log('request in progress.');
			return;
		}

	    this.setState({progress: true});

		//alert(JSON.stringify(data, null, 4));

		/*this.params = {
	        'TableName': table,
	        'Item': {
	        	id: this.props.id || uuid.v4(),
	        	type: 'Funcionario',
	        	empresa: data.empresa,
	        	nome: toPrettyCase(data.nome),
	        	inicial: data.inicial.getTimezoneOffset() > 0 ? moment(data.inicial).subtract(data.inicial.getTimezoneOffset() / 60, 'h').toJSON() : moment(data.inicial).add(data.inicial.getTimezoneOffset() / 60, 'h').toJSON(),
	        	situacao: data.situacao
	        }
	    }*/

	    this.id = this.props.id || uuid.v4();

	    this.item = {
					        	id: this.id,
					        	type: 'Funcionario',
					        	empresa: data.empresa,
					        	nome: toPrettyCase(data.nome),
					        	inicial: moment.utc(data.inicial).toJSON().substr(0, 10),
					        	situacao: data.situacao
					        }

	    this.params = {
	    	RequestItems: {
	    		[this.props.config.table]: [
			    	{  
		                PutRequest: {
		                    Item: this.item
		                }
		            }
	    		]
	    	}
	    }

	    this.inicial = moment.utc(data.inicial);

	    while(this.inicial.diff(moment.utc(), 'days') < 0) {
	    	var final = this.inicial.clone().add(1, 'year').subtract(1, 'day');

			this.params.RequestItems.altamira.push({  
                PutRequest: {
                    Item: {
			        	id: uuid.v4(),
			        	type: 'Ferias',
			        	funcionario: {
			        		id: this.id,
					        type: 'Funcionario',
					        empresa: data.empresa,
					        nome: toPrettyCase(data.nome),
					        inicial: moment.utc(data.inicial).toJSON().substr(0, 10),
					        situacao: data.situacao
					    },
			        	inicial: this.inicial.toJSON().substr(0, 10),
			        	final: final.toJSON().substr(0, 10),
			        	dias: 30,
			        	realizado: false
			        }
                }
            });	

            this.inicial.add(1, 'year');    	
	    }


	    var result = function(err, data) {
	    	var context = this; 
	    	if (err) {
	    		console.log('Erro ao gravar os dados: ' + err);
	    		alert('Erro ao gravar os dados: ' + err);
	    	} else {
	    		console.log('Funcionario gravado OK.');
	    		//alert('Dados gravados com sucesso !');
	    		if (context.props.onSave) context.props.onSave(context.item);
	    	}
	    	//this.setState({progress: false});
	    }

		const dynamodb = new aws.DynamoDB.DocumentClient();    

	    dynamodb.batchWrite(this.params, result.bind(this));	
	}

	notifyFormError(data) {
		console.error('Form error:', data);
	}

	render() {
		/*let { 
			//paperStyle, 
			//switchStyle, 
			//submitStyle 
		} = this.styles;*/
    	let { 
    		wordsError, 
    		//numericError, 
    		//urlError 
    	} = this.errorMessages;

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

			    	<AppBar title={this.props.label} >
				    	{ this.props.id ? (
				    		<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
								<FloatingActionButton onTouchTap={this.onOpen.bind(this)} >
						      		<IconDelete />
						    	</FloatingActionButton>
						    </div>
						) : (null)}

				    	{/*<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconAdd />
					    	</FloatingActionButton>
					    </div>*/}
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
			            onValidSubmit={this.onSubmit}
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
			              value={toPrettyCase(this.state.nome)}
			            /> 
			            <FormsyDate
			              name="inicial"
			              required
			              floatingLabelText="Data Admissão ou Data Inicial"
			              hintText="Data Admissão ou Data Inicial"
			              value={this.state.inicial}
			            />
			            {/*<FormsyDate
			              name="final"
			              required
			              floatingLabelText="Data Demissão/Data Final"
			              value={this.state.final}
			            />
			            <FormsyTime
			              name="time"
			              required
			              floatingLabelText="Time"
			            />
			            <FormsyCheckbox
			              name="agree"
			              label="Do you agree to disagree?"
			              style={switchStyle}
			            />*/}
			            {/*<FormsyToggle
			              name="demitido"
			              label="Demitido"
			              style={switchStyle}
			              value={this.state.demitido}
			            />*/}
			            <FormsySelect
			              name="situacao"
			              required
			              floatingLabelText="Situação"
			              hintText="Situação"
			              value={this.state.situacao}
			            >
			              <MenuItem value={'ativo'} primaryText="Ativo" />
			              <MenuItem value={'afastado'} primaryText="Afastado" />
			              <MenuItem value={'demitido'} primaryText="Demitido" />
			            </FormsySelect>
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
			            />
			            <FormsyText
			              name="dias"
			              validations="isNumeric"
			              validationError={numericError}
			              hintText="Dias de direito"
			              floatingLabelText="Dias de direito"
			              value={this.state.dias}
			            />
			            <FormsyText
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

			        { this.state.open ? (<DeleteForm id={this.props.id} type={'Funcionario'} label={(<div><p>Tem certeza de excluir este Funcionario ?</p><p>{this.state.nome}</p></div>)} onDelete={this.onDelete.bind(this)} onCancel={this.onCancel.bind(this)} />) : (null) }

				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}