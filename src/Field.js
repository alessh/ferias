import { Component } from 'react';

import uuid from 'node-uuid';

export default class Field extends Component {
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
			progress: false
		};

		//if (this.props.values) this.state.values = this.props.values;

		this.onChange = this.onChange.bind(this);
		//this.onSave = this.onSave.bind(this);

	    /*
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
	            //console.log("Query succeeded.");
	            
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

	    dynamodb.query(this.params, result.bind(this));	*/		
	};	

	/*
	componentDidMount() {
	}

	componentWillMount() {
	}

	componentWillUnmount() {
	}
	*/

	//onChange = (event, index, value) => this.setState({value: value});
	onChange(event, index, value) {
	    this.setState({value: value || event.target.value});
	    this.props.event.publish('onChange', {path: this.state.path, value: value || event.target.value});
	}

	/*onSave(params) {
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
	}*/
}
