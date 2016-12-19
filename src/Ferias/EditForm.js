import React, { Component } from 'react';

import uuid from 'node-uuid';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	MenuItem  
} from 'material-ui';

import IconSave from 'material-ui/svg-icons/action/done';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Formsy from 'formsy-react';
import { 
	FormsyDate, 
    FormsyText, 
    FormsyToggle 
} from 'formsy-material-ui/lib';

import axios from 'axios';

export default class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			canSubmit: false,
			progress: false,
			funcionarios: [],
		}

		//this.onStartDateChange = this.onStartDateChange.bind(this);
		//this.onEndDateChange = this.onEndDateChange.bind(this);
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

	onLoad(load) {

		if (this.props.id) {

			var _this = this;
		    this.serverRequest = 
		      axios
		        .get("http://localhost:1880/api/rh/ferias/item/" + _this.props.id, {
		        	page: 1,
		        	per_page: 1
		        })
		        .then(function(result) {   

					_this.setState(result.data);
		        })
		        .cath(function(err) {
		        	console.log(err);
		        })

		}

		/*this.funcionarios = [];
		this.ferias = {};

		if (load === 'funcionarios') {

			console.log('Carregando Funcionarios...');

			this.setState({progress: true});

			this.params = {
		        TableName: this.props.config.table,
		        IndexName: 'type-id-index',
		        KeyConditionExpression: "#pk = :pk",   
		        ExpressionAttributeNames: {
		        	"#pk": "type"
		        },
		        ExpressionAttributeValues: { 
		        	":pk": 'Funcionario'
		        },
		        Projection: 'id, nome',
		        ExclusiveStartKey: this.state.LastEvaluatedKey || null,
		        Limit: 10
		    }

			var result = function(err, data) {
				const context = this;

		        if (err) {
		            console.log("Unable to query for Form Definition. Error:", JSON.stringify(err, null, 2));
		        } else {
		            //console.log("Query for Form Definition succeeded.");
		            
		            if (data.Count > 0) {
		              	console.log('Found records: ' + data.Count); 

		              	data.Items.forEach(function(v, k, a) {

							var addAndSort = function(arr, val) {
							    arr.push(val);
							    var i = arr.length - 1;
							    var item = arr[i].nome
					            try {
								    while (i > 0 && item <= arr[i-1].nome) {
								        arr[i] = arr[i-1];
								        i -= 1;
								    }
							    } catch(err) {
							    	console.log(err);
							    }
							    arr[i] = val;
							    return arr;
							}

							context.funcionarios = addAndSort(context.funcionarios, v);	
						})

		            }
		            if (data.LastEvaluatedKey && context.items.length < context.params.Limit) {
		              	context.params.ExclusiveStartKey = data.LastEvaluatedKey;
		              	dynamodb.query(context.params, result.bind(context))
		            } else {
		            	this.onLoad('ferias').bind(context);
		            }
		        }

		    }

		    dynamodb.query(this.params, result.bind(this));
		

		} else if (load === 'ferias1' && this.props.id) {*/

			console.log('Carregando Ferias...');

			this.setState({progress: true});

			/*this.params = {
		        TableName: this.props.config.table,
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
		            this.setState({progress: false});
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
							newState.inicial = new Date(utc.year(), utc.month(), utc.date(), 0, 0, 0);

							const utc2 = moment.utc(data.Items[0].final);
							newState.final = new Date(utc2.year(), utc2.month(), utc2.date(), 0, 0, 0);

							newState.progress = false;

			            	this.setState(newState);
					    }	

		            }
		        }

		    }

			const dynamodb = new aws.DynamoDB.DocumentClient();    

		    dynamodb.query(this.params, result.bind(this));
		/*}*/
	}

	onClose() {
		this.props.onClose();
	}

	/*onStartDateChange(n, date) {
		var inicial = moment.utc(date);
		var final = moment.utc(this.refs.form.inputs[2].getValue());
		this.refs.form.inputs[4].setState({value: final.diff(inicial, 'days')});
	}

	onEndDateChange(n, date) {
		var inicial = moment.utc(this.refs.form.inputs[1].getValue());
		var final = moment.utc(date);
		this.refs.form.inputs[4].setState({value: final.diff(inicial, 'days')});
	}*/

	onSave(callback) {	
		this.refs.form.submit();
	}

	onSearch() {
		this.setState({search: true});
	}

	onSelect() {
		this.setState({search: false});
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

		/*var params = {
	        'TableName': this.props.config.table,
	        'Item': {
	        	id: this.props.id || uuid.v4(),
	        	type: 'Ferias',
	        	empresa: data.empresa,
	        	funcionario: data.funcionario,
	        	inicial: moment.utc(data.inicial).toJSON().substr(0, 10),
	        	final: moment.utc(data.final).toJSON().substr(0, 10),
	        	dias: data.dias,
	        	realizado: data.realizado
	        }
	    }

	    var result = function(err, data) {
	    	var context = this; 
	    	if (err) {
	    		console.log('Erro on create/update.');
	    		alert('Erro ao gravar os dados: ' + err);
	    	} else {
	    		console.log('Create/update OK.');
	    		//alert('Dados gravados com sucesso !');
	    		if (context.props.onClose) context.props.onClose();
	    	}
	    	//this.setState({progress: false});
	    }
		
		const dynamodb = new aws.DynamoDB.DocumentClient();    

	    dynamodb.put(params, result.bind(this));	*/
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

		const funcionarios = [];
		this.state.funcionarios.forEach(function(v, k, a) {
			funcionarios.push(<MenuItem key={uuid.v4()} value={v} primaryText={v.nome} />)
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
				    	{/*<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconDelete />
					    	</FloatingActionButton>
					    </div>
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
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
			            onValidSubmit={this.submitForm}
			            onInvalidSubmit={this.notifyFormError}
			            ref='form'
			          >
			          	{/*<FormsySelect
			              name="empresa"
			              required
			              floatingLabelText="Empresa"
			              value={this.state.empresa}
			              fullWidth={true}
			            >
			              <MenuItem value={'Altamira'} primaryText="Altamira" />
			              <MenuItem value={'Tecnequip'} primaryText="Tecnequip" />
			              <MenuItem value={'Proalta'} primaryText="Proalta" />
			            </FormsySelect>*/}
			          	<FormsyText
			              name="funcionario"
			              validations="isWords"
			              validationError={wordsError}
			              required
			              readOnly
			              hintText="Nome do funcionário"
			              floatingLabelText="Nome do Funcionário"
			              fullWidth={true} 
			              value={this.state.funcionario ? this.state.funcionario.nome : ''}
			            />
			            {/*<FormsySelect
			              name="funcionario"
			              required
			              floatingLabelText="Funcionário"
			              value={this.state.funcionario}
			              fullWidth={true}
			            >
			              {funcionarios}
			            </FormsySelect>  */}
			            <FormsyDate
			              key="inicial"
			              name="inicial"
			              required
			              floatingLabelText="Data Inicial"
			              value={this.state.inicial}
			            />
			            <FormsyDate
			              key="final"
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
			              required
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