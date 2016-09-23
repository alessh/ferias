import React, { Component } from 'react';

import uuid from 'node-uuid';
//import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { 
	Dialog, 
	AppBar, 
	LinearProgress, 
	FloatingActionButton, 
	//TextField, 
	//SelectField, 
	//RaisedButton, 
	//MenuItem,
	List,
	//ListItem,
	FlatButton
} from 'material-ui';

//import IconDelete from 'material-ui/svg-icons/action/delete';
import IconAdd from 'material-ui/svg-icons/content/add';
//import IconSave from 'material-ui/svg-icons/action/done';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconExit from 'material-ui/svg-icons/navigation/close';

import Formsy from 'formsy-react';
import { 
	//FormsyCheckbox, 
	//FormsyDate, 
	//FormsyRadio, 
	//FormsyRadioGroup,
    //FormsySelect, 
    FormsyText, 
    //FormsyTime, 
    //FormsyToggle 
} from 'formsy-material-ui/lib';

import Funcionario from './Funcionario';
import FuncionarioItem from './FuncionarioItem';

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

const table = 'altamira';

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();    

function toPrettyCase(str)
{
    return str.replace(/\w\S*/g, function(txt){
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

export default class FuncionarioList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			progress: false,
			nome: '',
			items: [],
			LastEvaluatedKey: null
		}

	    this.onChange = this.onChange.bind(this);
	    this.onSearch = this.onSearch.bind(this);
	    this.onDone = this.onDone.bind(this);

	    // Edit Form Actions
	    this.onOpen = this.onOpen.bind(this);
	    this.onClose = this.onClose.bind(this);
	    this.onSave = this.onSave.bind(this);
	    this.onDelete = this.onDelete.bind(this);
	}

	componentDidMount() {
		//this.onSearch();
	}

	onSearch() {

		console.log('Carregando Funcionarios...');

		this.setState({progress: true});

		this.params = {
	        TableName: table,
	        IndexName: 'type-id-index',
	        KeyConditionExpression: "#pk = :pk",   
	        ExpressionAttributeNames: {
	        	"#pk": "type",
	        	"#nm": "nome"
	        },
	        ExpressionAttributeValues: { 
	        	":pk": 'Funcionario',
	        	":nm": toPrettyCase(this.state.nome)
	        },
	        FilterExpression: 'begins_with(#nm, :nm)',
	        Projection: 'id, nome',
	        ExclusiveStartKey: this.state.LastEvaluatedKey || null,
	        Limit: 5
	    }

	    this.items = this.state.LastEvaluatedKey ? this.state.items : [];

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

						context.items = addAndSort(context.items, v);	
					})

	            }
	            if (data.LastEvaluatedKey && context.items.length < context.params.Limit) {
	              	context.params.ExclusiveStartKey = data.LastEvaluatedKey;
	              	dynamodb.query(context.params, result.bind(context))
	            	this.setState({LastEvaluatedKey: data.LastEvaluatedKey});
	            } else {
	            	this.setState({items: context.items, progress: false, LastEvaluatedKey: data.LastEvaluatedKey});
	            }
	        }

	    }

	    dynamodb.query(this.params, result.bind(this));
	}

	onDone() {
		this.props.onClose();
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		this.setState({open: false});
	}

	onSave(value) {
		var index = this.state.items.findIndex(function(e, i ,a) {
			return e.id === value.id;
		})
		if (index >= 0) {
			var items = this.state.items;
			items[index] = value;
			this.setState({open: false, items: items});
		} else {
			this.setState({open: false});
		}
	}

	onDelete(id) {
		var index = this.state.items.findIndex(function(e, i ,a) {
			return e.id === id;
		})
		if (index >= 0) {
			var items = this.state.items;
			items.splice(index, 1);
			this.setState({open: false, items: items});
		} else {
			this.setState({open: false});
		}	
	}

	onChange(event) {	
		this.setState({nome: toPrettyCase(event.target.value), LastEvaluatedKey: null, items: []});
	}

	errorMessages= {
		wordsError: "Use somente letras"
	}

	render() {
		const items = [];
		const context = this;
		this.state.items.forEach(function(v, k, a) {
			items.push(<FuncionarioItem key={uuid.v4()} id={v.id} nome={v.nome} onClose={context.onClose.bind(context)} onSave={context.onSave.bind(context)} onDelete={context.onDelete.bind(context)} />)
		})
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

			    	<AppBar title={'Cadastro de Funcionário'} >
				    	{/*<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} >
					      		<IconDelete />
					    	</FloatingActionButton>
					    </div>*/}
				    	<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onOpen.bind(this)} >
					      		<IconAdd />
					    	</FloatingActionButton>
					    </div>
				    	{/*<div style={{marginRight: 20, top: 35, position: 'relative', zIndex: 1200}} >
							<FloatingActionButton onTouchTap={this.onSave.bind(this)} disabled={!this.state.canSubmit} >
					      		<IconSave />
					    	</FloatingActionButton>
					    </div>*/}
					    <div style={{top: 35, position: 'relative', zIndex: 1200}}>
							<FloatingActionButton onTouchTap={this.onDone.bind(this)} >
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
					    <div style={{display: 'inline-block', marginTop: 50, width: '100%'}}>
					    	<FormsyText 
								name="nome"
								validations="isWords"
								validationError={wordsError}
								required
								hintText="Nome do funcionário"
								floatingLabelText="Nome do Funcionário"
								fullWidth={true} 
								onChange={this.onChange.bind(this)}
								value={this.state.nome}
								style={{width: '93%'}}
				            />

				    		<FloatingActionButton onTouchTap={this.onSearch.bind(this)} mini={true} disabled={!(this.state.nome && this.state.nome.trim().length > 0)} >
					      		<IconSearch />
					    	</FloatingActionButton>
						</div>
				    </Formsy.Form>

					<List style={{marginTop: 50}}>
	      				{items}
	    			</List>

	    			{ this.state.open ? 
	    				(
	    					<Funcionario onClose={this.onClose.bind(this)} onSave={this.onSave.bind(this)} onDelete={this.onDelete.bind(this)} label={'Novo Funcionário'} />
	    				) : (<p></p>)
	    			}

	    			{ this.state.LastEvaluatedKey && this.state.items.length > 0 ? 
	    				(
	    					<FlatButton
						      label="continuar"
						      labelPosition="before"
						      onTouchTap={this.onSearch.bind(this)} 
						      primary={true}
						      icon={<IconAdd />}
						    />
	    				) : (<p></p>)}

				</Dialog>

			</div>
			</MuiThemeProvider>
		);
	}	
}