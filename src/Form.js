import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, IconMenu, IconButton, MenuItem, RaisedButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import uuid from 'node-uuid';

import Name from './Name';
import Code from './Code';
import Textbox from './Textbox';
import Datetime from './Datetime';
import Select from './Select';
import Toggle from './Toggle';

import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

const table = 'altamira';

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();

export default class Form extends Component {
	constructor(props) {
		super(props);

	    this.state = {
	    	id: this.props.id || uuid.v4(),
	    	cid: this.props.cid || (this.props.type || 'r') + ':' + this.props.class,
	    	type: this.props.type || 'r',
	    	class: this.props.class,
	    	label: this.props.label || '',
	    	fields: [],  // field definitions
	    	form: {
	    		fields: []  // form fields
	    	},
	    	event: {
		    	publish: function (event, data) {
			        if (!this._events[event]) return; // no one is listening to this event
			        for (var i = 0; i < this._events[event].length; i++)
			            this._events[event][i](data);
			    },
			    subscribe: function (event, callback) {
			      	if (!this._events[event]) this._events[event] = []; // new event
			      	this._events[event].push(callback);
			    },
			    _events: {}
			}
	    }

	    this.onChange = this.onChange.bind(this);
	    this.onSave = this.onSave.bind(this);

	    this.state.event.subscribe('onChange', this.onChange);
	}

	componentWillMount() {
		const definition_id = '00000000-0000-0000-0000-000000000000'; // model id

		this.params = {
	        TableName: table,
	        KeyConditionExpression: "#pk = :pk and #sk = :sk",   
	        ExpressionAttributeNames: {
	        	"#pk": "id",
	            "#sk": "cid"
	        },
	        ExpressionAttributeValues: { 
	        	":pk": this.props.id || definition_id,
	            ":sk": this.state.cid
	        },
	        ExclusiveStartKey: null,
	        Limit: 1
	    }

		var result = function(err, data) {
			const context = this;
	        //console.log(data)
	        if (err) {
	            console.log("Unable to query for Form Definition. Error:", JSON.stringify(err, null, 2));
	        } else {
	            //console.log("Query for Form Definition succeeded.");
	            
	            if (data.Count > 0) {
	              	console.log('Found Form Definition: ' + this.state.id + ':' + this.state.cid); 

	              	var fields = [];

	              	const style = {
	              		field: {
							marginLeft: '10px',
							marginRight: '10px'
						}
	              	}

				    if (data.Items[0].fields) Object.keys(data.Items[0].fields).forEach(function(key) {
				    	var v = data.Items[0].fields[key];
				      	console.log('Loading field ' + v.type + ':' + v.class + ':' + v.path)
				      	switch(v.class) {
				      		case 'org.com.br.empresa':
				      			fields.push(
				      				<div key={uuid.v4()} style={style.field}>
				      					<Select 
				      						id={context.state.id} 
				      						key={uuid.v4()} 
				      						event={context.state.event} 
				      						floatingLabelText={v.label}
				  							floatingLabelFixed={true}
				      						hintText={v.label}
				      						style={style.field}
				      						{...v} 
										/>
				          			</div>
				          		);
				      			break;
				      		case 'id.gov.br.cei':
				      		case 'id.gov.br.cnpj':
				      		case 'id.gov.br.ie':
				      		case 'id.cod.codigo':
				      			fields.push(
				      				<div key={uuid.v4()} style={style.field}>
				      					<Code 
				      						id={context.state.id} 
				      						key={uuid.v4()} 
				      						event={context.state.event} 
				      						floatingLabelText={v.label}
				  							floatingLabelFixed={true}
				      						hintText={v.label}
				      						style={style.field}
				      						{...v} 
										/>
				          			</div>
				          		);
				      			break;
				      		case 'id.nom.nome':
				      		case 'loc.geo.br.estado':
				      		case 'loc.geo.br.bairro':
				      		case 'loc.geo.br.cep':
				      		case 'cla.gov.br.cnae':
				      		case 'cla.tipo.empresa.porte':
				      			fields.push(
				      				<div key={uuid.v4()} style={style.field}>
				      					<Name 
				      						id={context.state.id} 
				      						key={uuid.v4()} 
				      						event={context.state.event} 
				      						floatingLabelText={v.label}
				  							floatingLabelFixed={true}
				      						hintText={v.label}
				      						style={style.field}
				      						{...v} 
				      					/>
				      				</div>
				      			);
				      			break;
				      		case 'tm.dt.admissao':
				      		case 'tm.dt.inicial':
				      		case 'tm.dt.final':
				      			fields.push(
				      				<div key={uuid.v4()} style={style.field}>
				      					<Datetime 
				      						id={context.state.id} 
				      						key={uuid.v4()} 
				      						event={context.state.event} 
				      						floatingLabelText={v.label}
				  							floatingLabelFixed={true}
				      						hintText={v.label}
				      						style={style.field}
				      						{...v} 
				      					/>
				      				</div>
				      			);
				      			break;	
				      		case 'med.tempo.dias':
				      			fields.push(
				      				<div key={uuid.v4()} style={style.field}>
				      					<Textbox 
				      						id={context.state.id} 
				      						key={uuid.v4()} 
				      						event={context.state.event} 
				      						floatingLabelText={v.label}
				  							floatingLabelFixed={true}
				      						hintText={v.label}
				      						style={style.field}
				      						{...v} 
				      					/>
				      				</div>
				      			);				      		
				      			break;     
				      		case 'inf.types.toogle':
				      			fields.push(
				      				<div key={uuid.v4()} style={style.field}>
										<Toggle
											id={context.state.id} 
				      						key={uuid.v4()} 
				      						event={context.state.event} 
				      						floatingLabelText={v.label}
				  							floatingLabelFixed={true}
				      						hintText={v.label}
				      						style={style.field}	
				      						{...v} 							      	
									    />	
									</div>
								);			      		
				      			break;         			
				      		default:
				      			fields.push(
				      				<div key={uuid.v4()} style={style.field}>
				      					<Textbox 
				      						id={context.state.id} 
				      						key={uuid.v4()} 
				      						event={context.state.event} 
				      						floatingLabelText={v.label}
				  							floatingLabelFixed={true}
				      						hintText={v.label}
				      						style={style.field}
				      						{...v} 
				      					/>
				      				</div>
				      			);
				      	}
			      	})	
	
	            	context.setState({
	            		label: data.Items[0].label || '',
	            		fields: data.Items[0].fields || [],
	            		form: {
	            			fields: fields
	            		}
	            	});
	            }
	        }
	    }

	    dynamodb.query(this.params, result.bind(this));
	}

