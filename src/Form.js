import React, { Component } from 'react';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, TextField, DatePicker, CircularProgress, Dialog, IconMenu, IconButton, MenuItem, RaisedButton, FlatButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import uuid from 'node-uuid';
//import async from 'async';
import 'aws-sdk/dist/aws-sdk';
const aws = window.AWS;

const table = 'altamira';

aws.config.update({accessKeyId: 'AKIAJROLVHLQQHOE72HA', secretAccessKey: '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','region': 'sa-east-1'});

const dynamodb = new aws.DynamoDB.DocumentClient();

class Field extends Component {
	constructor(props) {
		super(props);
		const generated_path = uuid.v4();
		this.state = {
			id: this.props.id,
			cid: this.props.cid || (this.props.type || 'a') + ':' + this.props.class + ':' + (this.props.path || generated_path),
			type: this.props.type || 'a',
			class: this.props.class,
			path: this.props.path || generated_path,
			label: this.props.label || '????',
			value: this.props.value || '',
			required: this.props.required || false,
			previous: null,
			progress: true
		};

		this.onChange = this.onChange.bind(this);
		this.onSave = this.onSave.bind(this);

		this.props.event.subscribe('onSave', this.onSave);

	    this.params = {
	        TableName: table,
	        KeyConditionExpression: "#k = :k and #s = :s",   
	        ExpressionAttributeNames: {
	        	"#k": "id",
	            "#s": "cid"
	        },
	        ExpressionAttributeValues: { 
	        	":k": this.state.id,
	            ":s": this.state.cid
	        },
	        Limit: 1
	    }

	    var result = function(err, data) {
	    	var context = this;
	        //console.log(data)
	        
	        if (err) {
	            console.log("Unable to find field value. Error:", JSON.stringify(err, null, 2));
	            context.setState({progress: false});
	        } else {
	            console.log("Query succeeded.");
	            
	            if (data.Count > 0) {
	              	console.log(JSON.stringify(data.Items))
	              	data.Items[0].previous = data.Items[0].value;
	              	data.Items[0].progress = false;
	              	context.setState(data.Items[0]);
	            	console.log('Field loaded.'); 
	            } else {
	            	context.setState({progress: false});
	            }

	        }
	    }

	    dynamodb.query(this.params, result.bind(this));			
	};	

	/*
	componentDidMount() {
	}

	componentWillMount() {
	}

	componentWillUnmount() {
	}
	*/

	onChange(event) {
	    this.setState({value: event.target.value});
	    this.props.event.publish('onChange', {cid: this.state.cid, value: event.target.value});
	}

	onSave(params) {
		if (this.state.value === this.state.previous || 
			this.state.value === undefined) {
			console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ':' + this.state.path + ' no changes to save.');
			return;
		}

		if (this.state.progress) {
			console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ':' + this.state.path + ' request in progress.');
			return;
		}

		var state = this.state;
		delete state.progress;

		params = {
	        'TableName': table,
	        'Item': this.state
	    }

	    this.setState({progress: true});

	    var result = function(err, data) {
	    	if (err) {
	    		console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ':' + this.state.path + ' erro on create/update field.');
	    		this.setState({progress: false});
	    	} else {
	    		console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ':' + this.state.path + ' create/update field OK.');
	    		this.setState({previous: this.state.value, progress: false});
	    	}
	    }

	    dynamodb.put(params, result.bind(this));
	}
}

class Code extends Field {
	componentWillMount() {
		this.state.mask = this.props.mask || null;
		this.state.format = this.props.format || null;
		this.state.validation = this.props.validation || null;
		console.log('Component will mount: ' + this.state.id + ':' + this.state.type + this.state.class + ':'  + this.state.path );
	}

