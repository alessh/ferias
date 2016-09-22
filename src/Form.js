import React, { Component } from 'react';

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
			type: this.props.schema.type,
			label: this.props.schema.label,
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
		}; // computed fields

		/*
		if (this.props.id) {
			this.params = {
		        TableName: table,
		        KeyConditionExpression: "#pk = :pk and #sk = :sk",   
		        ExpressionAttributeNames: {
		        	"#pk": "id",
		            "#sk": "type"
		        },
		        ExpressionAttributeValues: { 
		        	":pk": this.state.id,
		            ":sk": this.state.type
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
		              	console.log('Found Form Data: ' + this.state.id + ':' + this.state.type); 

		              	var newState = context.state;

					    if (data.Items[0]) {
					    	Object.keys(data.Items[0]).forEach(function(key) {
						    	newState[key] = data.Items[0][key];
					      	})
			            	context.setState(newState);
					    }	

		            }
		        }
		    }

		    //if (this.props.onProgress) this.props.onProgress('open', 'start');
		    
		    dynamodb.query(this.params, result.bind(this));
		}
		*/

	    this.onChange = this.onChange.bind(this);
	    this.onSave = this.onSave.bind(this);

	    this.state.event.subscribe('onChange', this.onChange);
	}

	onChange(data) {
		var newState = this.state;
		newState[data.path] = data.value;
		this.setState(newState);
	}

	onSave(callback) {
		if (this.state.progress) {
			console.log(this.state.id + ':' + this.state.type  + ': request in progress.');
			return;
		}

	    var context = this;
	    var state = {};

	    Object.keys(this.state).forEach( function(key) {
	    	if (key !== 'form' && key !== 'event' && key !== 'label') {
	    		state[key] = context.state[key];
	    	}
	    })

		var params = {
	        'TableName': table,
	        'Item': state
	    }

		this.props.onProgress('save', 'start');
		this.state.event.publish('onSave', null);

	    this.setState({progress: true});

	    var result = function(err, data) {
	    	if (err) {
	    		console.log(this.state.id + ':' + this.state.type + ' erro on create/update.');
	    		alert('Erro ao gravar os dados: ' + err);
	    	} else {
	    		console.log(this.state.id + ':' + this.state.type + ' create/update OK.');
	    		if (callback) callback();
	    	}
	    }

	    dynamodb.put(params, result.bind(this));		
	}

	render() {
		var fields = [];

		const style = {
			form: {
				height: '500px',
				padding: '0px'
			},
			submit: {
				align: 'center',
				margin: 12
			},
			field: {
				marginLeft: '10px',
				marginRight: '10px'
			}
		}

		var context = this;

	    if (this.props.schema.fields instanceof Array) Object.keys(this.props.schema.fields).forEach(function(key) {
	    	
	    	var v = context.props.schema.fields[key];
	      	console.log('Loading field ' + v.type + ':' + v.class + ':' + v.path)
	      	
	      	v.value = context.state[v.path] || null;
	      	
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
	      						text={v.text}
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

		return (
			<div style={this.props.style || style.form}>

		    	{fields}

			</div>
		);
	}
}