	onChange(data) {
		var newState = this.state;
		newState.fields[data.path].value = data.value;
		this.setState(newState);
	}

	onSave() {
		if (this.state.progress) {
			//console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ': request in progress.');
			return;
		}

		this.state.event.publish('onSave', null);

		var params = {
	        'TableName': table,
	        'Item': {
	        	id: this.state.id,
	        	cid: this.state.cid || (this.state.type || 'r') + ':' + this.state.class,
	        	type: this.state.type || 'r',
	        	class: this.state.class,
	        	label: this.state.label || '',
	        	fields: this.state.fields || []
	        }
	    }

	    this.setState({progress: true});

	    var result = function(err, data) {
	    	delete this.state.progress;
	    	if (err) {
	    		console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ' erro on create/update.');
	    	} else {
	    		//this.setState({previous: this.state.value});
	    		console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ' create/update OK.');
	    	}
	    	this.props.onClose();
	    }

	    dynamodb.put(params, result.bind(this));		
	}

	render() {
		const style = {
			form: {
				height: '500px',
				padding: '0px'
			},
			submit: {
				align: 'center',
				margin: 12
			}
		}
		return (
			<MuiThemeProvider>
				<div style={this.props.style || style.form}>
			    	<AppBar 
			    		title={this.state.label} 
			    		iconElementRight={
					      <IconMenu
					        iconButtonElement={
					          <IconButton><MoreVertIcon /></IconButton>
					        }
					        targetOrigin={{horizontal: 'right', vertical: 'top'}}
					        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					      >
					        <MenuItem primaryText="Adicionar" />
					        <MenuItem primaryText="Fechar" />
					        <MenuItem primaryText="Ajuda" />
					      </IconMenu>
					    }
			    	/>
			    	{this.state.form.fields}
					<RaisedButton label={'Gravar'} primary={true} onClick={this.onSave.bind(this)} style={style.submit} />
				</div>
		    </MuiThemeProvider>
		);
	}
}