	render() {
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		return (
			<div>
				<TextField 
					id={uuid.v4()} 
					onChange={this.onChange} 
					value={this.state.value} 
					fullWidth={true} 
					floatingLabelText={this.state.label}
					floatingLabelFixed={true}
				/>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}

class Name extends Field {
	/*componentWillMount() {
		this.state.loc = this.props.loc || null;
		this.state.mask = this.props.mask || null;
		this.state.lang = this.props.lang || null;
		console.log('Component will mount: ' + this.state.id + ':' + this.state.type);
	}*/

	render() {
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		return (
			<div>
				<TextField 
					id={uuid.v4()} 
					onChange={this.onChange} 
					value={this.state.value} 
					fullWidth={true} 
					floatingLabelText={this.state.label}
					floatingLabelFixed={true}
				/>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}

class Textbox extends Field {
	/*componentWillMount() {
		this.state.loc = this.props.loc || null;
		this.state.mask = this.props.mask || null;
		this.state.lang = this.props.lang || null;
		console.log('Component will mount: ' + this.state.id + ':' + this.state.type);
	}*/

	render() {
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		return (
			<div>
				<TextField 
					id={uuid.v4()} 
					onChange={this.onChange} 
					value={this.state.value} 
					fullWidth={true} 
					floatingLabelText={this.state.label}
					floatingLabelFixed={true}
				/>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}

class Datetime extends Field {
	constructor(props) {
		super(props);

		this.state.value = this.props.value === undefined || this.props.value === null || this.props.value.trim() === '' ? moment.utc().format() : this.props.value;

	}
	/*componentWillMount() {
		this.state.loc = this.props.loc || null;
		this.state.mask = this.props.mask || null;
		this.state.lang = this.props.lang || null;
		this.state.value = this.state.value || moment.utc().format();
		console.log('Component will mount: ' + this.state.id + ':' + this.state.type);
	}*/

	onChangeDate = (event, date) => {
	    this.setState({
	      value: date.getTimezoneOffset() > 0 ? moment(date).subtract(date.getTimezoneOffset() / 60, 'h').toJSON() : moment(date).add(date.getTimezoneOffset() / 60, 'h').toJSON()
	    });
	    this.props.event.publish('onChange', {cid: this.state.cid, value: date.getTimezoneOffset() > 0 ? moment(date).subtract(date.getTimezoneOffset() / 60, 'h').toJSON() : moment(date).add(date.getTimezoneOffset() / 60, 'h').toJSON()});
	};

	render() {
		const utc = moment.utc(this.state.value);
		const date = new Date(utc.year(), utc.month(), utc.date(), utc.toDate().getTimezoneOffset() / 60, 0, 0);
		const progress = {
			visibility: this.state.progress ? 'visible' : 'hidden', position: 'absolute'
		}
		return (
			<div>
				<DatePicker 
					id={uuid.v4()} 
					onChange={this.onChangeDate} 
					value={date} 
					formatDate={this.formatDate} 
					fullWidth={true}
					floatingLabelText={this.state.label}
					floatingLabelFixed={true}
				/>
				<CircularProgress size={0.5} style={progress} />
			</div>
		);
	}
}

class Form extends Component {
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
	            console.log("Query for Form Definition succeeded.");
	            
	            if (data.Count > 0) {
	              	console.log('Found Form Definition: ' + this.state.id + ':' + this.state.cid); 

	              	var fields = [];

	              	const style = {
	              		field: {
							marginLeft: '10px',
							marginRight: '10px'
						}
	              	}

				    if (data.Items[0].fields) data.Items[0].fields.forEach(function(v, k, a) {
				      	console.log('Loading field ' + v.type + ':' + v.class + ':' + v.path)
				      	switch(v.class) {
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
		this.state.fields.forEach(function(v, k, a) {
			if (v.cid === data.cid) {
				v.value = data.value;
				return;
			}
		});
	}

	onSave() {
		if (this.state.progress) {
			console.log(this.state.id + ':' + this.state.type + ':' + this.state.class + ': request in progress.');
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
				padding: '25px'
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

class FormDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			//open: this.props.open,
			degre: [2, -2, 2, -2, 2, -2, 2, -2, 2, 2, -2, -2, 2, -2, 2, -2].randomElement(),
			onSave: null
		}

		this.onOpen = this.onOpen.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);
	}

	onOpen() {
		this.setState({open: true});
	}

	onClose() {
		//this.setState({open: false});
		this.props.onClose();
	}

	onSave() {
		//this.setState({open: false});
		this.props.onClose();
	}

	render() {
		const actions = [
		  <FlatButton
		    label="Cancelar"
		    primary={true}
		    onTouchTap={this.onClose}
		  />,
		  <FlatButton
		    label="Gravar"
		    primary={true}
		    keyboardFocused={true}
		    onTouchTap={this.onSave}
		  />,
		];
		return (
			<MuiThemeProvider>
			<div>
				<Dialog	
					actions={actions}
					modal={false}
					open={this.props.open}
					onRequestClose={this.props.onClose}
					autoScrollBodyContent={true}
					{...this.props} 
				>
					<Form {...this.props} onClose={this.onSave.bind(this)} onSave={this.state.onSave} />
				</Dialog>
			</div>
			</MuiThemeProvider>
		);
	}	
}

export default FormDialog;